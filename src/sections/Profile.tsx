/**
 * 我的页面 - 个人中心
 * 包含：成就、统计、资料、设置
 */

import { useState, useEffect } from 'react';
import { User, BarChart3, Settings, Trophy, Edit3 } from 'lucide-react';
import type { MoodStats, MoodRecord } from '@/hooks/useMoodHistory';
import { useStatistics } from '@/hooks/useStatistics';
import { StatisticsView } from './StatisticsView';
import { AchievementsView } from './AchievementsView';
import { ProfileSettingsView } from './ProfileSettingsView';
import { ProfileEditView } from './ProfileEditView';
import { ProfileEditModal } from './ProfileEditModal';

interface ProfileProps {
  stats: MoodStats;
  records: MoodRecord[];
  isActive: boolean;
  onExportCSV: () => string;
}

type TabType = 'achievements' | 'stats' | 'profile' | 'settings';

export function Profile({ stats, records, isActive, onExportCSV }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<TabType>('achievements');
  const [isVisible, setIsVisible] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    nickname: '情绪探索者',
    bio: '记录每一天的情绪变化，成为更好的自己',
    isPublic: true,
  });

  const { getLast7DaysStats, getLast4WeeksStats } = useStatistics(records);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <section className="min-h-screen flex flex-col items-center px-4 py-16 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/30 pointer-events-none" />

      {/* Header */}
      <div className={`relative z-10 text-center mb-8 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm mb-4">
          <User className="w-4 h-4 text-rose-500" />
          <span className="text-sm text-gray-600">个人中心</span>
        </div>
        
        {/* User Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60 mb-6">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <button 
              className="absolute bottom-3 right-0 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-rose-500"
              onClick={() => setIsEditingProfile(true)}
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{userProfile.nickname}</h2>
          <p className="text-sm text-gray-500 mb-3">{userProfile.bio}</p>
          <div className="flex items-center justify-center gap-2 text-amber-500">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">连续打卡 {stats.streakDays} 天</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 justify-center flex-wrap">
          <TabButton
            active={activeTab === 'achievements'}
            onClick={() => setActiveTab('achievements')}
            icon={<Trophy className="w-4 h-4" />}
            label="成就"
          />
          <TabButton
            active={activeTab === 'stats'}
            onClick={() => setActiveTab('stats')}
            icon={<BarChart3 className="w-4 h-4" />}
            label="统计"
          />
          <TabButton
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            icon={<User className="w-4 h-4" />}
            label="资料"
          />
          <TabButton
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            icon={<Settings className="w-4 h-4" />}
            label="设置"
          />
        </div>
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full max-w-lg transition-all duration-700 delay-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {activeTab === 'achievements' && <AchievementsView stats={stats} />}
        {activeTab === 'stats' && (
          <StatisticsView
            stats7Days={getLast7DaysStats()}
            stats4Weeks={getLast4WeeksStats()}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileEditView 
            profile={userProfile}
            onUpdate={setUserProfile}
            stats={stats}
          />
        )}
        {activeTab === 'settings' && <ProfileSettingsView onExportCSV={onExportCSV} />}
      </div>

      {/* 编辑资料弹窗 */}
      {isEditingProfile && (
        <ProfileEditModal
          profile={userProfile}
          onSave={(newProfile) => {
            setUserProfile(newProfile);
            setIsEditingProfile(false);
          }}
          onClose={() => setIsEditingProfile(false)}
        />
      )}
    </section>
  );
}

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
        active
          ? 'bg-rose-100 text-rose-600 shadow-md'
          : 'bg-white/60 text-gray-500 hover:bg-white/80'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
