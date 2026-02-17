import { useEffect, useState } from 'react';
import { Sparkles, Lightbulb, Heart, Brain, Loader2, RefreshCw } from 'lucide-react';
import type { Mood } from '@/types';
import type { MoodStats, MoodRecord } from '@/hooks/useMoodHistory';
import type { AIAdvice } from '@/hooks/useAIAdvice';

interface AIAdviceProps {
  currentMood: Mood | null;
  stats: MoodStats;
  recentRecords: MoodRecord[];
  isActive: boolean;
  onGenerateAdvice: (mood?: Mood | null, stats?: MoodStats, records?: MoodRecord[]) => Promise<AIAdvice>;
  getPersonalizedInsights: (stats: MoodStats, records?: MoodRecord[]) => string[];
  isGenerating: boolean;
}

export function AIAdviceSection({
  currentMood,
  stats,
  recentRecords,
  isActive,
  onGenerateAdvice,
  getPersonalizedInsights,
  isGenerating,
}: AIAdviceProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  // Generate advice on first load
  useEffect(() => {
    if (isActive && !advice && !isGenerating) {
      handleGenerateAdvice();
    }
  }, [isActive]);

  const handleGenerateAdvice = async () => {
    const newAdvice = await onGenerateAdvice(currentMood, stats, recentRecords);
    setAdvice(newAdvice);
    setInsights(getPersonalizedInsights(stats, recentRecords));
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

            <button
              onClick={handleGenerateAdvice}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-400 to-pink-500 text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              获取新建议
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
