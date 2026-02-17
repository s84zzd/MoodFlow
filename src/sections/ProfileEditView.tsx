/**
 * 个人资料展示页面（朋友可见）
 */

import { Share2, Eye, EyeOff, BarChart3, Calendar, Award } from 'lucide-react';
import type { MoodStats } from '@/hooks/useMoodHistory';

interface UserProfile {
  nickname: string;
  bio: string;
  isPublic: boolean;
}

interface ProfileEditViewProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  stats: MoodStats;
}

export function ProfileEditView({ profile, onUpdate, stats }: ProfileEditViewProps) {
  // 生成分享链接
  const shareLink = `https://moodflow.app/user/${Math.random().toString(36).substring(7)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('链接已复制到剪贴板');
  };

  return (
    <div className="space-y-6">
      {/* 隐私设置卡片 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">个人主页隐私</h3>
          <button
            onClick={() => onUpdate({ ...profile, isPublic: !profile.isPublic })}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              profile.isPublic 
                ? 'bg-emerald-100 text-emerald-600' 
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {profile.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {profile.isPublic ? '公开' : '私密'}
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          {profile.isPublic 
            ? '你的朋友可以通过链接查看你的公开资料和成就' 
            : '你的个人主页仅自己可见'}
        </p>

        {profile.isPublic && (
          <div className="flex gap-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 rounded-xl text-sm text-gray-600"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-rose-100 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-200 transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              复制链接
            </button>
          </div>
        )}
      </div>

      {/* 公开资料预览 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <h3 className="font-bold text-gray-800 mb-4">朋友可见内容</h3>
        
        <div className="space-y-4">
          {/* 基础信息 */}
          <div className="p-4 bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-400 mb-1">昵称</p>
            <p className="font-medium text-gray-800">{profile.nickname}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-400 mb-1">个人介绍</p>
            <p className="text-gray-700">{profile.bio}</p>
          </div>

          {/* 公开统计 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-rose-50 rounded-2xl text-center">
              <BarChart3 className="w-5 h-5 text-rose-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-rose-500">{stats.totalRecords}</p>
              <p className="text-xs text-gray-500">总打卡</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl text-center">
              <Calendar className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-amber-500">{stats.streakDays}</p>
              <p className="text-xs text-gray-500">连续天数</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl text-center">
              <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-purple-500">
                {Object.keys(stats.moodDistribution).length}
              </p>
              <p className="text-xs text-gray-500">情绪类型</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4 text-center">
          💡 详细打卡记录和情绪分布图表仅自己可见
        </p>
      </div>

      {/* 编辑提示 */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4">
        <p className="text-sm text-gray-600 text-center">
          点击上方头像旁的编辑按钮，可以修改昵称和个人介绍
        </p>
      </div>
    </div>
  );
}
