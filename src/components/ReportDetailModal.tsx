/**
 * 报告详情弹窗
 * 展示周报/月报的完整AI分析内容
 */

import { X, RefreshCw, TrendingUp, TrendingDown, Minus, Sparkles, Lightbulb, Calendar } from 'lucide-react';
import type { AIReport } from '@/hooks/useStatistics';

interface ReportDetailModalProps {
  report: AIReport | null;
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: () => void;
  isGenerating: boolean;
}

// 情绪颜色映射
const moodColors: Record<string, string> = {
  '焦虑': '#ef4444',
  '忧郁': '#3b82f6',
  '快乐': '#eab308',
  '懊悔': '#8b5cf6',
  '平静': '#22c55e',
  '期待': '#f97316',
  '满足': '#a16207',
  '怀疑': '#374151',
  '压力': '#9ca3af',
};

export function ReportDetailModal({
  report,
  isOpen,
  onClose,
  onRegenerate,
  isGenerating,
}: ReportDetailModalProps) {
  if (!isOpen || !report) return null;

  const trendIcon = {
    up: <TrendingUp className="w-5 h-5 text-green-500" />,
    down: <TrendingDown className="w-5 h-5 text-red-500" />,
    stable: <Minus className="w-5 h-5 text-gray-500" />,
  }[report.trend];

  const trendText = {
    up: '情绪向好',
    down: '需要关注',
    stable: '相对稳定',
  }[report.trend];

  const moodColor = moodColors[report.dominantMood] || '#9ca3af';
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-rose-400 to-pink-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">
              {report.type === 'weekly' ? 'AI 周报分析' : 'AI 月报深度分析'}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold mb-1">{report.period}</h2>
          <p className="text-sm opacity-80">生成于 {formatDate(report.generatedAt)}</p>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin mb-4" />
              <p className="text-gray-600">AI 正在生成分析报告...</p>
              <p className="text-sm text-gray-400 mt-2">请稍候，约需 2-3 秒</p>
            </div>
          ) : (
            <>
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 mb-6">
                <p className="text-gray-700 font-medium text-center">{report.summary}</p>
              </div>
              
              {/* Dominant Mood & Trend */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: moodColor }}
                  >
                    {report.dominantMood.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">主要情绪</p>
                    <p className="text-lg font-bold text-gray-800">{report.dominantMood}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                  {trendIcon}
                  <span className="text-sm font-medium text-gray-700">{trendText}</span>
                </div>
              </div>
              
              {/* Analysis */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  深度分析
                </h3>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {report.analysis}
                  </p>
                </div>
              </div>
              
              {/* Suggestions */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  {report.type === 'weekly' ? '本周建议' : '改善策略'}
                </h3>
                <div className="space-y-3">
                  {report.suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 text-sm leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        {!isGenerating && (
          <div className="p-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={onRegenerate}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重新生成
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 rounded-xl text-white font-medium transition-colors"
            >
              知道了
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
