/**
 * 统计视图 - 彩虹饼图展示
 * 近7天 + 近4周情绪分布
 */

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Award } from 'lucide-react';
import type { PeriodStats } from '@/hooks/useStatistics';

interface StatisticsViewProps {
  stats7Days: PeriodStats;
  stats4Weeks: PeriodStats;
}

export function StatisticsView({ stats7Days, stats4Weeks }: StatisticsViewProps) {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

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

      {/* 近4周统计 */}
      <StatCard
        title="近4周情绪分布"
        subtitle="过去一个月的情绪记录"
        icon={<Calendar className="w-5 h-5" />}
        stats={stats4Weeks}
        topLabel="TOP3"
        onSegmentClick={setActiveSegment}
        activeSegment={activeSegment}
        isDonut
      />
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
