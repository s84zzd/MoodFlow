/**
 * 统计数据 Hook
 * 提供近7天和近4周的情绪统计分析
 */

import { useCallback } from 'react';
import type { MoodRecord } from './useMoodHistory';

export interface EmotionStat {
  name: string;
  count: number;
  color: string;
  percentage: number;
}

export interface PeriodStats {
  total: number;
  emotions: EmotionStat[];
  topEmotions: string[];
}

// AI报告数据类型
export interface AIReport {
  id: string;
  type: 'weekly' | 'monthly';
  period: string;        // 如 "2月10日-2月16日"
  generatedAt: number;
  dominantMood: string;  // 主要情绪
  summary: string;       // 一句话总结
  analysis: string;      // AI分析内容
  suggestions: string[]; // 行动建议
  trend: 'up' | 'down' | 'stable'; // 趋势
}

// 情绪颜色映射 - 与知识库中的情绪颜色emoji保持一致
const moodColors: Record<string, string> = {
  '焦虑': '#ef4444',    // 🔴 红色 - 焦虑
  '忧郁': '#3b82f6',    // 🔵 蓝色 - 忧郁
  '快乐': '#eab308',    // 🟡 黄色 - 快乐
  '懊悔': '#8b5cf6',    // 🟣 紫色 - 懊悔
  '平静': '#22c55e',    // 🟢 绿色 - 平静
  '期待': '#f97316',    // 🟠 橙色 - 期待
  '满足': '#a16207',    // 🟤 棕色 - 满足
  '怀疑': '#374151',    // ⚫ 深灰 - 怀疑
  '压力': '#9ca3af',    // ⚪ 灰色 - 压力
};

export function useStatistics(records: MoodRecord[]) {
  // 获取近7天统计
  const getLast7DaysStats = useCallback((): PeriodStats => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    const periodRecords = records.filter(r => r.timestamp >= sevenDaysAgo);
    return calculateStats(periodRecords, 1); // TOP1
  }, [records]);

  // 获取近4周统计
  const getLast4WeeksStats = useCallback((): PeriodStats => {
    const now = Date.now();
    const fourWeeksAgo = now - 28 * 24 * 60 * 60 * 1000;
    
    const periodRecords = records.filter(r => r.timestamp >= fourWeeksAgo);
    return calculateStats(periodRecords, 3); // TOP3
  }, [records]);

  // 计算统计数据
  const calculateStats = (periodRecords: MoodRecord[], topCount: number): PeriodStats => {
    if (periodRecords.length === 0) {
      return { total: 0, emotions: [], topEmotions: [] };
    }

    // 统计情绪频次
    const emotionCounts: Record<string, number> = {};
    periodRecords.forEach(record => {
      emotionCounts[record.moodName] = (emotionCounts[record.moodName] || 0) + 1;
    });

    const total = periodRecords.length;

    // 转换为数组并排序
    const emotions: EmotionStat[] = Object.entries(emotionCounts)
      .map(([name, count]) => ({
        name,
        count,
        color: moodColors[name] || '#9ca3af',
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // 获取TOP情绪（平票时按原顺序）
    const topEmotions = emotions
      .slice(0, topCount)
      .map(e => e.name);

    return { total, emotions, topEmotions };
  };

  return {
    getLast7DaysStats,
    getLast4WeeksStats,
  };
}
