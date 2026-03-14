export type Mood = {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  ringColor: string;
  icon: string;
  description: string;
  // 情绪维度属性（可选）
  valence?: number;  // 效价 1-6 (负面到正面)
  arousal?: number;  // 唤醒度 1-6 (低到高)
  energy?: number;   // 能量值
};

export type Scene = {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  duration: string;
  color: string;
  bgGradient: string;
};

export type CheckInData = {
  mood: Mood | null;
  scene: Scene | null;
  timestamp: number | null;
};

export interface ShareOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

export interface AIAdvice {
  id: string;
  title: string;
  content: string;
  category: 'immediate' | 'longterm' | 'lifestyle';
  moodId: string;
}
