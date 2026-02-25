import { useState, useEffect, useCallback } from 'react';
import { FULL_ACTIVITIES } from '@/data/activityDatabase';

export interface CustomActivity {
  id: string;
  title: string;
  description: string;
  duration: string;
  color: string;
  bgGradient: string;
  moodIds: string[];
  sceneIds: string[];
  isDefault: boolean;
}

// 使用完整的活动数据库
// 9种情绪 × 6种场景 × 3个活动 = 162个活动
const DEFAULT_ACTIVITIES: CustomActivity[] = FULL_ACTIVITIES;

const STORAGE_KEY = 'moodflow_custom_activities';

export function useCustomActivities() {
  const [activities, setActivities] = useState<CustomActivity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load activities from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 合并保存的活动与默认活动，确保新字段兼容
        const mergedActivities = parsed.map((savedActivity: CustomActivity) => {
          const defaultActivity = DEFAULT_ACTIVITIES.find(d => d.id === savedActivity.id);
          if (defaultActivity) {
            // 如果是默认活动，使用最新的默认活动数据
            return { ...defaultActivity };
          }
          // 自定义活动，补充缺失字段
          return {
            ...savedActivity,
            sceneIds: savedActivity.sceneIds || ['home', 'alone'],
          };
        });
        // 添加新增的默认活动
        const savedIds = new Set(parsed.map((a: CustomActivity) => a.id));
        const newDefaults = DEFAULT_ACTIVITIES.filter(d => !savedIds.has(d.id));
        setActivities([...mergedActivities, ...newDefaults]);
      } catch {
        console.error('Failed to parse custom activities');
        setActivities(DEFAULT_ACTIVITIES);
      }
    } else {
      setActivities(DEFAULT_ACTIVITIES);
    }
    setIsLoaded(true);
  }, []);

  // Save activities when changed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    }
  }, [activities, isLoaded]);

  const addActivity = useCallback((activity: Omit<CustomActivity, 'id' | 'isDefault'>) => {
    const newActivity: CustomActivity = {
      ...activity,
      id: `custom-${Date.now()}`,
      isDefault: false,
    };
    setActivities(prev => [...prev, newActivity]);
    return newActivity;
  }, []);

  const updateActivity = useCallback((id: string, updates: Partial<Omit<CustomActivity, 'id' | 'isDefault'>>) => {
    setActivities(prev =>
      prev.map(a =>
        a.id === id && !a.isDefault ? { ...a, ...updates } : a
      )
    );
  }, []);

  const deleteActivity = useCallback((id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id || a.isDefault));
  }, []);

  const getActivitiesForMood = useCallback((moodId: string, sceneId?: string, limit: number = 3, strictScene: boolean = false): CustomActivity[] => {
    // 严格筛选：必须匹配情绪 AND 场景（如果提供了场景且要求严格匹配）
    let filteredActivities = activities.filter(a => {
      const moodMatch = a.moodIds.length === 0 || a.moodIds.includes(moodId);
      const sceneMatch = !sceneId || !strictScene || (a.sceneIds && a.sceneIds.includes(sceneId));
      return moodMatch && sceneMatch;
    });
    
    // 如果严格筛选后为空，先尝试只匹配情绪
    if (filteredActivities.length === 0) {
      filteredActivities = activities.filter(
        a => a.moodIds.length === 0 || a.moodIds.includes(moodId)
      );
    }
    
    // 如果还是为空，返回所有活动
    if (filteredActivities.length === 0) {
      filteredActivities = [...activities];
    }
    
    // Shuffle and return limited number
    const shuffled = [...filteredActivities].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }, [activities]);

  const resetToDefault = useCallback(() => {
    setActivities(DEFAULT_ACTIVITIES);
  }, []);

  return {
    activities,
    isLoaded,
    addActivity,
    updateActivity,
    deleteActivity,
    getActivitiesForMood,
    resetToDefault,
  };
}
