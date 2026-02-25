/**
 * 统计视图 - 彩虹饼图展示 + AI 报告
 * 近7天 + 近4周情绪分布 + 周报/月报
 */

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Award, Sparkles, FileText, ChevronRight, Loader2 } from 'lucide-react';
import type { PeriodStats, AIReport } from '@/hooks/useStatistics';
import type { MoodRecord } from '@/hooks/useMoodHistory';
import { 
  generateWeeklyReport, 
  generateMonthlyReport, 
  regenerateReport,
  shouldAutoGenerateWeekly,
  shouldAutoGenerateMonthly,
  canManualGenerate,
  getRemainingManualCount,
} from '@/services/reportService';
import { ReportDetailModal } from '@/components/ReportDetailModal';

interface StatisticsViewProps {
  stats7Days: PeriodStats;
  stats4Weeks: PeriodStats;
  records?: MoodRecord[];
}

export function StatisticsView({ stats7Days, stats4Weeks, records = [] }: StatisticsViewProps) {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<AIReport | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<AIReport | null>(null);
  const [isGeneratingWeekly, setIsGeneratingWeekly] = useState(false);
  const [isGeneratingMonthly, setIsGeneratingMonthly] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AIReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // 手动生成次数
  const [weeklyRemaining, setWeeklyRemaining] = useState(2);
  const [monthlyRemaining, setMonthlyRemaining] = useState(4);
  
  // 确认弹窗状态
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'weekly' | 'monthly' | null;
    remaining: number;
  }>({ isOpen: false, type: null, remaining: 0 });
  
  // 更新剩余次数
  useEffect(() => {
    setWeeklyRemaining(getRemainingManualCount('weekly'));
    setMonthlyRemaining(getRemainingManualCount('monthly'));
  }, [weeklyReport, monthlyReport]);

  // 自动生成周报（每周六 18:00 后）
  useEffect(() => {
    const generateWeekly = async () => {
      // 只在满足自动生成条件时生成
      if (!shouldAutoGenerateWeekly()) return;
      if (stats7Days.total < 3) return;
      
      setIsGeneratingWeekly(true);
      try {
        const report = await generateWeeklyReport(stats7Days, records, false);
        setWeeklyReport(report);
      } finally {
        setIsGeneratingWeekly(false);
      }
    };
    generateWeekly();
  }, [stats7Days, records]);

  // 自动生成月报（每月最后一天 18:00 后）
  useEffect(() => {
    const generateMonthly = async () => {
      // 只在满足自动生成条件时生成
      if (!shouldAutoGenerateMonthly()) return;
      if (stats4Weeks.total < 7) return;
      
      setIsGeneratingMonthly(true);
      try {
        const report = await generateMonthlyReport(stats4Weeks, records, false);
        setMonthlyReport(report);
      } finally {
        setIsGeneratingMonthly(false);
      }
    };
    generateMonthly();
  }, [stats4Weeks, records]);

  const handleViewReport = (report: AIReport) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleRegenerate = async () => {
    if (!selectedReport) return;
    setIsRegenerating(true);
    try {
      const newReport = await regenerateReport(
        selectedReport.type,
        selectedReport.type === 'weekly' ? stats7Days : stats4Weeks,
        records
      );
      if (newReport) {
        if (newReport.type === 'weekly') {
          setWeeklyReport(newReport);
        } else {
          setMonthlyReport(newReport);
        }
        setSelectedReport(newReport);
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  // 手动生成周报
  const handleManualGenerateWeekly = async () => {
    if (!canManualGenerate('weekly')) return;
    setIsGeneratingWeekly(true);
    try {
      const report = await generateWeeklyReport(stats7Days, records, true);
      setWeeklyReport(report);
    } finally {
      setIsGeneratingWeekly(false);
    }
  };

  // 手动生成月报
  const handleManualGenerateMonthly = async () => {
    if (!canManualGenerate('monthly')) return;
    setIsGeneratingMonthly(true);
    try {
      const report = await generateMonthlyReport(stats4Weeks, records, true);
      setMonthlyReport(report);
    } finally {
      setIsGeneratingMonthly(false);
    }
  };

  // 显示确认弹窗
  const showConfirmDialog = (type: 'weekly' | 'monthly') => {
    const remaining = type === 'weekly' ? weeklyRemaining : monthlyRemaining;
    setConfirmDialog({ isOpen: true, type, remaining });
  };

  // 关闭确认弹窗
  const closeConfirmDialog = () => {
    setConfirmDialog({ isOpen: false, type: null, remaining: 0 });
  };

  // 确认重新生成
  const confirmRegenerate = () => {
    closeConfirmDialog();
    if (confirmDialog.type === 'weekly') {
      handleManualGenerateWeekly();
    } else if (confirmDialog.type === 'monthly') {
      handleManualGenerateMonthly();
    }
  };

  return (
    <div className="space-y-6">
      {/* 近7天统计 */}
      <StatCard
        title="近7天情绪分布"
        subtitle="过去一周的情绪记录"
        icon={<Calendar className="w-5 h-5" />}
        stats={stats7Days}
        topLabel="TOP1"
        onSegmentClick={setActiveSegment}
        activeSegment={activeSegment}
      />

      {/* 周报卡片 */}
      <ReportCard
        type="weekly"
        report={weeklyReport}
        isGenerating={isGeneratingWeekly}
        hasEnoughData={stats7Days.total >= 3}
        onView={() => weeklyReport && handleViewReport(weeklyReport)}
        onManualGenerate={() => showConfirmDialog('weekly')}
        remainingCount={weeklyRemaining}
      />

      {/* 近4周统计 */}
      <StatCard
        title="近4周情绪分布"
        subtitle={`过去一个月的情绪记录 (${stats4Weeks.total}条)`}
        icon={<Calendar className="w-5 h-5" />}
        stats={stats4Weeks}
        topLabel="TOP3"
        onSegmentClick={setActiveSegment}
        activeSegment={activeSegment}
        isDonut
      />

      {/* 月报卡片 */}
      <ReportCard
        type="monthly"
        report={monthlyReport}
        isGenerating={isGeneratingMonthly}
        hasEnoughData={stats4Weeks.total >= 7}
        onView={() => monthlyReport && handleViewReport(monthlyReport)}
        onManualGenerate={() => showConfirmDialog('monthly')}
        remainingCount={monthlyRemaining}
      />

      {/* 报告详情弹窗 */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegenerate={handleRegenerate}
        isGenerating={isRegenerating}
      />

      {/* 确认重新生成弹窗 */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              确认重新生成{confirmDialog.type === 'weekly' ? '周报' : '月报'}？
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {confirmDialog.remaining >= 999 ? (
                <>
                  开发模式：无限制重新生成
                  <br />
                  <span className="text-xs text-gray-500">生产环境将启用次数限制</span>
                </>
              ) : (
                <>
                  重新生成会消耗 1 次手动生成机会。
                  <br />
                  本周/月还剩余 <span className="font-bold text-rose-600">{confirmDialog.remaining}</span> 次机会。
                </>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeConfirmDialog}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmRegenerate}
                className="flex-1 px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-white font-medium transition-colors"
              >
                确认生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 统计卡片组件
interface StatCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  stats: PeriodStats;
  topLabel: string;
  onSegmentClick: (name: string | null) => void;
  activeSegment: string | null;
  isDonut?: boolean;
}

function StatCard({
  title,
  subtitle,
  icon,
  stats,
  topLabel,
  onSegmentClick,
  activeSegment,
  isDonut,
}: StatCardProps) {
  const hasData = stats.total > 0;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-white">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Chart */}
          <div className="h-48 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.emotions}
                  cx="50%"
                  cy="50%"
                  innerRadius={isDonut ? 40 : 0}
                  outerRadius={70}
                  dataKey="count"
                  nameKey="name"
                  onClick={(data) => onSegmentClick(data.name)}
                  onMouseEnter={(data) => onSegmentClick(data.name)}
                  onMouseLeave={() => onSegmentClick(null)}
                >
                  {stats.emotions.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="white"
                      strokeWidth={2}
                      style={{
                        filter: activeSegment && activeSegment !== entry.name
                          ? 'opacity(0.3)'
                          : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/60">
                          <p className="font-medium text-gray-800">{data.name}</p>
                          <p className="text-sm text-gray-500">
                            {data.count} 次 ({data.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* TOP Emotions */}
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">{topLabel}:</span>
            <div className="flex gap-2">
              {stats.topEmotions.map((emotion, idx) => (
                <span
                  key={emotion}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700"
                >
                  {idx + 1}. {emotion}
                </span>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2">
            {stats.emotions.map((emotion) => (
              <button
                key={emotion.name}
                onClick={() => onSegmentClick(
                  activeSegment === emotion.name ? null : emotion.name
                )}
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
                  activeSegment === emotion.name
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: emotion.color }}
                />
                <div className="text-left">
                  <p className="text-xs font-medium text-gray-700 truncate">
                    {emotion.name}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {emotion.count}次
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Total */}
          <p className="text-center text-xs text-gray-400 mt-4">
            共计 {stats.total} 次记录
          </p>
        </>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-400 text-sm">暂无数据，开始打卡吧！</p>
        </div>
      )}
    </div>
  );
}

// 报告卡片组件
interface ReportCardProps {
  type: 'weekly' | 'monthly';
  report: AIReport | null;
  isGenerating: boolean;
  hasEnoughData: boolean;
  onView: () => void;
  onManualGenerate?: () => void;
  remainingCount?: number;
}

function ReportCard({ type, report, isGenerating, hasEnoughData, onView, onManualGenerate, remainingCount }: ReportCardProps) {
  const isWeekly = type === 'weekly';
  
  if (!hasEnoughData) {
    return (
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center gap-3 text-gray-400">
          <div className={`w-10 h-10 rounded-xl ${isWeekly ? 'bg-blue-100' : 'bg-purple-100'} flex items-center justify-center`}>
            <FileText className={`w-5 h-5 ${isWeekly ? 'text-blue-400' : 'text-purple-400'}`} />
          </div>
          <div>
            <p className="font-medium text-sm">{isWeekly ? '周报分析' : '月报深度分析'}</p>
            <p className="text-xs">需要至少{isWeekly ? '3' : '7'}条记录</p>
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${isWeekly ? 'bg-blue-500' : 'bg-purple-500'} flex items-center justify-center`}>
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 text-sm">{isWeekly ? 'AI 正在生成周报...' : 'AI 正在生成月报...'}</p>
            <p className="text-xs text-gray-500">分析你的情绪模式</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    const canGenerate = remainingCount !== undefined && remainingCount > 0;
    const isUnlimited = remainingCount !== undefined && remainingCount >= 999;
    return (
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-400">
            <div className={`w-10 h-10 rounded-xl ${isWeekly ? 'bg-blue-100' : 'bg-purple-100'} flex items-center justify-center`}>
              <FileText className={`w-5 h-5 ${isWeekly ? 'text-blue-400' : 'text-purple-400'}`} />
            </div>
            <div>
              <p className="font-medium text-sm">{isWeekly ? '周报分析' : '月报深度分析'}</p>
              <p className="text-xs">
                {isUnlimited 
                  ? '开发模式：无限制' 
                  : canGenerate 
                    ? `剩余 ${remainingCount} 次手动生成机会` 
                    : '本周/月次数已用完'}
              </p>
            </div>
          </div>
          {canGenerate && onManualGenerate && (
            <button
              onClick={onManualGenerate}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors ${
                isWeekly ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              生成
            </button>
          )}
        </div>
      </div>
    );
  }

  const canRegenerate = remainingCount !== undefined && remainingCount > 0;
  
  return (
    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-100">
      <button
        onClick={onView}
        className="w-full transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${isWeekly ? 'bg-blue-500' : 'bg-purple-500'} flex items-center justify-center shadow-lg`}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-800 text-sm">{isWeekly ? 'AI 周报分析' : 'AI 月报深度分析'}</p>
              <span className="px-2 py-0.5 rounded-full bg-white/80 text-[10px] text-rose-600 font-medium">
                {report.period}
              </span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{report.summary}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
        </div>
      </button>
      
      {/* 重新生成按钮 */}
      {canRegenerate && onManualGenerate && (
        <div className="mt-3 pt-3 border-t border-rose-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {remainingCount >= 999 
              ? '开发模式：无限制' 
              : `剩余 ${remainingCount} 次重新生成机会`}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onManualGenerate();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors ${
              isWeekly ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'
            }`}
          >
            重新生成
          </button>
        </div>
      )}
      
      {!canRegenerate && remainingCount !== undefined && remainingCount < 999 && (
        <div className="mt-3 pt-3 border-t border-rose-100 text-center">
          <span className="text-xs text-gray-400">
            本周/月重新生成次数已用完
          </span>
        </div>
      )}
    </div>
  );
}
