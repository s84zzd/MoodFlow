import { useEffect, useState } from 'react';
import type { Mood } from '@/types';
import { moods } from '@/data/moods';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelect: (mood: Mood) => void;
}

// 情绪简要说明映射
const moodTooltips: Record<string, string> = {
  happy: '🟡 快乐 - 心情愉悦，充满活力',
  melancholy: '🔵 忧郁 - 淡淡的忧伤笼罩',
  calm: '🟢 平静 - 内心安宁，波澜不惊',
  anticipation: '🟠 期待 - 对未来充满憧憬',
  anxiety: '🔴 焦虑 - 内心不安，需要平静',
  regret: '🟣 懊悔 - 为过去的事感到遗憾',
  content: '🟤 满足 - 知足常乐的状态',
  doubt: '⚫ 怀疑 - 不确定，需要验证',
  stress: '⚪ 压力 - 感到紧张和压迫',
};

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (mood: Mood) => {
    onSelect(mood);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-rose-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center mb-12">
        <h1
          className={`text-4xl md:text-5xl font-bold text-gray-700 mb-4 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          今天感觉如何？
        </h1>
        <p className={`text-lg text-gray-500 transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          选择符合你当下感受的情绪卡片
        </p>
      </div>

      <div
        className="relative z-10 grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 md:gap-6 max-w-6xl mx-auto"
      >
        {moods.map((mood, index) => (
          <div
            key={mood.id}
            onClick={() => handleCardClick(mood)}
            className={`
              mood-card cursor-pointer group relative
              ${selectedMood?.id === mood.id ? `selected ${mood.ringColor}` : ''}
              transition-all duration-500
              ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
            `}
            style={{ 
              transitionDelay: `${300 + index * 80}ms`,
              animation: isVisible ? `float 4s ease-in-out infinite ${index * 0.3}s` : 'none'
            }}
          >
            <div
              className={`
                relative w-24 h-28 md:w-28 md:h-32 rounded-2xl 
                ${mood.bgColor} 
                flex flex-col items-center justify-center
                transition-all duration-300
                shadow-lg hover:shadow-xl
                border-2 border-white/50
                ${selectedMood?.id === mood.id ? 'ring-4 ring-offset-2 ' + mood.ringColor : ''}
              `}
            >
              <span className="text-4xl md:text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                {mood.icon}
              </span>
              <span className={`text-sm font-semibold ${mood.color}`}>
                {mood.name}
              </span>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/30 transition-all duration-300" />
            </div>
            
            {/* Tooltip - 鼠标悬停显示情绪说明 */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
              <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                {moodTooltips[mood.id]}
                {/* 小三角箭头 */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
              </div>
            </div>
            
            {/* Selected indicator */}
            {selectedMood?.id === mood.id && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-current animate-bounce" />
            )}
          </div>
        ))}
      </div>

      {/* Selected mood display */}
      {selectedMood && (
        <div className="mt-12 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg">
            <span className="text-2xl">{selectedMood.icon}</span>
            <span className="text-lg font-medium text-gray-700">
              你选择了 <span className={selectedMood.color}>{selectedMood.name}</span>
            </span>
          </div>
          <p className="mt-3 text-gray-500">{selectedMood.description}</p>
        </div>
      )}
    </section>
  );
}
