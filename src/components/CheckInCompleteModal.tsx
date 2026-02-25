import { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface CheckInCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  moodName?: string;
}

/**
 * 打卡完成弹窗组件
 * 打卡完成后显示，3秒后自动关闭
 */
export function CheckInCompleteModal({
  isOpen,
  onClose,
  moodName,
}: CheckInCompleteModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCountdown(5);
      
      // 倒计时
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 5秒后自动关闭
      const closeTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);

      return () => {
        clearInterval(countdownTimer);
        clearTimeout(closeTimer);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
      />

      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-3">
          打卡成功！
        </h3>

        {/* Message */}
        <p className="text-gray-500 text-center mb-6">
          {moodName ? (
            <>已记录你的 <span className="font-medium text-rose-500">{moodName}</span> 情绪</>
          ) : (
            '情绪记录已保存'
          )}
        </p>

        {/* Countdown indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
          <Sparkles className="w-4 h-4" />
          <span>{countdown} 秒后自动返回主页</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${(countdown / 5) * 100}%` }}
          />
        </div>

        {/* Manual close button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium hover:shadow-lg transition-all"
        >
          立即返回
        </button>
      </div>
    </div>
  );
}
