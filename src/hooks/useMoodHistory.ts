import { useState, useEffect, useCallback } from 'react';
import type { Mood, Scene } from '@/types';

export interface MoodRecord {
  id: string;
  moodId: string;
  moodName: string;
  moodIcon: string;
  moodColor: string;
  sceneId?: string;
  sceneName?: string;
  sceneIcon?: string;
  timestamp: number;
  note?: string;
}

export interface MoodStats {
  totalRecords: number;
  moodDistribution: Record<string, number>;
  sceneDistribution: Record<string, number>;
  weeklyTrend: { day: string; count: number; dominantMood: string }[];
  monthlyTrend: { week: string; count: number; dominantMood: string }[];
  streakDays: number;
  lastCheckInDate: string | null;
}

const STORAGE_KEY = 'moodflow_history';
const MAX_DAILY_RECORDS = 8; // 每天最多保留8条记录
const ENABLE_CHECKIN_LIMIT = import.meta.env.VITE_ENABLE_CHECKIN_LIMIT === 'true';

export function useMoodHistory() {
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load records from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecords(parsed);
      } catch {
        console.error('Failed to parse mood history');
      }
    }
    setIsLoaded(true);
  }, []);

  // Save records when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  }, [records, isLoaded]);

  // Check if user can check in (no longer restricted by time, only by daily limit)
  const canCheckIn = useCallback((_scene?: Scene | null): { allowed: boolean; remainingMinutes?: number; lastRecord?: MoodRecord; dailyCount?: number } => {
    const now = Date.now();
    const today = new Date(now).toDateString();
    
    // 统计今天已打卡次数
    const todayRecords = records.filter(r => new Date(r.timestamp).toDateString() === today);
    const dailyCount = todayRecords.length;
    
    // 如果已达到每日上限，返回提示信息（但仍允许打卡，会删除最早的）
    if (dailyCount >= MAX_DAILY_RECORDS) {
      return { 
        allowed: true, 
        dailyCount,
        lastRecord: todayRecords[todayRecords.length - 1] // 最早的一条
      };
    }

    return { allowed: true, dailyCount };
  }, [records]);

  const addRecord = useCallback((mood: Mood, scene?: Scene | null, note?: string, _skipCheck: boolean = false) => {
    const now = Date.now();
    const today = new Date(now).toDateString();

    const newRecord: MoodRecord = {
      id: Date.now().toString(),
      moodId: mood.id,
      moodName: mood.name,
      moodIcon: mood.icon,
      moodColor: mood.color,
      sceneId: scene?.id,
      sceneName: scene?.name,
      sceneIcon: scene?.icon,
      timestamp: now,
      note,
    };

    setRecords(prev => {
      // 如果启用了打卡限制，检查每日上限
      if (ENABLE_CHECKIN_LIMIT) {
        // 获取今天的所有记录
        const todayRecords = prev.filter(r => new Date(r.timestamp).toDateString() === today);
        
        // 如果今天已经达到上限，删除最早的一条
        if (todayRecords.length >= MAX_DAILY_RECORDS) {
          // 按时间升序排序，获取最早的一条
          const oldestToday = [...todayRecords].sort((a, b) => a.timestamp - b.timestamp)[0];
          const filtered = prev.filter(r => r.id !== oldestToday.id);
          return [newRecord, ...filtered];
        }
      }
      
      // 正常情况：直接添加新记录
      return [newRecord, ...prev];
    });
    
    return { success: true, record: newRecord };
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  const updateRecordNote = useCallback((id: string, note: string) => {
    setRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, note } : r))
    );
  }, []);

  // Export data as CSV
  const exportAsCSV = useCallback((): string => {
    const headers = ['日期', '时间', '情绪', '场景', '备注'];
    const rows = records.map(r => {
      const date = new Date(r.timestamp);
      return [
        date.toLocaleDateString('zh-CN'),
        date.toLocaleTimeString('zh-CN'),
        r.moodName,
        r.sceneName || '-',
        r.note || '-',
      ];
    });
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return '\uFEFF' + csvContent; // Add BOM for Chinese characters
  }, [records]);

  // Calculate statistics
  const getStats = useCallback((): MoodStats => {
    const now = new Date();

    // 只统计当天的情绪分布
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEnd = todayStart + 24 * 60 * 60 * 1000;
    const todayRecords = records.filter(r => r.timestamp >= todayStart && r.timestamp < todayEnd);

    // Mood distribution - 当天情绪统计
    const moodDistribution: Record<string, number> = {};
    const sceneDistribution: Record<string, number> = {};

    todayRecords.forEach(record => {
      moodDistribution[record.moodName] = (moodDistribution[record.moodName] || 0) + 1;
      if (record.sceneName) {
        sceneDistribution[record.sceneName] = (sceneDistribution[record.sceneName] || 0) + 1;
      }
    });

    // 如果当天没有记录，使用最新一条记录的情绪
    if (Object.keys(moodDistribution).length === 0 && records.length > 0) {
      const latestRecord = records[0];
      moodDistribution[latestRecord.moodName] = 1;
    }

    // Weekly trend (last 7 days)
    const weeklyTrend: { day: string; count: number; dominantMood: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = date.toLocaleDateString('zh-CN', { weekday: 'short' });
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const dayRecords = records.filter(r => r.timestamp >= dayStart && r.timestamp < dayEnd);
      const moodCounts: Record<string, number> = {};
      dayRecords.forEach(r => {
        moodCounts[r.moodName] = (moodCounts[r.moodName] || 0) + 1;
      });
      const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

      weeklyTrend.push({
        day: dayStr,
        count: dayRecords.length,
        dominantMood,
      });
    }

    // Monthly trend (last 4 weeks)
    const monthlyTrend: { week: string; count: number; dominantMood: string }[] = [];
    for (let i = 3; i >= 0; i--) {
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weekRecords = records.filter(
        r => r.timestamp >= weekStart.getTime() && r.timestamp < weekEnd.getTime()
      );

      const moodCounts: Record<string, number> = {};
      weekRecords.forEach(r => {
        moodCounts[r.moodName] = (moodCounts[r.moodName] || 0) + 1;
      });
      const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

      monthlyTrend.push({
        week: `第${4 - i}周`,
        count: weekRecords.length,
        dominantMood,
      });
    }

    // Calculate streak
    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = checkDate.getTime();
      const dayEnd = dayStart + 24 * 60 * 60 * 1000;

      const hasRecord = records.some(r => r.timestamp >= dayStart && r.timestamp < dayEnd);
      if (hasRecord) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

    const lastRecord = records[0];
    const lastCheckInDate = lastRecord
      ? new Date(lastRecord.timestamp).toLocaleDateString('zh-CN')
      : null;

    return {
      totalRecords: records.length,
      moodDistribution,
      sceneDistribution,
      weeklyTrend,
      monthlyTrend,
      streakDays,
      lastCheckInDate,
    };
  }, [records]);

  // Get records for a specific date range
  const getRecordsInRange = useCallback((startDate: Date, endDate: Date) => {
    return records.filter(
      r => r.timestamp >= startDate.getTime() && r.timestamp <= endDate.getTime()
    );
  }, [records]);

  // Get recent records
  const getRecentRecords = useCallback((limit: number = 10) => {
    return records.slice(0, limit);
  }, [records]);

  return {
    records,
    isLoaded,
    addRecord,
    canCheckIn,
    deleteRecord,
    updateRecordNote,
    exportAsCSV,
    getStats,
    getRecordsInRange,
    getRecentRecords,
  };
}
