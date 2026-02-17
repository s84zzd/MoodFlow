import { useEffect, useState } from 'react';
import { Clock, Sparkles, Heart, CheckCircle2, Trophy, RotateCcw } from 'lucide-react';
import type { Mood, Scene } from '@/types';
import type { CustomActivity } from '@/hooks/useCustomActivities';

interface ActivityRecommendationsProps {
  mood: Mood | null;
  scene: Scene | null;
  activities: CustomActivity[];
  isActive: boolean;
  onComplete: () => void;
  onReset: () => void;
  isComplete: boolean;
}

export function ActivityRecommendations({
  mood,
  scene,
  activities,
  isActive,
  onComplete,
  onReset,
  isComplete,
}: ActivityRecommendationsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  const toggleActivityComplete = (activityId: string) => {
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  if (!isActive || !mood) return null;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-rose-100/50 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-l from-blue-100/50 to-transparent rounded-full blur-3xl" />
      </div>

      <div className={`relative z-10 text-center mb-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm mb-4">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-gray-600">为你推荐</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
          {isComplete ? '打卡完成！' : '专属你的疗愈时刻'}
        </h2>
        <p className="text-gray-500">
          基于你的 <span className={mood.color}>{mood.name}</span> 情绪
          {scene && <> 与 <span className={scene.color}>{scene.name}</span> 场景</>}
        </p>
      </div>

      {/* Completion Celebration */}
      {isComplete && (
        <div className={`relative z-10 mb-8 transition-all duration-500 delay-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}>
          <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 shadow-lg">
            <Trophy className="w-8 h-8 text-amber-500" />
            <div className="text-left">
              <p className="text-lg font-bold text-amber-700">太棒了！</p>
              <p className="text-sm text-amber-600">你完成了今日情绪打卡</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`activity-card group transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ 
              transitionDelay: `${400 + index * 150}ms`,
              marginTop: index === 1 ? '40px' : '0',
            }}
          >
            <div
              className={`
                relative h-full rounded-3xl p-6
                bg-gradient-to-br ${activity.bgGradient}
                border border-white/60
                shadow-lg hover:shadow-2xl
                transition-all duration-500
                overflow-hidden
                ${completedActivities.has(activity.id) ? 'ring-4 ring-green-300' : ''}
              `}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              {/* Completion badge */}
              {completedActivities.has(activity.id) && (
                <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm">
                      <Heart className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <span className={`text-sm font-medium ${activity.color}`}>
                      推荐 {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{activity.duration}</span>
                  </div>
                </div>
                
                {/* Title */}
                <h3 className={`text-xl font-bold mb-3 transition-colors ${
                  completedActivities.has(activity.id) ? 'text-green-600 line-through' : 'text-gray-800 group-hover:text-gray-900'
                }`}>
                  {activity.title}
                </h3>
                
                {/* Description */}
                <p className={`text-sm leading-relaxed mb-6 ${
                  completedActivities.has(activity.id) ? 'text-green-500/70' : 'text-gray-600'
                }`}>
                  {activity.description}
                </p>
                
                {/* Action button */}
                <button
                  onClick={() => toggleActivityComplete(activity.id)}
                  className={`
                    w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 
                    flex items-center justify-center gap-2
                    ${completedActivities.has(activity.id)
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-white/80 hover:bg-white text-gray-700 group-hover:shadow-md'
                    }
                  `}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {completedActivities.has(activity.id) ? '已完成' : '开始练习'}
                </button>
              </div>
              
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mt-16 text-center space-y-4">
        {!isComplete ? (
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <CheckCircle2 className="w-5 h-5" />
            完成打卡
          </button>
        ) : (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-800 text-white font-medium hover:bg-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <RotateCcw className="w-5 h-5" />
            重新打卡
          </button>
        )}
        <p className="text-sm text-gray-400">
          {isComplete 
            ? `已完成 ${completedActivities.size}/${activities.length} 个推荐活动` 
            : '完成打卡后，记录将保存到你的情绪历史中'}
        </p>
      </div>
    </section>
  );
}
