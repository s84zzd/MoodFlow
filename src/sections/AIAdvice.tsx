import { useEffect, useState } from 'react';
import { Sparkles, Lightbulb, Heart, Brain, Loader2, RefreshCw, Zap } from 'lucide-react';
import type { Mood } from '@/types';
import type { MoodStats, MoodRecord } from '@/hooks/useMoodHistory';
import type { AIAdvice } from '@/hooks/useAIAdvice';

interface AIAdviceProps {
  currentMood: Mood | null;
  stats: MoodStats;
  recentRecords: MoodRecord[];
  isActive: boolean;
  onGenerateLocalAdvice: (mood?: Mood | null, records?: MoodRecord[], excludeId?: string) => Promise<AIAdvice>;
  onGenerateAIAdvice: (mood?: Mood | null, records?: MoodRecord[]) => Promise<AIAdvice | null>;
  getRemainingAIAdviceCount: () => number;
  getPersonalizedInsights: (stats: MoodStats, records?: MoodRecord[]) => string[];
  isGenerating: boolean;
}

export function AIAdviceSection({
  currentMood,
  stats,
  recentRecords,
  isActive,
  onGenerateLocalAdvice,
  onGenerateAIAdvice,
  getRemainingAIAdviceCount,
  getPersonalizedInsights,
  isGenerating,
}: AIAdviceProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [remainingAIAdvice, setRemainingAIAdvice] = useState(8);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  // Generate local advice on first load
  useEffect(() => {
    if (isActive && !advice && !isGenerating) {
      handleGenerateLocalAdvice();
    }
  }, [isActive]);

  // Update remaining AI advice count
  useEffect(() => {
    setRemainingAIAdvice(getRemainingAIAdviceCount());
  }, [advice, getRemainingAIAdviceCount]);

  const handleGenerateLocalAdvice = async () => {
    // 传递当前建议的ID，以便获取不同的建议
    const currentAdviceId = advice?.id;
    const newAdvice = await onGenerateLocalAdvice(currentMood, recentRecords, currentAdviceId);
    setAdvice(newAdvice);
    setInsights(getPersonalizedInsights(stats, recentRecords));
  };

  const handleGenerateAIAdvice = async () => {
    // 如果 currentMood 为 null，尝试从 recentRecords 中获取
    let moodForAI = currentMood;
    if (!moodForAI && recentRecords.length > 0) {
      const latestRecord = recentRecords[0];
      moodForAI = {
        id: latestRecord.moodId,
        name: latestRecord.moodName,
        color: latestRecord.moodColor,
        bgColor: '',
        ringColor: '',
        icon: latestRecord.moodIcon,
        description: '',
      };
    }
    
    if (!moodForAI) {
      alert('请先选择或记录一个情绪');
      return;
    }
    
    try {
      const aiAdvice = await onGenerateAIAdvice(moodForAI, recentRecords);
      if (aiAdvice) {
        setAdvice(aiAdvice);
        setInsights(getPersonalizedInsights(stats, recentRecords));
      } else {
        alert('AI 生成失败，请稍后重试');
      }
    } catch (error) {
      alert('AI 生成出错，请稍后重试');
    }
  };

  if (!isActive) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'immediate':
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'pattern':
        return <Brain className="w-5 h-5 text-purple-500" />;
      case 'lifestyle':
        return <Heart className="w-5 h-5 text-rose-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'immediate':
        return '即时建议';
      case 'pattern':
        return '模式洞察';
      case 'lifestyle':
        return '生活方式';
      default:
        return 'AI 建议';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'immediate':
        return 'bg-amber-50 text-amber-600';
      case 'pattern':
        return 'bg-purple-50 text-purple-600';
      case 'lifestyle':
        return 'bg-rose-50 text-rose-600';
      default:
        return 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/30 pointer-events-none" />

      <div className={`relative z-10 text-center mb-10 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm mb-4">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm text-gray-600">AI 情绪助手</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
          个性化心理健康建议
        </h2>
        <p className="text-gray-500">
          基于你的情绪模式，为你生成专属建议
        </p>
      </div>

      {/* AI Advice Card */}
      <div className={`relative z-10 w-full max-w-2xl mb-8 transition-all duration-700 delay-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {isGenerating ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/60 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
            <p className="text-gray-600">AI 正在分析你的情绪模式...</p>
          </div>
        ) : advice ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/60">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getCategoryColor(advice.category)}`}>
                {getCategoryIcon(advice.category)}
              </div>
              <div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(advice.category)}`}>
                  {getCategoryLabel(advice.category)}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-1">{advice.title}</h3>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
              <p className="text-gray-700 leading-relaxed">{advice.content}</p>
            </div>

            {/* AI生成提示 */}
            {!advice.isAIGenerated && remainingAIAdvice > 0 && (
              <div className="mb-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700">AI 智能生成</span>
                </div>
                <p className="text-xs text-amber-600 mb-3">
                  当前为系统预设建议。使用 AI 生成可获得更个性化的深度分析。
                </p>
                <button
                  onClick={handleGenerateAIAdvice}
                  disabled={isGenerating}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-sm font-medium hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI 生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      使用 AI 生成（今日剩余 {remainingAIAdvice} 次）
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 额度用完提示 */}
            {!advice.isAIGenerated && remainingAIAdvice === 0 && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-500">
                  今日 AI 生成额度已用完，明天再来吧～
                </p>
              </div>
            )}

            {/* AI生成标记 */}
            {advice.isAIGenerated && (
              <div className="mb-4 flex items-center justify-center gap-2 text-purple-500">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI 智能生成</span>
              </div>
            )}

            <button
              onClick={handleGenerateLocalAdvice}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              换一条建议
            </button>
          </div>
        ) : null}
      </div>

      {/* Personalized Insights */}
      {insights.length > 0 && (
        <div className={`relative z-10 w-full max-w-2xl transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/60">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              你的情绪洞察
            </h3>
            
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-purple-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className={`relative z-10 mt-8 w-full max-w-2xl transition-all duration-700 delay-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-rose-100 rounded-2xl p-6">
          <p className="text-center text-sm text-gray-500">
            💡 基于你记录的 <span className="font-semibold text-purple-600">{stats.totalRecords}</span> 条情绪数据生成
          </p>
        </div>
      </div>
    </section>
  );
}
