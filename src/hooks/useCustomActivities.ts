import { useState, useEffect, useCallback } from 'react';
// import { sceneActivities } from '@/data/moods'; // 暂未使用

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

// 扩展默认活动，包含场景适配
const DEFAULT_ACTIVITIES: CustomActivity[] = [
  {
    id: 'default-breathing',
    title: '深呼吸练习',
    description: '尝试4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒，重复5次',
    duration: '3分钟',
    color: 'text-rose-600',
    bgGradient: 'from-rose-50 to-pink-50',
    moodIds: ['anxiety', 'stress'],
    sceneIds: ['home', 'alone', 'work', 'commute'],
    isDefault: true,
  },
  {
    id: 'default-meditation',
    title: '冥想深化',
    description: '闭上眼睛，专注于呼吸，让平静更加深入',
    duration: '10分钟',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    moodIds: ['calm'],
    sceneIds: ['home', 'alone'],
    isDefault: true,
  },
  {
    id: 'default-gratitude',
    title: '感恩记录',
    description: '写下3件让你开心的事，细细品味这份喜悦',
    duration: '5分钟',
    color: 'text-yellow-600',
    bgGradient: 'from-yellow-50 to-amber-50',
    moodIds: ['happy', 'content'],
    sceneIds: ['home', 'alone', 'love'],
    isDefault: true,
  },
  {
    id: 'default-grounding',
    title: '五感 grounding',
    description: '说出5样能看到、4样能听到、3样能摸到、2样能闻到、1样能尝到的',
    duration: '5分钟',
    color: 'text-rose-600',
    bgGradient: 'from-rose-50 to-orange-50',
    moodIds: ['anxiety', 'doubt'],
    sceneIds: ['home', 'alone', 'commute', 'social'],
    isDefault: true,
  },
  {
    id: 'default-walk',
    title: '轻度散步',
    description: '到户外慢走，专注于脚步和周围的自然声音',
    duration: '15分钟',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-green-50',
    moodIds: ['anxiety', 'melancholy', 'stress'],
    sceneIds: ['home', 'alone', 'commute'],
    isDefault: true,
  },
  {
    id: 'default-journaling',
    title: '情绪日记',
    description: '写下此刻的感受，不用修饰，让情绪自然流淌到纸上',
    duration: '10分钟',
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-indigo-50',
    moodIds: ['melancholy', 'regret', 'doubt'],
    sceneIds: ['home', 'alone', 'work'],
    isDefault: true,
  },
  {
    id: 'default-share',
    title: '分享心情',
    description: '给在乎的人发条消息，分享你的心情或寻求支持',
    duration: '5分钟',
    color: 'text-pink-600',
    bgGradient: 'from-pink-50 to-rose-50',
    moodIds: ['happy', 'anxiety', 'melancholy'],
    sceneIds: ['love', 'social', 'home'],
    isDefault: true,
  },
  {
    id: 'default-stretch',
    title: '身体舒展',
    description: '做简单的拉伸，释放身体的紧张感',
    duration: '5分钟',
    color: 'text-red-600',
    bgGradient: 'from-red-50 to-rose-50',
    moodIds: ['stress', 'anxiety'],
    sceneIds: ['work', 'home', 'commute'],
    isDefault: true,
  },
  {
    id: 'default-dance',
    title: '随心舞动',
    description: '放一首喜欢的歌，跟着节奏自由舞动身体，让快乐充满全身',
    duration: '10分钟',
    color: 'text-yellow-600',
    bgGradient: 'from-yellow-50 to-lime-50',
    moodIds: ['happy', 'anticipation'],
    sceneIds: ['home', 'alone', 'social'],
    isDefault: true,
  },
];

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

  const getActivitiesForMood = useCallback((moodId: string, sceneId?: string, limit: number = 3): CustomActivity[] => {
    // 首先筛选匹配该情绪的活动
    let filteredActivities = activities.filter(
      a => a.moodIds.length === 0 || a.moodIds.includes(moodId)
    );
    
    // 如果没有匹配该情绪的活动，使用所有活动
    if (filteredActivities.length === 0) {
      filteredActivities = [...activities];
    }
    
    // 如果有场景ID，进一步筛选适合该场景的活动
    if (sceneId) {
      const sceneSpecific = filteredActivities.filter(
        a => a.sceneIds && a.sceneIds.includes(sceneId)
      );
      if (sceneSpecific.length > 0) {
        filteredActivities = sceneSpecific;
      }
    }
    
    // 如果筛选后为空，返回默认活动
    if (filteredActivities.length === 0) {
      filteredActivities = DEFAULT_ACTIVITIES;
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
