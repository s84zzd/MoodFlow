/**
 * AI 报告服务
 * 生成周报和月报的深度情绪分析
 * 
 * 生成规则：
 * - 周报：每周六 18:00 自动生成，用户每周可手动生成 2 次
 * - 月报：每月最后一天 18:00 自动生成，用户每月可手动生成 4 次
 */

import type { PeriodStats, AIReport } from '@/hooks/useStatistics';
import type { MoodRecord } from '@/hooks/useMoodHistory';

// API 配置
const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
const API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
const MODEL = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-chat';
const ENABLE_AI = import.meta.env.VITE_ENABLE_AI === 'true';
const ENABLE_REPORT_LIMIT = import.meta.env.VITE_ENABLE_REPORT_LIMIT !== 'false'; // 默认启用限制

// 缓存键前缀
const CACHE_PREFIX = 'moodflow_report_';
const MANUAL_COUNT_PREFIX = 'moodflow_report_manual_count_';
const CACHE_SNAPSHOT_PREFIX = 'moodflow_report_snapshot_';

// 手动生成限制
const WEEKLY_MANUAL_LIMIT = 2;
const MONTHLY_MANUAL_LIMIT = 4;

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
 * 获取当前周期键（用于缓存和次数限制）
 * 周报：2024-W01 格式
 * 月报：2024-M01 格式
 */
function getPeriodKey(type: 'weekly' | 'monthly'): string {
  const now = new Date();
  const year = now.getFullYear();
  
  if (type === 'weekly') {
    // 获取当前是第几周
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  } else {
    // 获取当前月份
    const month = now.getMonth() + 1;
    return `${year}-M${month.toString().padStart(2, '0')}`;
  }
}

/**
 * 获取格式化的日期范围（用于显示）
 * 手动生成时，向前推7天或30天
 */
function getPeriodRange(type: 'weekly' | 'monthly', endDate?: Date): string {
  const end = endDate || new Date();
  const start = new Date(end);
  
  if (type === 'weekly') {
    start.setDate(start.getDate() - 6);
    return `${start.getMonth() + 1}月${start.getDate()}日-${end.getMonth() + 1}月${end.getDate()}日`;
  } else {
    start.setDate(start.getDate() - 29);
    return `${start.getMonth() + 1}月${start.getDate()}日-${end.getMonth() + 1}月${end.getDate()}日`;
  }
}

/**
 * 检查是否应该自动生成周报（每周六 18:00 后）
 */
export function shouldAutoGenerateWeekly(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0=周日, 6=周六
  const hour = now.getHours();
  
  // 周六 18:00 后
  return day === 6 && hour >= 18;
}

/**
 * 检查是否应该自动生成月报（每月最后一天 18:00 后）
 */
export function shouldAutoGenerateMonthly(): boolean {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const day = now.getDate();
  const hour = now.getHours();
  
  // 最后一天 18:00 后
  return day === lastDayOfMonth && hour >= 18;
}

/**
 * 获取手动生成次数
 */
function getManualCount(type: 'weekly' | 'monthly'): number {
  try {
    const periodKey = getPeriodKey(type);
    const key = `${MANUAL_COUNT_PREFIX}${type}_${periodKey}`;
    const count = localStorage.getItem(key);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * 增加手动生成次数
 */
function incrementManualCount(type: 'weekly' | 'monthly'): void {
  try {
    const periodKey = getPeriodKey(type);
    const key = `${MANUAL_COUNT_PREFIX}${type}_${periodKey}`;
    const current = getManualCount(type);
    localStorage.setItem(key, (current + 1).toString());
  } catch (error) {
    console.error('[Report Service] Failed to increment manual count:', error);
  }
}

/**
 * 检查是否可以手动生成
 */
export function canManualGenerate(type: 'weekly' | 'monthly'): boolean {
  // 本地开发时可以取消限制
  if (!ENABLE_REPORT_LIMIT) {
    return true;
  }
  
  const count = getManualCount(type);
  const limit = type === 'weekly' ? WEEKLY_MANUAL_LIMIT : MONTHLY_MANUAL_LIMIT;
  return count < limit;
}

/**
 * 获取剩余手动生成次数
 */
export function getRemainingManualCount(type: 'weekly' | 'monthly'): number {
  // 本地开发时显示无限
  if (!ENABLE_REPORT_LIMIT) {
    return 999; // 显示为无限次数
  }
  
  const count = getManualCount(type);
  const limit = type === 'weekly' ? WEEKLY_MANUAL_LIMIT : MONTHLY_MANUAL_LIMIT;
  return Math.max(0, limit - count);
}

/**
 * 检测报告是否与当前数据一致
 * 用于在额度用完时提示用户
 * @returns true 表示报告是最新的，false 表示数据已变化
 */
export function isReportUpToDate(type: 'weekly' | 'monthly', stats: PeriodStats): boolean {
  const periodKey = getPeriodKey(type);
  const snapshotKey = `${CACHE_SNAPSHOT_PREFIX}${type}_${periodKey}`;
  const cachedSnapshot = localStorage.getItem(snapshotKey);
  
  // 没有缓存快照，认为不一致
  if (!cachedSnapshot) return true;
  
  const currentSnapshot = generateDataSnapshot(stats);
  return cachedSnapshot === currentSnapshot;
}

/**
 * 生成数据快照，用于验证缓存是否仍然有效
 * 包含：总记录数、主要情绪、情绪分布哈希
 */
function generateDataSnapshot(stats: PeriodStats): string {
  const total = stats.total;
  const topEmotions = stats.topEmotions.slice(0, 3).join(',');
  const distribution = stats.emotions
    .map(e => `${e.name}:${e.count}`)
    .join('|');
  return `${total}|${topEmotions}|${distribution}`;
}

/**
 * 获取缓存的报告
 * 按周期缓存，并验证数据是否变化
 * @param stats 当前统计数据，用于验证缓存有效性
 */
function getCachedReport(type: 'weekly' | 'monthly', stats?: PeriodStats): AIReport | null {
  try {
    const periodKey = getPeriodKey(type);
    const key = `${CACHE_PREFIX}${type}_${periodKey}`;
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    // 如果提供了 stats，验证数据是否变化
    if (stats) {
      const snapshotKey = `${CACHE_SNAPSHOT_PREFIX}${type}_${periodKey}`;
      const cachedSnapshot = localStorage.getItem(snapshotKey);
      const currentSnapshot = generateDataSnapshot(stats);
      
      if (cachedSnapshot !== currentSnapshot) {
        console.log(`[Report Service] Data changed, invalidating ${type} cache`);
        console.log(`[Report Service] Cached snapshot: ${cachedSnapshot}`);
        console.log(`[Report Service] Current snapshot: ${currentSnapshot}`);
        // 数据变化，清除旧缓存
        localStorage.removeItem(key);
        localStorage.removeItem(snapshotKey);
        return null;
      }
    }
    
    return JSON.parse(cached) as AIReport;
  } catch {
    return null;
  }
}

/**
 * 缓存报告和数据快照
 */
function cacheReport(report: AIReport, stats: PeriodStats): void {
  try {
    const periodKey = getPeriodKey(report.type);
    const key = `${CACHE_PREFIX}${report.type}_${periodKey}`;
    const snapshotKey = `${CACHE_SNAPSHOT_PREFIX}${report.type}_${periodKey}`;
    
    localStorage.setItem(key, JSON.stringify(report));
    localStorage.setItem(snapshotKey, generateDataSnapshot(stats));
  } catch (error) {
    console.error('[Report Service] Failed to cache report:', error);
  }
}

/**
 * 构建周报提示词
 */
function buildWeeklyPrompt(stats: PeriodStats, records: MoodRecord[]): string {
  const dominantMood = stats.topEmotions[0] || '未知';
  const moodDistribution = stats.emotions
    .map(e => `${e.name}: ${e.count}次(${e.percentage}%)`)
    .join('，');
  
  // 计算与上周的对比（简化版）
  const totalRecords = records.length;
  
  return `请为用户生成一份情绪周报分析。

【数据概况】
- 统计周期：近7天
- 总记录数：${stats.total}次
- 主要情绪：${dominantMood}
- 情绪分布：${moodDistribution}
- 历史记录总数：${totalRecords}条

【输出要求】
请生成JSON格式的周报，包含以下字段：
{
  "dominantMood": "主要情绪名称",
  "summary": "一句话总结本周情绪状态（15字以内）",
  "analysis": "简要分析（2-3句话，温暖、共情、专业的语气）",
  "suggestions": ["建议1", "建议2", "建议3"],
  "trend": "up|down|stable"
}

trend说明：
- up: 情绪整体向好
- down: 情绪需要关注
- stable: 情绪相对稳定

注意：
1. 分析要针对主要情绪${dominantMood}展开
2. 建议要具体可操作
3. 语气要温暖、非评判性`;
}

/**
 * 构建月报提示词
 * 月报需要比周报更有深度和专业度
 */
function buildMonthlyPrompt(stats: PeriodStats, records: MoodRecord[]): string {
  const top3Moods = stats.topEmotions.slice(0, 3).join('、') || '未知';
  const moodDistribution = stats.emotions
    .map(e => `${e.name}: ${e.count}次(${e.percentage}%)`)
    .join('，');
  
  // 计算情绪稳定性指数
  const stabilityIndex = calculateStabilityIndex(stats);
  
  // 分析情绪演变趋势
  const weeklyTrends = analyzeWeeklyTrends(records);
  
  // 识别情绪触发模式
  const triggerPatterns = identifyTriggerPatterns(records);
  
  // 分析情绪组合特征
  const moodCombinationAnalysis = analyzeMoodCombination(stats.topEmotions);
  
  // 识别高风险情绪日
  const highRiskPattern = identifyHighRiskPattern(records);
  
  return `你是一位拥有10年临床经验的资深心理咨询师和情绪管理专家，擅长运用认知行为疗法(CBT)、正念减压(MBSR)、情绪调节理论和积极心理学等方法进行深度心理分析。

【用户数据画像】
统计周期：本月（近30天完整周期）
总记录数：${stats.total}次情绪打卡（平均每天${(stats.total / 30).toFixed(1)}次记录）
核心情绪组合：${top3Moods}
详细情绪分布：${moodDistribution}
情绪稳定性指数：${stabilityIndex}/10（${stabilityIndex >= 7 ? '情绪相对稳定' : stabilityIndex >= 4 ? '情绪有波动' : '情绪波动较大'}）
周度演变趋势：${weeklyTrends}
主要触发场景：${triggerPatterns}
情绪组合特征：${moodCombinationAnalysis}
高风险情绪模式：${highRiskPattern}

【五维专业分析框架】

维度一：情绪基线与心理需求分析（Emotional Baseline & Needs）
- 深入解析用户的情绪"常态"和"舒适区"特征
- 运用马斯洛需求层次理论分析主导情绪背后的未满足需求
- 识别情绪表达模式（压抑型/宣泄型/调节型）

维度二：情绪调节能力深度评估（Emotional Regulation Assessment）
- 基于Gross情绪调节过程模型，评估用户在情绪产生前的情境选择能力
- 分析情绪产生后的认知重评和反应调整策略
- 识别用户已具备的情绪调节优势和待发展的能力领域

维度三：认知-情绪互动模式解析（Cognitive-Emotional Dynamics）
- 运用认知三角理论（想法-情绪-行为）分析用户的自动化思维模式
- 识别可能存在的认知偏差（如灾难化思维、过度概括、选择性注意等）
- 分析核心信念如何影响日常情绪体验

维度四：社会情境与系统因素分析（Socio-Contextual Analysis）
- 分析工作/学习压力、人际关系、生活环境等外部因素对情绪的影响权重
- 识别情绪波动的情境触发点和脆弱时刻
- 评估社会支持系统的利用情况

维度五：发展性成长视角（Developmental Growth Perspective）
- 将本月情绪放在个人成长历程中理解
- 识别本月情绪波动中蕴含的个人成长契机
- 基于优势视角，发掘用户内在的心理资源和韧性

【输出格式要求 - 必须严格遵守】
请生成以下JSON格式的专业月报，analysis字段必须达到400-500字：

{
  "dominantMood": "核心情绪名称（体现情绪组合特征，如'焦虑-压力主导型'）",
  "summary": "本月情绪主题总结（20-25字，有洞察力和画面感）",
  "analysis": "【字数要求：严格400-500个汉字，不得少于400字】专业深度分析（必须写满400-500字，约10-12句话。内容必须包含：1.情绪基线与心理需求解读 2.情绪调节能力评估 3.认知-情绪互动模式分析 4.社会情境影响分析 5.发展性成长建议。要有具体数据支撑，如'焦虑占17%'等，避免空泛套话，像资深咨询师写案例报告一样专业深入。请确保字数达标，这是最重要的要求）",
  "suggestions": [
    "基于CBT的长期策略1（60-80字，包含具体方法、实施步骤、预期效果）",
    "基于正念减压的长期策略2（60-80字，包含具体练习方法、频率建议）", 
    "基于情绪调节理论的长期策略3（60-80字，针对用户具体情绪模式的调节技巧）",
    "基于积极心理学的长期策略4（60-80字，聚焦优势发掘和心理资本建设）"
  ],
  "trend": "up|down|stable",
  "nextMonthFocus": "下月情绪管理核心重点（30-40字，具体、可操作、针对用户核心情绪问题）"
}

【专业写作要求 - 必须严格遵守】
1. **字数达标是第一要求**：analysis字段必须写满400-500个汉字，suggestions每条必须60-80字
2. 使用专业但易懂的心理学术语，展现专业深度
3. 分析要有洞察力和启发性，像咨询师在解读个案
4. 结合用户具体情绪数据（如焦虑17%、压力15%）给出个性化解读
5. 每个建议都要具体可操作，不能是泛泛的"保持好心情"
6. 语气专业、温暖、有力量，既有专业权威感又有共情温度
7. 避免使用"你需要""你应该"等说教语气，改用"可以尝试""建议关注"等赋能语气
8. 在生成内容后，请自检字数是否达标，不达标请补充内容`;
}

/**
 * 分析情绪组合特征
 */
function analyzeMoodCombination(topEmotions: string[]): string {
  if (topEmotions.length < 2) return '情绪类型单一';
  
  const combinations: Record<string, string> = {
    '焦虑,压力': '高压焦虑型',
    '忧郁,懊悔': '抑郁反刍型',
    '快乐,满足': '积极稳定型',
    '焦虑,忧郁': '内耗困扰型',
    '压力,怀疑': '职场倦怠型',
  };
  
  const key = topEmotions.slice(0, 2).join(',');
  return combinations[key] || '混合情绪型';
}

/**
 * 识别高风险情绪模式
 */
function identifyHighRiskPattern(records: MoodRecord[]): string {
  if (records.length === 0) return '无数据';
  
  // 统计连续负面情绪天数
  const negativeMoods = ['焦虑', '忧郁', '懊悔', '压力', '怀疑'];
  let consecutiveNegativeDays = 0;
  let maxConsecutive = 0;
  let lastDate = '';
  
  records.forEach(r => {
    const date = new Date(r.timestamp).toDateString();
    if (date !== lastDate) {
      if (negativeMoods.includes(r.moodName)) {
        consecutiveNegativeDays++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveNegativeDays);
      } else {
        consecutiveNegativeDays = 0;
      }
      lastDate = date;
    }
  });
  
  if (maxConsecutive >= 5) return `连续${maxConsecutive}天负面情绪，需重点关注`;
  if (maxConsecutive >= 3) return `最长${maxConsecutive}天负面情绪波动`;
  return '无连续负面情绪模式';
}

/**
 * 计算情绪稳定性指数
 */
function calculateStabilityIndex(stats: PeriodStats): number {
  if (stats.total === 0) return 0;
  
  // 情绪种类越多，稳定性越低
  const varietyScore = Math.max(0, 10 - stats.emotions.length * 1.5);
  
  // 主导情绪占比越高，稳定性越高
  const dominantEmotion = stats.emotions[0];
  const dominanceScore = dominantEmotion ? dominantEmotion.percentage / 10 : 0;
  
  return Math.round((varietyScore + dominanceScore) / 2);
}

/**
 * 分析周度趋势
 */
function analyzeWeeklyTrends(records: MoodRecord[]): string {
  if (records.length < 7) return '数据不足';
  
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  
  // 分四周统计
  const weeks = [
    { start: now - oneWeek, end: now, label: '第4周' },
    { start: now - 2 * oneWeek, end: now - oneWeek, label: '第3周' },
    { start: now - 3 * oneWeek, end: now - 2 * oneWeek, label: '第2周' },
    { start: now - 4 * oneWeek, end: now - 3 * oneWeek, label: '第1周' },
  ];
  
  const weekCounts = weeks.map(w => {
    const count = records.filter(r => r.timestamp >= w.start && r.timestamp < w.end).length;
    return `${w.label}:${count}次`;
  });
  
  return weekCounts.join('，');
}

/**
 * 识别触发模式
 */
function identifyTriggerPatterns(records: MoodRecord[]): string {
  if (records.length === 0) return '无数据';
  
  // 统计场景分布
  const sceneMap: Record<string, number> = {};
  records.forEach(r => {
    if (r.sceneName) {
      sceneMap[r.sceneName] = (sceneMap[r.sceneName] || 0) + 1;
    }
  });
  
  const sortedScenes = Object.entries(sceneMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => `${name}(${count}次)`);
  
  return sortedScenes.join('、') || '无明显模式';
}

/**
 * 调用 DeepSeek API 生成报告
 * @param isMonthly 是否为月报（月报需要更长的输出）
 */
async function callDeepSeekAPI(prompt: string, isMonthly: boolean = false): Promise<string | null> {
  if (!ENABLE_AI || !API_KEY) {
    console.log('[Report Service] AI disabled or no API key');
    return null;
  }

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
            content: isMonthly 
              ? '你是一位资深心理咨询师和情绪管理专家，拥有丰富的心理咨询经验。你的分析要专业、深入、有洞察力，运用心理学理论帮助用户深度理解自己的情绪模式，提供基于循证心理学的长期成长建议。'
              : '你是一位专业的心理健康顾问，擅长情绪分析和心理洞察。你的分析要专业、温暖、有深度，帮助用户更好地理解自己的情绪模式。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: isMonthly ? 0.5 : 0.7,
        max_tokens: isMonthly ? 4000 : 800,
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

    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('[Report Service] API call failed:', error);
    return null;
  }
}

/**
 * 生成周报
 * @param isManual 是否手动生成（影响次数限制）
 */
export async function generateWeeklyReport(
  stats: PeriodStats,
  records: MoodRecord[],
  isManual: boolean = false
): Promise<AIReport | null> {
  // 手动生成时检查次数限制
  if (isManual && !canManualGenerate('weekly')) {
    console.log('[Report Service] Weekly manual limit reached');
    return null;
  }
  
  // 检查缓存（验证数据是否变化）
  const cached = getCachedReport('weekly', stats);
  if (cached) {
    console.log('[Report Service] Using cached weekly report');
    return cached;
  }

  // 数据不足时不生成
  if (stats.total < 3) {
    console.log('[Report Service] Not enough data for weekly report');
    return null;
  }

  const period = getPeriodRange('weekly');
  const prompt = buildWeeklyPrompt(stats, records);
  const content = await callDeepSeekAPI(prompt);
  
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content);
    
    const report: AIReport = {
      id: `weekly-${Date.now()}`,
      type: 'weekly',
      period,
      generatedAt: Date.now(),
      dominantMood: parsed.dominantMood || stats.topEmotions[0] || '未知',
      summary: parsed.summary || '本周情绪记录',
      analysis: parsed.analysis || '暂无分析',
      suggestions: parsed.suggestions || ['继续记录情绪', '关注情绪变化', '保持积极心态'],
      trend: parsed.trend || 'stable',
    };
    
    cacheReport(report, stats);
    
    // 手动生成时增加次数
    if (isManual) {
      incrementManualCount('weekly');
    }
    
    return report;
  } catch (error) {
    console.error('[Report Service] Failed to parse weekly report:', error);
    return null;
  }
}

/**
 * 生成月报
 * @param isManual 是否手动生成（影响次数限制）
 */
export async function generateMonthlyReport(
  stats: PeriodStats,
  records: MoodRecord[],
  isManual: boolean = false
): Promise<AIReport | null> {
  // 手动生成时检查次数限制
  if (isManual && !canManualGenerate('monthly')) {
    console.log('[Report Service] Monthly manual limit reached');
    return null;
  }
  
  // 检查缓存（手动生成时跳过缓存，并验证数据是否变化）
  if (!isManual) {
    const cached = getCachedReport('monthly', stats);
    if (cached) {
      console.log('[Report Service] Using cached monthly report');
      return cached;
    }
  }

  // 数据不足时不生成
  if (stats.total < 7) {
    console.log('[Report Service] Not enough data for monthly report');
    return null;
  }

  const period = getPeriodRange('monthly');
  const prompt = buildMonthlyPrompt(stats, records);
  
  // 调试：打印 prompt 长度和部分内容
  console.log('[Report Service] Monthly prompt length:', prompt.length);
  console.log('[Report Service] Monthly prompt preview:', prompt.substring(0, 200) + '...');
  
  const content = await callDeepSeekAPI(prompt, true);
  
  if (!content) {
    return null;
  }

  // 调试：打印返回内容长度
  console.log('[Report Service] Monthly response length:', content.length);
  console.log('[Report Service] Monthly analysis length:', JSON.parse(content).analysis?.length || 0);

  try {
    const parsed = JSON.parse(content);
    
    const report: AIReport = {
      id: `monthly-${Date.now()}`,
      type: 'monthly',
      period,
      generatedAt: Date.now(),
      dominantMood: parsed.dominantMood || stats.topEmotions[0] || '未知',
      summary: parsed.summary || '本月情绪记录',
      analysis: parsed.analysis || '暂无分析',
      suggestions: parsed.suggestions || ['继续记录情绪', '关注情绪模式', '寻求专业帮助如有需要'],
      trend: parsed.trend || 'stable',
    };
    
    // 如果有下月重点，加入建议列表
    if (parsed.nextMonthFocus) {
      report.suggestions.push(parsed.nextMonthFocus);
    }
    
    cacheReport(report, stats);
    
    // 手动生成时增加次数
    if (isManual) {
      incrementManualCount('monthly');
    }
    
    return report;
  } catch (error) {
    console.error('[Report Service] Failed to parse monthly report:', error);
    return null;
  }
}

/**
 * 强制重新生成报告（忽略缓存，作为手动生成）
 */
export async function regenerateReport(
  type: 'weekly' | 'monthly',
  stats: PeriodStats,
  records: MoodRecord[]
): Promise<AIReport | null> {
  // 检查手动生成次数
  if (!canManualGenerate(type)) {
    console.log(`[Report Service] Manual limit reached for ${type} report`);
    return null;
  }
  
  // 清除缓存和快照
  const periodKey = getPeriodKey(type);
  const key = `${CACHE_PREFIX}${type}_${periodKey}`;
  const snapshotKey = `${CACHE_SNAPSHOT_PREFIX}${type}_${periodKey}`;
  localStorage.removeItem(key);
  localStorage.removeItem(snapshotKey);
  
  // 重新生成（标记为手动生成）
  if (type === 'weekly') {
    return generateWeeklyReport(stats, records, true);
  } else {
    return generateMonthlyReport(stats, records, true);
  }
}

/**
 * 检查报告服务是否可用
 */
export function isReportServiceAvailable(): boolean {
  return ENABLE_AI && !!API_KEY && API_KEY !== 'your_deepseek_api_key_here';
}
