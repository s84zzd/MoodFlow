import { useState, useEffect } from 'react';
import { Info, Heart, Sparkles, X } from 'lucide-react';

interface DailyLimitReminderProps {
  isOpen: boolean;
  onClose: () => void;
  dailyCount: number;
}

/**
 * 每日打卡次数提示组件
 * 当用户今天打卡次数较多时显示友好提示
 */
export function DailyLimitReminder({
  isOpen,
  onClose,
  dailyCount,
}: DailyLimitReminderProps) {
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

  if (!isOpen) return null;

  const remainingCount = Math.max(0, 8 - dailyCount);

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
        <div className="relative h-32 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50 overflow-hidden">
          {/* Floating elements */}
          <div className="absolute top-4 left-8 w-3 h-3 bg-blue-300 rounded-full animate-float" />
          <div className="absolute top-8 right-12 w-2 h-2 bg-purple-300 rounded-full animate-float animation-delay-300" />
          <div className="absolute bottom-4 left-16 w-2 h-2 bg-indigo-300 rounded-full animate-float animation-delay-600" />
          
          {/* Info icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Info className="w-8 h-8 text-blue-500" />
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
            今日打卡提醒 💝
          </h3>
          
          <p className="text-gray-500 mb-6 leading-relaxed">
            你今天已经记录了 <span className="font-medium text-blue-500">{dailyCount}</span> 次情绪
            <br />
            <span className="text-sm text-gray-400">系统每天最多保留8条记录</span>
          </p>

          {/* Count card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">今日剩余次数</span>
            </div>
            <div className="text-3xl font-bold text-blue-500">
              {remainingCount}<span className="text-lg font-normal text-blue-400">次</span>
            </div>
            <p className="text-xs text-blue-400 mt-1">
              {remainingCount > 0 
                ? '超过8次后，最早的一条记录会被自动替换' 
                : '再打卡将替换今天最早的一条记录'}
            </p>
          </div>

          {/* Gentle message */}
          <div className="bg-amber-50 rounded-xl p-3 mb-6">
            <p className="text-sm text-amber-700 italic">
              "频繁的记录有助于更好地了解自己的情绪模式 ✨"
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            知道了，继续打卡
          </button>
        </div>
      </div>
    </div>
  );
}
