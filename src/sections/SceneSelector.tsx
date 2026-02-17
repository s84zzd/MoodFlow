import { useEffect, useState } from 'react';
import type { Scene } from '@/types';
import { scenes } from '@/data/moods';

interface SceneSelectorProps {
  selectedScene: Scene | null;
  onSelect: (scene: Scene) => void;
  isActive: boolean;
}

export function SceneSelector({ selectedScene, onSelect, isActive }: SceneSelectorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  const handleCardClick = (scene: Scene) => {
    onSelect(scene);
  };

  if (!isActive) return null;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent pointer-events-none" />

      <div className="relative z-10 text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-bold text-gray-700 mb-4 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          你在哪里？
        </h2>
        <p className={`text-lg text-gray-500 transition-all duration-700 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          选择你当前所处的场景
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            onClick={() => handleCardClick(scene)}
            className={`
              scene-card cursor-pointer group
              ${selectedScene?.id === scene.id ? 'selected' : ''}
              transition-all duration-600
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}
            `}
            style={{ transitionDelay: `${200 + index * 100}ms` }}
          >
            <div
              className={`
                relative w-full aspect-square max-w-[180px] mx-auto rounded-3xl
                ${scene.bgColor}
                flex flex-col items-center justify-center
                transition-all duration-500
                shadow-lg hover:shadow-2xl
                border-2 border-white/60
                ${selectedScene?.id === scene.id ? `ring-4 ring-offset-4 ${scene.color.replace('text-', 'ring-')}` : ''}
              `}
            >
              {/* Icon container */}
              <div className="relative mb-4">
                <span className="text-6xl md:text-7xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 inline-block">
                  {scene.icon}
                </span>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                  <span className="text-6xl md:text-7xl">{scene.icon}</span>
                </div>
              </div>
              
              <span className={`text-xl font-semibold ${scene.color}`}>
                {scene.name}
              </span>
              
              {/* Selected checkmark */}
              {selectedScene?.id === scene.id && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md animate-bounce-in">
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 rounded-3xl bg-white/0 group-hover:bg-white/20 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Selected scene display */}
      {selectedScene && (
        <div className="mt-12 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg">
            <span className="text-2xl">{selectedScene.icon}</span>
            <span className="text-lg font-medium text-gray-700">
              当前场景：<span className={selectedScene.color}>{selectedScene.name}</span>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
