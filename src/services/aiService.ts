/**
 * DeepSeek AI 服务
 * 提供情绪建议生成功能
 */

import type { MoodRecord } from '@/hooks/useMoodHistory';
import type { AIAdvice } from '@/hooks/useAIAdvice';

// API 配置
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const MODEL = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat';
const ENABLE_AI = import.meta.env.VITE_ENABLE_AI === 'true';

// 情绪映射（中文 -> 英文，用于提示词）
const moodMapping: Record<string, string> = {
  '焦虑': 'anxiety',
  '忧郁': 'melancholy',
  '快乐': 'happy',
  '懊悔': 'regret',
  '平静': 'calm',
  '期待': 'anticipation',
  '满足': 'content',
  '怀疑': 'doubt',
  '压力': 'stress',
};

interface AIRequestParams {
  currentMood: string;
  currentScene: string;
  recentRecords: MoodRecord[];
  historySummary?: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

/**
 * 构建系统提示词
 */
function buildSystemPrompt(): string {
  return `你是一位专业的心理健康顾问，擅长提供情绪支持和心理建议。

你的建议应该：
1. 温暖、共情、非评判性
2. 具体可操作，不只是泛泛而谈
3. 基于认知行为疗法(CBT)和正念疗法的原理
4. 适合中国文化和语言习惯
5. 长度适中（100-200字），易于阅读

输出格式必须是 JSON：
{
  "title": "建议标题（10字以内）",
  "content": "建议内容",
  "category": "immediate" | "pattern" | "lifestyle"
}

category 说明：
- immediate: 即时缓解技巧，当下就能做的
- pattern: 认知模式调整，改变思维方式
- lifestyle: 生活习惯建议，长期有益的改变`;
}

/**
 * 构建用户提示词
 */
function buildUserPrompt(params: AIRequestParams): string {
  const { currentMood, currentScene, recentRecords, historySummary } = params;
  
  // 情绪中文名映射（用于显示）
  const moodNameMapping: Record<string, string> = {
    'anxiety': '焦虑',
    'melancholy': '忧郁',
    'happy': '快乐',
    'regret': '懊悔',
    'calm': '平静',
    'anticipation': '期待',
    'content': '满足',
    'doubt': '怀疑',
    'stress': '压力',
  };
  
  // 将英文情绪ID转换为中文名
  const recentMoodsCn = recentRecords.slice(0, 7).map(r => moodNameMapping[r.moodId] || r.moodId);
  const moodCounts = recentMoodsCn.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominantMood = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || currentMood;
  
  const isRecurring = recentMoodsCn.filter(m => m === currentMood).length >= 3;
  
  return `用户当前状态：
- 当前情绪：${currentMood}
- 当前场景：${currentScene}
- 最近7次记录：${recentMoodsCn.join('、') || '无'}
- 主导情绪：${dominantMood}
- 是否反复出现：${isRecurring ? '是' : '否'}
${historySummary ? `- 历史总结：${historySummary}` : ''}

请根据以上信息，提供一条个性化的情绪建议。

重要：
1. 建议内容请只使用中文情绪名称（如：焦虑、忧郁、快乐等）
2. 不要出现英文情绪名称
3. 建议要针对当前情绪和场景
4. 如果是反复出现的情绪，请提供更深层的认知调整建议`;
}

/**
 * 调用 DeepSeek API 生成建议
 */
export async function generateAIAdviceWithDeepSeek(
  params: AIRequestParams
): Promise<AIAdvice | null> {
  // 检查是否启用 AI
  if (!ENABLE_AI || !API_KEY) {
    return null;
  }

  // 构建提示词
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(params);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data: DeepSeekResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from API');
    }

    // 解析 JSON 响应
    const parsed = JSON.parse(content);
    
    // 将中文情绪名转换为英文 ID
    const moodId = moodMapping[params.currentMood] || params.currentMood;
    
    return {
      id: `ai-${Date.now()}`,
      title: parsed.title || 'AI 建议',
      content: parsed.content || content,
      category: parsed.category || 'immediate',
      moodId: moodId,
      isAIGenerated: true,
    };
  } catch (error) {
    console.error('[AI Service] Failed to generate advice:', error);
    return null;
  }
}

/**
 * 批量生成多个建议（用于预加载）
 */
export async function generateMultipleAdvices(
  params: AIRequestParams,
  count: number = 3
): Promise<AIAdvice[]> {
  const advices: AIAdvice[] = [];
  
  for (let i = 0; i < count; i++) {
    const advice = await generateAIAdviceWithDeepSeek({
      ...params,
      historySummary: `这是第 ${i + 1} 条建议，请从不同角度提供`,
    });
    
    if (advice) {
      // 确保每条建议的 category 不同
      const categories: Array<'cognition' | 'acceptance' | 'reframe' | 'support'> = ['cognition', 'acceptance', 'reframe', 'support'];
      advice.category = categories[i % 4];
      advices.push(advice);
    }
    
    // 添加小延迟，避免请求过快
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return advices;
}

/**
 * 检查 AI 服务是否可用
 */
export function isAIServiceAvailable(): boolean {
  return ENABLE_AI && !!API_KEY && API_KEY !== 'your_deepseek_api_key_here';
}

/**
 * 获取 AI 服务状态信息
 */
export function getAIServiceStatus(): {
  enabled: boolean;
  hasKey: boolean;
  model: string;
} {
  return {
    enabled: ENABLE_AI,
    hasKey: !!API_KEY && API_KEY !== 'your_deepseek_api_key_here',
    model: MODEL,
  };
}
