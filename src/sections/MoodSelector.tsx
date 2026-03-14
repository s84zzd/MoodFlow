import { useEffect, useState } from 'react';
import type { Mood } from '@/types';
import { moods } from '@/data/moods';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelect: (mood: Mood) => void;
}

// 主页默认显示的常用情绪（9个）
const COMMON_MOOD_IDS = [
  'joy',           // 快乐
  'anxiety',       // 焦虑
  'sadness',       // 悲伤
  'contentment',   // 满足
  'anticipation',  // 期待
  'frustration',   // 沮丧
  'serenity',      // 宁静
  'loneliness',    // 孤独
  'gratitude',     // 感激
];

// 获取常用情绪
const getCommonMoods = () => {
  return COMMON_MOOD_IDS.map(id => moods.find(m => m.id === id)).filter(Boolean) as Mood[];
};

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (mood: Mood) => {
    onSelect(mood);
  };

  // 根据showAll决定显示哪些情绪
  const displayMoods = showAll ? moods : getCommonMoods();

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

      {/* 情绪卡片网格 */}
      <div
        className={`relative z-10 grid gap-4 md:gap-6 max-w-6xl mx-auto transition-all duration-500 ${
          showAll 
            ? 'grid-cols-4 md:grid-cols-6 lg:grid-cols-9' 
            : 'grid-cols-3 md:grid-cols-5 lg:grid-cols-9'
        }`}
      >
        {displayMoods.map((mood, index) => (
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
              transitionDelay: `${300 + index * 50}ms`,
              animation: isVisible ? `float 4s ease-in-out infinite ${index * 0.2}s` : 'none'
            }}
          >
            <div
              className={`
                relative w-20 h-24 md:w-24 md:h-28 lg:w-28 lg:h-32 rounded-2xl 
                ${mood.bgColor} 
                flex flex-col items-center justify-center
                transition-all duration-300
                shadow-lg hover:shadow-xl
                border-2 border-white/50
                ${selectedMood?.id === mood.id ? 'ring-4 ring-offset-2 ' + mood.ringColor : ''}
              `}
            >
              <span className="text-3xl md:text-4xl lg:text-5xl mb-1 md:mb-2 transform group-hover:scale-110 transition-transform duration-300">
                {mood.icon}
              </span>
              <span className={`text-xs md:text-sm font-semibold ${mood.color}`}>
                {mood.name}
              </span>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/30 transition-all duration-300" />
            </div>
            
            {/* Tooltip - 鼠标悬停显示情绪说明 */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
              <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                {mood.icon} {mood.name} - {mood.description}
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

      {/* 更多/收起按钮 */}
      <button
        onClick={() => setShowAll(!showAll)}
        className={`relative z-10 mt-8 flex items-center gap-2 px-6 py-3 rounded-full 
          bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl
          text-gray-600 hover:text-gray-800 transition-all duration-300
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '500ms' }}
      >
        {showAll ? (
          <>
            <ChevronUp className="w-5 h-5" />
            <span>收起</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-5 h-5" />
            <span>更多情绪 ({moods.length - COMMON_MOOD_IDS.length}+)</span>
          </>
        )}
      </button>

      {/* Selected mood display */}
      {selectedMood && (
        <div className="mt-8 text-center animate-fade-in">
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
