export type Mood = {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  ringColor: string;
  icon: string;
  description: string;
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
