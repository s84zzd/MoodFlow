import { apiRequest } from './client';

export interface MoodRecord {
  id: string;
  moodId: string;
  moodName: string;
  moodIcon: string;
  moodColor: string;
  sceneId?: string;
  sceneName?: string;
  sceneIcon?: string;
  note?: string;
  timestamp: string;
  createdAt: string;
}

// 获取所有记录
export async function getRecords(): Promise<MoodRecord[]> {
  return apiRequest<MoodRecord[]>('/mood/records');
}

// 添加记录
export async function addRecord(record: Omit<MoodRecord, 'id' | 'createdAt'>): Promise<MoodRecord> {
  return apiRequest<MoodRecord>('/mood/records', {
    method: 'POST',
    body: JSON.stringify(record),
  });
}

// 批量同步
export async function syncRecords(records: Omit<MoodRecord, 'id' | 'createdAt'>[]): Promise<{ created: number }> {
  return apiRequest<{ created: number }>('/mood/sync', {
    method: 'POST',
    body: JSON.stringify({ records }),
  });
}

// 删除记录
export async function deleteRecord(id: string): Promise<void> {
  await apiRequest(`/mood/records/${id}`, {
    method: 'DELETE',
  });
}
