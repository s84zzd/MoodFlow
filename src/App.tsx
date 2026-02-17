import { useState, useEffect, useRef, useCallback } from 'react';
import { MoodSelector } from '@/sections/MoodSelector';
import { SceneSelector } from '@/sections/SceneSelector';
import { ActivityRecommendations } from '@/sections/ActivityRecommendations';
import { SocialShare } from '@/sections/SocialShare';
import { AIAdviceSection } from '@/sections/AIAdvice';
import { Profile } from '@/sections/Profile';
import { GentleReminder } from '@/components/GentleReminder';
import { useMoodHistory } from '@/hooks/useMoodHistory';
import { useCustomActivities } from '@/hooks/useCustomActivities';
import { useAIAdvice } from '@/hooks/useAIAdvice';
import type { Mood, Scene } from '@/types';
import type { MoodRecord } from '@/hooks/useMoodHistory';
import { Heart, Share2, Sparkles, Home, BarChart3, User } from 'lucide-react';
import './App.css';

type View = 'home' | 'share' | 'advice' | 'profile';

function App() {

  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [showScene, setShowScene] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [checkInComplete, setCheckInComplete] = useState(false);
  
  // Gentle reminder state
  const [showReminder, setShowReminder] = useState(false);
  const [reminderData, setReminderData] = useState<{
    remainingMinutes: number;
    lastRecord: MoodRecord;
  } | null>(null);
  
  const progressRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
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
    generateAdvice,
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
    // 提前检查1小时限制
    const checkResult = canCheckIn(scene);
    
    if (!checkResult.allowed && checkResult.remainingMinutes && checkResult.lastRecord) {
      // 如果同一场景1小时内已打卡，显示温和提醒
      setReminderData({
        remainingMinutes: checkResult.remainingMinutes,
        lastRecord: checkResult.lastRecord,
      });
      setShowReminder(true);
      // 仍然设置场景，但让用户决定是否继续
      setSelectedScene(scene);
      setShowActivities(true);
    } else {
      // 正常流程
      setSelectedScene(scene);
      setShowActivities(true);
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

    // 直接完成打卡（1小时检查已提前到场景选择时）
    const result = addMoodRecord(selectedMood, selectedScene);
    if (result.success) {
      setCheckInComplete(true);
    }
  }, [selectedMood, selectedScene, addMoodRecord]);

  // Force complete check-in (skip 1-hour check)
  const handleForceCompleteCheckIn = useCallback(() => {
    if (selectedMood) {
      const result = addMoodRecord(selectedMood, selectedScene, undefined, true);
      if (result.success) {
        setCheckInComplete(true);
        setShowReminder(false);
        
        // 延迟3秒后自动回到主页，让用户看到打卡完成的鼓励用语
        setTimeout(() => {
          handleReset();
        }, 3000);
      }
    }
  }, [selectedMood, selectedScene, addMoodRecord, handleReset]);

  // Get stats and activities
  const moodStats = getMoodStats();
  const recentRecords = getRecentRecords(10);
  const currentActivities = selectedMood ? getActivitiesForMood(selectedMood.id, selectedScene?.id, 3) : [];

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
              onGenerateAdvice={generateAdvice}
              getPersonalizedInsights={getPersonalizedInsights}
              isGenerating={isGeneratingAdvice}
            />
          </div>
        ) : (
          <Profile
            stats={moodStats}
            records={recentRecords}
            isActive={true}
            onExportCSV={exportAsCSV}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation />

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-rose-300 rounded-full animate-float opacity-40" />
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-blue-300 rounded-full animate-float animation-delay-300 opacity-40" />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-amber-300 rounded-full animate-float animation-delay-600 opacity-40" />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-emerald-300 rounded-full animate-float animation-delay-900 opacity-40" />
      </div>

      {/* Gentle Reminder Modal */}
      {reminderData && (
        <GentleReminder
          isOpen={showReminder}
          onClose={() => {
            setShowReminder(false);
            // 用户选择"稍后再来"，重置到主页
            handleReset();
          }}
          onContinue={handleForceCompleteCheckIn}
          remainingMinutes={reminderData.remainingMinutes}
          lastRecord={reminderData.lastRecord}
        />
      )}
    </div>
  );
}

export default App;
