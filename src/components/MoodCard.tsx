/**
 * 情绪分享卡片组件
 * 精美的可保存图片卡片，包含用户情绪、心语、位置等信息
 * 用户名长期保存，位置每次可修改
 */

import { useState, useEffect, useRef } from 'react';
import { MapPin, Heart, Calendar, Download, X, Edit2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { MoodRecord } from '@/hooks/useMoodHistory';
import { moods } from '@/data/moods';
import { QR_CODE_DATA_URL } from '@/assets/qr-code';
import { getTwemojiUrl } from '@/lib/twemoji';

interface MoodCardProps {
  record: MoodRecord | null;
  quote: { text: string; author: string };
  isOpen: boolean;
  onClose: () => void;
}

// 本地存储键
const STORAGE_KEY_USERNAME = 'moodflow_card_username';

export function MoodCard({ record, quote, isOpen, onClose }: MoodCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editLocation, setEditLocation] = useState('');
  
  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });

  // 从 localStorage 加载用户名
  useEffect(() => {
    const savedUsername = localStorage.getItem(STORAGE_KEY_USERNAME);
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // 每次打开卡片时，都进入编辑模式让用户确认/修改位置
  useEffect(() => {
    if (isOpen) {
      setEditUsername(username);
      setEditLocation(location);
      // 如果没有用户名，必须填写；有用户名时，让用户确认位置
      if (!username) {
        setIsEditing(true);
      } else {
        // 有用户名时，默认显示卡片，但位置可编辑
        setIsEditing(false);
      }
    }
  }, [isOpen, username]);

  // 保存用户名到localStorage（长期保存）
  const saveUsername = (name: string) => {
    setUsername(name);
    localStorage.setItem(STORAGE_KEY_USERNAME, name);
  };

  // 保存设置
  const handleSave = () => {
    if (editUsername.trim()) {
      saveUsername(editUsername.trim());
    }
    // 位置只保存到当前状态，不存localStorage，下次打开需要重新填写
    setLocation(editLocation.trim());
    setIsEditing(false);
  };

  // 获取当前情绪信息
  const currentMood = record ? moods.find(m => m.id === record.moodId) : null;

  // 根据情绪获取渐变背景 - 使用更深的颜色增强对比度
  const getGradient = (moodId?: string) => {
    const gradients: Record<string, string> = {
      anxiety: 'from-purple-600 via-purple-500 to-pink-500',
      melancholy: 'from-blue-600 via-indigo-500 to-blue-500',
      happy: 'from-amber-500 via-orange-400 to-amber-400',
      calm: 'from-emerald-600 via-teal-500 to-emerald-500',
      regret: 'from-slate-600 via-gray-500 to-slate-500',
      anticipation: 'from-orange-500 via-amber-500 to-orange-400',
      content: 'from-pink-600 via-rose-500 to-pink-500',
      doubt: 'from-amber-600 via-orange-500 to-amber-500',
      stress: 'from-red-600 via-rose-500 to-red-500',
    };
    return gradients[moodId || 'calm'] || gradients.calm;
  };

  // 获取当前日期格式化
  const getFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[now.getDay()];
    return `${year}年${month}月${day}日 ${weekday}`;
  };

  // 保存图片功能
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveImage = async () => {
    if (!cardRef.current || isSaving) return;
    
    setIsSaving(true);
    
    try {
      // 临时修改样式以确保截图稳定
      const originalTransform = cardRef.current.style.transform;
      const originalCursor = cardRef.current.style.cursor;
      
      cardRef.current.style.transform = 'none';
      cardRef.current.style.cursor = 'default';
      
      // 等待字体加载完成后再截图
      await document.fonts.ready;
      
      // 记录当前滚动位置
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      
      // 滚动到顶部确保截图完整
      window.scrollTo(0, 0);
      
      // 等待一帧确保样式应用
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      const canvas = await html2canvas(cardRef.current, {
        scale: window.devicePixelRatio || 2, // 使用设备像素比，提高清晰度
        useCORS: true, // 启用 CORS 支持 Twemoji CDN 图片
        allowTaint: false, // 禁止污染，确保可以导出
        backgroundColor: null, // 背景透明
        removeContainer: true, // 移除临时容器，避免残留
        logging: false,
        imageTimeout: 15000,
        scrollX: 0, // 防止滚动偏移
        scrollY: 0,
        ignoreElements: (element) => {
          // 忽略可能导致问题的元素
          return element.tagName === 'IFRAME' || element.tagName === 'VIDEO';
        },
        onclone: (clonedDoc, clonedElement) => {
          // 确保克隆的文档有正确的视口
          clonedDoc.body.style.margin = '0';
          clonedDoc.body.style.padding = '0';
          clonedDoc.body.style.backgroundColor = 'transparent';
          
          // 确保克隆元素本身没有边距导致白边
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '0';
          clonedElement.style.backgroundColor = 'transparent';
          
          // 强制设置背景渐变 - 使用与 Tailwind 一致的方向和颜色
          const currentMoodId = currentMood?.id || 'calm';
          const gradients: Record<string, string> = {
            anxiety: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
            melancholy: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            happy: 'linear-gradient(135deg, #eab308 0%, #f97316 100%)',
            regret: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            calm: 'linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)',
            anticipation: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
            content: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            doubt: 'linear-gradient(135deg, #d97706 0%, #f97316 100%)',
            stress: 'linear-gradient(135deg, #dc2626 0%, #ec4899 100%)',
          };
          clonedElement.style.background = gradients[currentMoodId] || gradients.calm;
          
          // Twemoji 图片已经是标准图片，无需特殊处理
        }
      });
      
      console.log('Canvas generated successfully:', canvas.width, 'x', canvas.height);
      
      // 恢复滚动位置
      window.scrollTo(scrollX, scrollY);
      
      // 恢复样式
      cardRef.current.style.transform = originalTransform;
      cardRef.current.style.cursor = originalCursor;
      
      // 使用 toBlob 方法，避免 toDataURL 的跨域问题
      const filename = `MoodFlow_${currentMood?.name || '心情'}_${new Date().toISOString().slice(0, 10)}.png`;
      
      await new Promise<void>((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('生成 Blob 失败'));
              return;
            }
            
            console.log('Blob generated:', blob.size, 'bytes');
            
            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.style.display = 'none';
            
            // 添加到页面
            document.body.appendChild(link);
            
            // 触发下载
            link.click();
            
            console.log('Download triggered successfully');
            
            // 延迟清理
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              resolve();
            }, 100);
          }, 'image/png', 1.0);
        } catch (err) {
          reject(err);
        }
      });
      
    } catch (error) {
      console.error('保存图片失败:', error);
      if (error instanceof Error) {
        alert(`保存图片失败：${error.message}\n\n请尝试：\n1. 刷新页面后重试\n2. 使用其他浏览器\n3. 截图保存`);
      } else {
        alert('保存图片失败，请截图保存');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 触摸/拖拽事件处理
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    dragStart.current = { x: clientX - currentPosition.current.x, y: clientY - currentPosition.current.y };
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragStart.current.x;
    const newY = clientY - dragStart.current.y;
    
    currentPosition.current = { x: newX, y: newY };
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 重置位置当卡片打开时
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      currentPosition.current = { x: 0, y: 0 };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[340px] sm:max-w-md"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 - 移至卡片内部，增大触摸区域 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-3 -right-3 z-20 w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white shadow-lg hover:bg-gray-700 active:bg-gray-900 transition-colors"
          style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
          aria-label="关闭"
        >
          <X className="w-6 h-6 pointer-events-none" />
        </button>

        {/* 编辑按钮 - 只在显示卡片时出现 */}
        {!isEditing && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditUsername(username);
              setEditLocation(location);
              setIsEditing(true);
            }}
            className="absolute -top-3 right-12 z-20 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            aria-label="编辑"
          >
            <Edit2 className="w-5 h-5 pointer-events-none" />
          </button>
        )}

        {/* 编辑表单 */}
        {isEditing ? (
          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {username ? '编辑卡片信息' : '填写卡片信息'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  你的名字 {username && <span className="text-gray-400 font-normal">（已保存）</span>}
                </label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="输入你的名字"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  位置 <span className="text-rose-500">*</span>
                  <span className="text-gray-400 font-normal text-xs ml-1">（每次可修改）</span>
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="输入你的位置（如：北京·朝阳区）"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                  maxLength={20}
                />
              </div>
              <div className="flex gap-3 pt-2">
                {username && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={!editUsername.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 卡片主体 - 移动端优化尺寸，支持拖拽 */}
            <div
              ref={cardRef}
              className={`relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br ${getGradient(currentMood?.id)} max-h-[80vh] sm:max-h-none cursor-grab active:cursor-grabbing select-none`}
              style={{ 
                margin: 0, 
                padding: 0,
                backgroundColor: 'transparent',
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleTouchStart}
              onMouseMove={handleTouchMove}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
            >
              {/* 装饰元素 */}
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              {/* 内容区域 - 减小内边距 */}
              <div className="relative p-5 sm:p-8 text-white">
                {/* 头部：日期位置与Logo同行 */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  {/* 左侧：日期和位置 */}
                  <div>
                    <div className="flex items-center gap-1 text-white/95 text-xs sm:text-sm font-medium drop-shadow-sm mb-1">
                      <Calendar className="w-3 h-3" />
                      <span>{getFormattedDate()}</span>
                    </div>
                    {location ? (
                      <div className="flex items-center gap-1 text-white/80 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span className="drop-shadow-sm">{location}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>点击编辑添加位置</span>
                      </div>
                    )}
                  </div>
                  {/* 右侧：Logo */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="font-bold text-sm sm:text-lg text-white drop-shadow-sm">MoodFlow</span>
                  </div>
                </div>

                {/* 情绪展示 - 使用 Twemoji 图片替代原生 emoji，解决 html2canvas 兼容性问题 */}
                {currentMood && (
                  <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/40 shadow-lg border border-white/30 flex-shrink-0 flex items-center justify-center p-2 sm:p-3">
                      <img 
                        src={getTwemojiUrl(currentMood.icon)}
                        alt={currentMood.name}
                        className="w-full h-full object-contain"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1 text-white drop-shadow-md">{currentMood.name}</p>
                      <p className="text-white/95 text-xs sm:text-sm font-medium drop-shadow-sm">{currentMood.description}</p>
                    </div>
                  </div>
                )}

                {/* 每日心语 - 丰富版 */}
                <div className="bg-white/25 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/30 shadow-lg">
                  <p className="text-sm sm:text-lg leading-relaxed mb-3 sm:mb-4 font-semibold text-white drop-shadow-sm">
                    "{quote.text}"
                  </p>
                  <p className="text-white text-sm sm:text-base text-right font-bold drop-shadow-md tracking-wide">
                    —— {username || quote.author}
                  </p>
                </div>

                {/* 底部：二维码区域 */}
                <div className="flex items-center justify-between">
                  <div className="text-white/90 text-xs font-medium drop-shadow-sm">
                    <p>记录情绪，关爱自己</p>
                    <p>moodflow.app</p>
                  </div>
                  {/* 二维码 - 使用 base64 DataURL */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-1">
                    <img 
                      src={QR_CODE_DATA_URL} 
                      alt="MoodFlow QR Code" 
                      className="w-full h-full object-contain"
                      data-qr="true"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 保存按钮 */}
            <button
              onClick={handleSaveImage}
              disabled={isSaving}
              className="w-full mt-4 py-4 rounded-2xl bg-white text-gray-800 font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  生成图片中...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  保存到相册
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
