/**
 * 生成30天测试数据
 * 用于测试周报和月报功能
 */

import type { MoodRecord } from '@/hooks/useMoodHistory';

// 情绪配置
const moods = [
  { id: 'anxiety', name: '焦虑', icon: '😰', color: 'text-rose-600' },
  { id: 'melancholy', name: '忧郁', icon: '😢', color: 'text-blue-600' },
  { id: 'happy', name: '快乐', icon: '😊', color: 'text-yellow-600' },
  { id: 'regret', name: '懊悔', icon: '😔', color: 'text-purple-600' },
  { id: 'calm', name: '平静', icon: '😌', color: 'text-emerald-600' },
  { id: 'anticipation', name: '期待', icon: '🤩', color: 'text-orange-600' },
  { id: 'content', name: '满足', icon: '😊', color: 'text-green-600' },
  { id: 'doubt', name: '怀疑', icon: '🤔', color: 'text-slate-600' },
  { id: 'stress', name: '压力', icon: '😫', color: 'text-red-600' },
];

// 场景配置
const scenes = [
  { id: 'home', name: '居家', icon: '🏠' },
  { id: 'alone', name: '独处', icon: '🧘' },
  { id: 'work', name: '工作', icon: '💼' },
  { id: 'commute', name: '通勤', icon: '🚇' },
  { id: 'love', name: '恋爱', icon: '❤️' },
  { id: 'social', name: '社交', icon: '🎉' },
];

/**
 * 生成随机整数（包含min和max）
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 根据权重随机选择
 */
function weightedRandom<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}

/**
 * 生成30天测试数据
 * 模拟真实的情绪分布：工作日压力/焦虑较多，周末快乐/平静较多
 */
export function generate30DaysTestData(): MoodRecord[] {
  const records: MoodRecord[] = [];
  const now = new Date();
  
  // 生成过去30天的数据
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const dayOfWeek = date.getDay(); // 0=周日, 6=周六
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // 每天生成1-3条记录
    const recordsPerDay = randomInt(1, 3);
    
    for (let j = 0; j < recordsPerDay; j++) {
      // 根据是否是周末调整情绪权重
      let moodWeights: number[];
      
      if (isWeekend) {
        // 周末：快乐、平静、满足、期待 权重高
        moodWeights = [1, 2, 5, 1, 5, 4, 5, 1, 1];
      } else {
        // 工作日：压力、焦虑、忧郁 权重高
        moodWeights = [5, 4, 2, 2, 2, 2, 2, 3, 5];
      }
      
      const mood = weightedRandom(moods, moodWeights);
      
      // 根据情绪选择场景
      let sceneWeights: number[];
      switch (mood.id) {
        case 'stress':
        case 'anxiety':
          sceneWeights = [1, 1, 5, 3, 1, 1]; // 工作、通勤
          break;
        case 'happy':
        case 'content':
          sceneWeights = [3, 2, 1, 1, 4, 5]; // 居家、恋爱、社交
          break;
        case 'calm':
          sceneWeights = [4, 5, 1, 1, 2, 1]; // 居家、独处
          break;
        default:
          sceneWeights = [2, 2, 2, 2, 2, 2]; // 均匀分布
      }
      
      const scene = weightedRandom(scenes, sceneWeights);
      
      // 生成时间（在一天中的随机时间）
      const hour = randomInt(8, 22);
      const minute = randomInt(0, 59);
      const timestamp = new Date(date);
      timestamp.setHours(hour, minute, 0, 0);
      
      records.push({
        id: `test-${timestamp.getTime()}-${j}`,
        moodId: mood.id,
        moodName: mood.name,
        moodIcon: mood.icon,
        moodColor: mood.color,
        sceneId: scene.id,
        sceneName: scene.name,
        sceneIcon: scene.icon,
        timestamp: timestamp.getTime(),
        note: '',
      });
    }
  }
  
  return records;
}

/**
 * 将测试数据保存到 localStorage
 */
export function saveTestDataToStorage(): void {
  const records = generate30DaysTestData();
  
  // 调试信息
  if (records.length > 0) {
    const now = Date.now();
    const firstDate = new Date(records[records.length - 1].timestamp);
    const lastDate = new Date(records[0].timestamp);
    const daysAgoFirst = Math.floor((now - records[records.length - 1].timestamp) / (24 * 60 * 60 * 1000));
    const daysAgoLast = Math.floor((now - records[0].timestamp) / (24 * 60 * 60 * 1000));
    
    console.log('[Test Data] Generated:', records.length, 'records');
    console.log('[Test Data] Date range:', firstDate.toLocaleDateString(), '-', lastDate.toLocaleDateString());
    console.log('[Test Data] Days ago:', daysAgoFirst, '-', daysAgoLast);
    
    // 检查近4周的数据量
    const fourWeeksAgo = now - 28 * 24 * 60 * 60 * 1000;
    const last4WeeksRecords = records.filter(r => r.timestamp >= fourWeeksAgo);
    console.log('[Test Data] Last 4 weeks:', last4WeeksRecords.length, 'records');
    
    // 检查近7天的数据量
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const last7DaysRecords = records.filter(r => r.timestamp >= sevenDaysAgo);
    console.log('[Test Data] Last 7 days:', last7DaysRecords.length, 'records');
  }
  
  localStorage.setItem('moodflow_history', JSON.stringify(records));
}

/**
 * 清除测试数据
 */
export function clearTestData(): void {
  localStorage.removeItem('moodflow_history');
  console.log('[Test Data] Cleared');
}

/**
 * 检查是否有测试数据
 */
export function hasTestData(): boolean {
  const records = localStorage.getItem('moodflow_history');
  if (!records) return false;
  
  try {
    const parsed = JSON.parse(records);
    return parsed.length >= 1;
  } catch {
    return false;
  }
}
