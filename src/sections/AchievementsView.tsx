/**
 * 成就页面 - 展示用户成就和里程碑
 */

import { useState } from 'react';
import { Trophy, Star, Zap, Heart, Target, Users, Calendar, Award, Lock } from 'lucide-react';
import type { MoodStats } from '@/hooks/useMoodHistory';

interface AchievementsViewProps {
  stats: MoodStats;
}

// 成就定义
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  condition: (stats: MoodStats) => boolean;
  color: string;
  bgColor: string;
}

const achievements: Achievement[] = [
  {
    id: 'first_checkin',
    title: '初次见面',
    description: '完成第一次情绪打卡',
    icon: <Star className="w-5 h-5" />,
    condition: (stats) => stats.totalRecords >= 1,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  {
    id: 'week_warrior',
    title: '周打卡达人',
    description: '连续打卡7天',
    icon: <Calendar className="w-5 h-5" />,
    condition: (stats) => stats.streakDays >= 7,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
  },
  {
    id: 'month_master',
    title: '月度大师',
    description: '连续打卡30天',
    icon: <Trophy className="w-5 h-5" />,
    condition: (stats) => stats.streakDays >= 30,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'emotion_explorer',
    title: '情绪探索家',
    description: '记录5种不同情绪',
    icon: <Heart className="w-5 h-5" />,
    condition: (stats) => Object.keys(stats.moodDistribution).length >= 5,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'hundred_records',
    title: '百次记录',
    description: '累计打卡100次',
    icon: <Target className="w-5 h-5" />,
    condition: (stats) => stats.totalRecords >= 100,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'social_butterfly',
    title: '社交蝴蝶',
    description: '邀请3位好友加入',
    icon: <Users className="w-5 h-5" />,
    condition: () => false, // 需要后端数据
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'energy_master',
    title: '能量大师',
    description: '连续21天保持积极情绪',
    icon: <Zap className="w-5 h-5" />,
    condition: () => false, // 需要更复杂的逻辑
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'legend',
    title: '情绪传奇',
    description: '连续打卡365天',
    icon: <Award className="w-5 h-5" />,
    condition: (stats) => stats.streakDays >= 365,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
];

// 里程碑定义
const milestones = [
  { count: 1, label: '首次打卡', reward: '🌱 新手种子' },
  { count: 7, label: '7天', reward: '🌿 萌芽成长' },
  { count: 30, label: '30天', reward: '🌳 情绪小树' },
  { count: 100, label: '100次', reward: '🌸 花开满枝' },
  { count: 365, label: '365天', reward: '🏆 情绪大师' },
];

export function AchievementsView({ stats }: AchievementsViewProps) {
  const [showLocked, setShowLocked] = useState(false);

  const unlockedAchievements = achievements.filter(a => a.condition(stats));
  const lockedAchievements = achievements.filter(a => !a.condition(stats));

  // 使用 totalDays（打卡天数）而不是 totalRecords（记录总数）
  const totalDays = stats.totalDays || 0;
  
  // 计算当前进度 - 基于已完成的里程碑
  const currentMilestoneIndex = milestones.findIndex(m => totalDays < m.count);
  const lastCompletedIndex = currentMilestoneIndex === -1 ? milestones.length - 1 : currentMilestoneIndex - 1;
  
  // 计算进度百分比
  let progress = 0;
  if (totalDays > 0) {
    if (currentMilestoneIndex === -1) {
      // 已完成所有里程碑
      progress = 100;
    } else if (currentMilestoneIndex === 0) {
      // 还未完成第一个里程碑
      progress = (totalDays / milestones[0].count) * 100;
    } else {
      // 已完成部分里程碑，计算到下一个的进度
      const lastCompleted = milestones[lastCompletedIndex];
      const nextMilestone = milestones[currentMilestoneIndex];
      const range = nextMilestone.count - lastCompleted.count;
      const current = totalDays - lastCompleted.count;
      const segmentSize = 100 / (milestones.length - 1);
      const currentSegmentProgress = (current / range) * segmentSize;
      progress = (lastCompletedIndex * segmentSize) + currentSegmentProgress;
    }
  }

  return (
    <div className="space-y-6">
      {/* 成就概览卡片 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">成就概览</h3>
          <span className="text-sm text-gray-500">
            已解锁 {unlockedAchievements.length}/{achievements.length}
          </span>
        </div>
        
        {/* 进度条 */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          />
        </div>

        {/* 快速统计 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-rose-50 rounded-2xl">
            <p className="text-2xl font-bold text-rose-500">{stats.totalRecords}</p>
            <p className="text-xs text-gray-500">总打卡</p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-2xl">
            <p className="text-2xl font-bold text-amber-500">{stats.streakDays}</p>
            <p className="text-xs text-gray-500">连续天数</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-2xl">
            <p className="text-2xl font-bold text-purple-500">{unlockedAchievements.length}</p>
            <p className="text-xs text-gray-500">成就数</p>
          </div>
        </div>
      </div>

      {/* 里程碑进度 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <h3 className="font-bold text-gray-800 mb-4">打卡里程碑</h3>
        <div className="relative">
          {/* 进度条背景 */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-100 rounded-full" />
          <div 
            className="absolute top-5 left-0 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
          
          {/* 里程碑点 */}
          <div className="relative flex justify-between">
            {milestones.map((milestone, index) => {
              const isReached = totalDays >= milestone.count;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 z-10 ${
                    isReached 
                      ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isReached ? '✓' : index + 1}
                  </div>
                  <p className="text-xs text-gray-500">{milestone.label}</p>
                  {isReached && (
                    <p className="text-xs text-rose-500 font-medium">{milestone.reward}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 成就徽章墙 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">成就徽章</h3>
          <button
            onClick={() => setShowLocked(!showLocked)}
            className="text-sm text-rose-500 hover:text-rose-600 transition-colors"
          >
            {showLocked ? '隐藏未解锁' : '显示未解锁'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {unlockedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-2xl ${achievement.bgColor} border-2 border-transparent hover:border-current transition-all`}
            >
              <div className={`w-10 h-10 rounded-xl ${achievement.bgColor} flex items-center justify-center mb-2 ${achievement.color}`}>
                {achievement.icon}
              </div>
              <h4 className={`font-semibold text-sm ${achievement.color}`}>{achievement.title}</h4>
              <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
            </div>
          ))}
          
          {showLocked && lockedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 opacity-60"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-2 text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-sm text-gray-400">{achievement.title}</h4>
              <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
