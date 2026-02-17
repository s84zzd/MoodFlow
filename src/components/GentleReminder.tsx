import { useState, useEffect } from 'react';
import { Clock, Heart, Sparkles, X } from 'lucide-react';
import type { MoodRecord } from '@/hooks/useMoodHistory';

interface GentleReminderProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  remainingMinutes: number;
  lastRecord: MoodRecord;
}

export function GentleReminder({
  isOpen,
  onClose,
  onContinue,
  remainingMinutes,
  lastRecord,
}: GentleReminderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(onContinue, 300);
  };

  if (!isOpen) return null;

  const lastTime = new Date(lastRecord.timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'
        }`}
      >
        {/* Decorative header */}
        <div className="relative h-32 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 overflow-hidden">
          {/* Floating elements */}
          <div className="absolute top-4 left-8 w-3 h-3 bg-rose-300 rounded-full animate-float" />
          <div className="absolute top-8 right-12 w-2 h-2 bg-amber-300 rounded-full animate-float animation-delay-300" />
          <div className="absolute bottom-4 left-16 w-2 h-2 bg-pink-300 rounded-full animate-float animation-delay-600" />
          
          {/* Heart icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-rose-400 fill-rose-100" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-amber-500" />
              </div>
            </div>
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/60 hover:bg-white/80 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            刚刚才记录过呢 💝
          </h3>
          
          <p className="text-gray-500 mb-6 leading-relaxed">
            你在 <span className="font-medium text-rose-500">{lastTime}</span> 刚刚记录过
            <span className={lastRecord.moodColor}>{lastRecord.moodName}</span> 情绪
            {lastRecord.sceneName && (
              <>
                （<span className="font-medium">{lastRecord.sceneName}</span> 场景）
              </>
            )}
            <br />
            <span className="text-sm text-gray-400">1小时内只能记录一次哦</span>
          </p>

          {/* Time remaining card */}
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-rose-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">建议等待时间</span>
            </div>
            <div className="text-3xl font-bold text-rose-500">
              {remainingMinutes}<span className="text-lg font-normal text-rose-400">分钟</span>
            </div>
            <p className="text-xs text-rose-400 mt-1">
              让情绪沉淀一下，记录会更准确哦
            </p>
          </div>

          {/* Gentle message */}
          <div className="bg-amber-50 rounded-xl p-3 mb-6">
            <p className="text-sm text-amber-700 italic">
              "情绪的流动需要时间，给自己一点空间，感受它的变化 ✨"
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-all"
            >
              稍后再来
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              仍要记录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
