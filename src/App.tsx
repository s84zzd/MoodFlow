import { useState, useEffect, useRef, useCallback } from 'react';
import { MoodSelector } from '@/sections/MoodSelector';
import { SceneSelector } from '@/sections/SceneSelector';
import { ActivityRecommendations } from '@/sections/ActivityRecommendations';
import { SocialShare } from '@/sections/SocialShare';
import { AIAdviceSection } from '@/sections/AIAdvice';
import { Profile } from '@/sections/Profile';
import { CheckInCompleteModal } from '@/components/CheckInCompleteModal';
import { AuthModal } from '@/components/AuthModal';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { useCustomActivities } from '@/hooks/useCustomActivities';
import { useAIAdvice } from '@/hooks/useAIAdvice';
import { TestDataButton } from '@/components/TestDataButton';
import { DebugReportCount } from '@/components/DebugReportCount';
import { isLoggedIn, logout } from '@/services/api';
import type { Mood, Scene } from '@/types';
import { Heart, Share2, Sparkles, Home, BarChart3, User, LogOut } from 'lucide-react';
import './App.css';

type View = 'home' | 'share' | 'advice' | 'profile';

function App() {

  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [showScene, setShowScene] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [checkInComplete, setCheckInComplete] = useState(false);
  
  // 登录状态
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const progressRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
    records,
    addRecord: addMoodRecord,
    canCheckIn,
    exportAsCSV,
    getStats: getMoodStats,
    getRecentRecords,
  } = useMoodHistory();

  const {
    getActivitiesForMood,
  } = useCustomActivities();

  const {
    isGenerating: isGeneratingAdvice,
    generateLocalAdvice,
    generateAIAdvice,
    getRemainingAIAdviceCount,
    getPersonalizedInsights,
  } = useAIAdvice();

  // Calculate progress
  useEffect(() => {
    let progress = 0;
    if (selectedMood) progress += 33;
    if (selectedScene) progress += 33;
    if (checkInComplete) progress += 34;
    
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
      progressRef.current.style.transition = 'width 0.5s ease-out';
    }
  }, [selectedMood, selectedScene, checkInComplete]);

  // Check login status
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  // Handle mood selection
  const handleMoodSelect = useCallback((mood: Mood) => {
    setSelectedMood(mood);
    setShowScene(true);
    
    setTimeout(() => {
      const sceneSection = document.getElementById('scene-section');
      if (sceneSection) {
        sceneSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, []);

  // Handle scene selection
  const handleSceneSelect = useCallback((scene: Scene) => {
    // 检查今日打卡次数（用于提示，不限制）
    const checkResult = canCheckIn(scene);
    
    // 正常流程：直接设置场景并显示活动
    setSelectedScene(scene);
    setShowActivities(true);
    
    // 如果今天打卡次数较多，可以在控制台记录（用于调试）
    if (checkResult.dailyCount && checkResult.dailyCount >= 6) {
      console.log(`今日已打卡 ${checkResult.dailyCount} 次，还可打卡 ${8 - checkResult.dailyCount} 次`);
    }
    
    setTimeout(() => {
      const activitiesSection = document.getElementById('activities-section');
      if (activitiesSection) {
        activitiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, [canCheckIn]);

  // Reset check-in - 定义在前面以避免循环依赖
  const handleReset = useCallback(() => {
    setSelectedMood(null);
    setSelectedScene(null);
    setShowScene(false);
    setShowActivities(false);
    setCheckInComplete(false);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Complete check-in
  const handleCompleteCheckIn = useCallback(() => {
    if (!selectedMood) return;

    // 直接完成打卡（每天最多保留8条记录）
    const result = addMoodRecord(selectedMood, selectedScene);
    if (result.success) {
      setCheckInComplete(true);
    }
  }, [selectedMood, selectedScene, addMoodRecord]);

  // 处理打卡完成弹窗关闭 - 自动重置并返回主页
  const handleCheckInCompleteClose = useCallback(() => {
    setCheckInComplete(false);
    // 重置打卡状态
    setSelectedMood(null);
    setSelectedScene(null);
    setShowScene(false);
    setShowActivities(false);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Get stats and activities
  const moodStats = getMoodStats();
  const recentRecords = getRecentRecords(10);
  // 获取活动：优先匹配同情绪+同场景，不足时补充同情绪其他场景的活动
  const currentActivities = selectedMood ? getActivitiesForMood(selectedMood.id, selectedScene?.id, 10, false) : [];

  // Navigation component
  const Navigation = () => (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-effect rounded-full px-2 py-2 shadow-xl flex items-center gap-1">
        <button
          onClick={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
            currentView === 'home'
              ? 'bg-rose-400 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">打卡</span>
        </button>
        <button
          onClick={() => setCurrentView('share')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
            currentView === 'share'
              ? 'bg-rose-400 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">分享</span>
        </button>
        <button
          onClick={() => setCurrentView('advice')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
            currentView === 'advice'
              ? 'bg-rose-400 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">AI建议</span>
        </button>
        <button
          onClick={() => setCurrentView('profile')}
          className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
            currentView === 'profile'
              ? 'bg-rose-400 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">我的</span>
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF7F4] via-[#FFF9F6] to-[#FDF2F0]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-effect rounded-2xl px-6 py-3 shadow-lg flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span 
                className="text-xl font-bold text-gray-700"
                style={{ fontFamily: 'Pacifico, cursive' }}
              >
                MoodFlow
              </span>
            </div>
            
            {/* Progress indicator - only show on home view */}
            {currentView === 'home' && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  打卡进度
                </span>
                <div className="w-24 sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    ref={progressRef}
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            )}

            {/* Stats badge */}
            {currentView !== 'home' && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BarChart3 className="w-4 h-4" />
                <span>{moodStats.totalRecords} 次记录</span>
              </div>
            )}
            
            {/* Login/Logout button */}
            <div className="flex items-center gap-2">
              {loggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    setLoggedIn(false);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">退出</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-rose-500 text-white hover:bg-rose-600 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">登录</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pb-24">
        {currentView === 'home' ? (
          <>
            {/* Mood Selection Section */}
            <div id="mood-section">
              <MoodSelector 
                selectedMood={selectedMood} 
                onSelect={handleMoodSelect} 
              />
            </div>

            {/* Scene Selection Section */}
            <div id="scene-section">
              <SceneSelector
                selectedScene={selectedScene}
                onSelect={handleSceneSelect}
                isActive={showScene}
              />
            </div>

            {/* Activity Recommendations Section */}
            <div id="activities-section">
              <ActivityRecommendations
                mood={selectedMood}
                scene={selectedScene}
                activities={currentActivities}
                isActive={showActivities}
                onComplete={handleCompleteCheckIn}
                onReset={handleReset}
                isComplete={checkInComplete}
              />
            </div>
          </>
        ) : currentView === 'share' ? (
          <div className="pt-24">
            <SocialShare
              stats={moodStats} 
              isActive={true} 
              recentRecord={recentRecords[0]} // 传递最新记录用于个性化心语
            />
          </div>
        ) : currentView === 'advice' ? (
          <div className="pt-24">
            <AIAdviceSection
              currentMood={selectedMood}
              stats={moodStats}
              recentRecords={recentRecords}
              isActive={true}
              onGenerateLocalAdvice={generateLocalAdvice}
              onGenerateAIAdvice={generateAIAdvice}
              getRemainingAIAdviceCount={getRemainingAIAdviceCount}
              getPersonalizedInsights={getPersonalizedInsights}
              isGenerating={isGeneratingAdvice}
            />
          </div>
        ) : (
          <Profile
            stats={moodStats}
            records={records}
            isActive={true}
            onExportCSV={exportAsCSV}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation />

      {/* 打卡完成弹窗 */}
      <CheckInCompleteModal
        isOpen={checkInComplete}
        onClose={handleCheckInCompleteClose}
        moodName={selectedMood?.name}
      />

      {/* 登录/注册弹窗 */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => setLoggedIn(true)}
      />

      {/* Test Data Button (Dev only) */}
      <TestDataButton />

      {/* Debug Report Count (Dev only) */}
      <DebugReportCount />

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-rose-300 rounded-full animate-float opacity-40" />
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-blue-300 rounded-full animate-float animation-delay-300 opacity-40" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-amber-300 rounded-full animate-float animation-delay-600 opacity-40" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-emerald-300 rounded-full animate-float animation-delay-900 opacity-40" />
      </div>

    </div>
  );
}

export default App;
