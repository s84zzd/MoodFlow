/**
 * 编辑个人资料弹窗
 */

import { useState } from 'react';
import { X, User, FileText } from 'lucide-react';

interface UserProfile {
  nickname: string;
  bio: string;
  isPublic: boolean;
}

interface ProfileEditModalProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onClose: () => void;
}

export function ProfileEditModal({ profile, onSave, onClose }: ProfileEditModalProps) {
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState<{ nickname?: string }>({});

  const handleSubmit = () => {
    // 验证
    if (!formData.nickname.trim()) {
      setErrors({ nickname: '请输入昵称' });
      return;
    }
    if (formData.nickname.length > 20) {
      setErrors({ nickname: '昵称不能超过20个字符' });
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800">编辑个人资料</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* 昵称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              昵称
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => {
                setFormData({ ...formData, nickname: e.target.value });
                setErrors({});
              }}
              placeholder="给自己起个名字"
              className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all ${
                errors.nickname 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200 focus:border-rose-400'
              }`}
              maxLength={20}
            />
            {errors.nickname && (
              <p className="text-xs text-red-500 mt-1">{errors.nickname}</p>
            )}
            <p className="text-xs text-gray-400 mt-1 text-right">
              {formData.nickname.length}/20
            </p>
          </div>

          {/* 个人介绍 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              个人介绍
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="写一句关于自己的话..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all resize-none"
              maxLength={100}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {formData.bio.length}/100
            </p>
          </div>

          {/* 隐私设置 */}
          <div className="p-4 bg-gray-50 rounded-2xl">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700">公开个人主页</span>
              <button
                onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  formData.isPublic ? 'bg-rose-400' : 'bg-gray-300'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-all"
                  style={{ left: formData.isPublic ? '26px' : '2px' }}
                />
              </button>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              {formData.isPublic 
                ? '开启后，朋友可以通过链接查看你的公开资料' 
                : '关闭后，仅自己可见个人主页'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium hover:shadow-lg transition-all"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
