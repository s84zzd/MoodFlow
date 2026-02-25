/**
 * 情绪分享卡片组件
 * 精美的可保存图片卡片，包含用户情绪、心语、位置等信息
 * 用户名长期保存，位置每次可修改
 */

import { useState, useEffect, useRef } from 'react';
import { MapPin, Heart, Calendar, Download, X, Edit2 } from 'lucide-react';
import type { MoodRecord } from '@/hooks/useMoodHistory';
import { moods } from '@/data/moods';

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
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editLocation, setEditLocation] = useState('');

  // 从localStorage加载用户名
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
  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    alert('图片保存功能需要集成 html2canvas 库\n当前为演示版本');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 - 移至卡片内部顶部 */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white shadow-lg hover:bg-gray-700 transition-colors"
          style={{ touchAction: 'manipulation' }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 编辑按钮 - 只在显示卡片时出现 */}
        {!isEditing && (
          <button
            onClick={() => {
              setEditUsername(username);
              setEditLocation(location);
              setIsEditing(true);
            }}
            className="absolute -top-3 right-10 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            <Edit2 className="w-4 h-4" />
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
            {/* 卡片主体 */}
            <div
              ref={cardRef}
              className={`relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br ${getGradient(currentMood?.id)}`}
            >
              {/* 装饰元素 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              {/* 内容区域 */}
              <div className="relative p-8 text-white">
                {/* 头部：日期位置与Logo同行 */}
                <div className="flex items-start justify-between mb-6">
                  {/* 左侧：日期和位置 */}
                  <div>
                    <div className="flex items-center gap-1 text-white/95 text-sm font-medium drop-shadow-sm mb-1">
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
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-white drop-shadow-sm">MoodFlow</span>
                  </div>
                </div>

                {/* 情绪展示 */}
                {currentMood && (
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white/40 backdrop-blur-sm flex items-center justify-center text-5xl shadow-lg border border-white/30">
                      {currentMood.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-bold mb-1 text-white drop-shadow-md">{currentMood.name}</p>
                      <p className="text-white/95 text-sm font-medium drop-shadow-sm">{currentMood.description}</p>
                    </div>
                  </div>
                )}

                {/* 每日心语 - 丰富版 */}
                <div className="bg-white/25 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30 shadow-lg">
                  <p className="text-lg leading-relaxed mb-4 font-semibold text-white drop-shadow-sm">
                    "{quote.text}"
                  </p>
                  <p className="text-white text-base text-right font-bold drop-shadow-md tracking-wide">
                    —— {username || quote.author}
                  </p>
                </div>

                {/* 底部：二维码区域 */}
                <div className="flex items-center justify-between">
                  <div className="text-white/90 text-xs font-medium drop-shadow-sm">
                    <p>记录情绪，关爱自己</p>
                    <p>moodflow.app</p>
                  </div>
                  {/* 二维码占位 */}
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                    <div className="w-12 h-12 border-2 border-gray-300 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">QR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 保存按钮 */}
            <button
              onClick={handleSaveImage}
              className="w-full mt-4 py-4 rounded-2xl bg-white text-gray-800 font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              保存到相册
            </button>
          </>
        )}
      </div>
    </div>
  );
}
