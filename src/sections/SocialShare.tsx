import { useEffect, useState } from 'react';
import { Copy, Check, Quote, Share2, Users, Trophy, Gift, Sparkles, Image as ImageIcon, Edit2, CheckCircle2 } from 'lucide-react';
import type { MoodStats, MoodRecord } from '@/hooks/useMoodHistory';
import { inspirationalQuotes, moodQuotes } from '@/data/moods';
import { MoodCard } from '@/components/MoodCard';

// 本地存储键 - 与MoodCard组件保持一致
const STORAGE_KEY_USERNAME = 'moodflow_card_username';

interface SocialShareProps {
  stats: MoodStats;
  isActive: boolean;
  recentRecord?: MoodRecord; // 最新情绪记录，用于个性化心语
}

// 邀请好友的奖励机制
interface InviteReward {
  milestone: number;
  reward: string;
  icon: React.ReactNode;
}

const inviteRewards: InviteReward[] = [
  { milestone: 1, reward: '解锁专属心情徽章', icon: <Sparkles className="w-4 h-4" /> },
  { milestone: 3, reward: '获得「情绪导师」称号', icon: <Trophy className="w-4 h-4" /> },
  { milestone: 5, reward: '解锁高级统计图表', icon: <Gift className="w-4 h-4" /> },
  { milestone: 10, reward: '成为校园情绪大使', icon: <Users className="w-4 h-4" /> },
];

export function SocialShare({ stats, isActive, recentRecord }: SocialShareProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCard, setShowCard] = useState(false);
  
  // 根据最新情绪获取初始心语
  const getInitialQuote = () => {
    if (recentRecord?.moodId && moodQuotes[recentRecord.moodId]) {
      const quotes = moodQuotes[recentRecord.moodId];
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
    return inspirationalQuotes[0];
  };
  
  const [randomQuote, setRandomQuote] = useState(getInitialQuote());
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [editedQuote, setEditedQuote] = useState('');
  const [username, setUsername] = useState('');

  // 从localStorage加载用户名
  useEffect(() => {
    const savedUsername = localStorage.getItem(STORAGE_KEY_USERNAME);
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  // 生成邀请好友的分享文案
  const generateInviteText = () => {
    const inviteLink = 'https://moodflow.app/invite?ref=' + (stats.totalRecords > 0 ? 'user' + stats.totalRecords : 'newuser');
    
    return `🌸 我在用 MoodFlow 记录情绪，已经打卡 ${stats.totalRecords} 天啦！

💭 今日心语："${randomQuote.text}" —— ${randomQuote.author}

🎁 邀请你一起加入，记录情绪，关爱自己！
👇 点击链接开始你的情绪打卡之旅：
${inviteLink}

#MoodFlow #情绪打卡 #心理健康`;
  };

  // 复制到剪贴板（用于朋友圈分享）
  const handleCopy = async () => {
    const text = generateInviteText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 调用系统分享（支持微信分享）
  const handleShare = async () => {
    const shareData = {
      title: '邀请你一起记录情绪',
      text: generateInviteText(),
      url: 'https://moodflow.app/invite',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // 用户取消分享，fallback到复制
        handleCopy();
      }
    } else {
      // 不支持系统分享，复制到剪贴板
      handleCopy();
    }
  };

  // Refresh quote - 优先在当前情绪下切换
  const refreshQuote = () => {
    // 如果有最新记录且该情绪有心语库，优先使用该情绪的心语
    if (recentRecord?.moodId && moodQuotes[recentRecord.moodId]) {
      const moodSpecificQuotes = moodQuotes[recentRecord.moodId];
      // 过滤掉当前显示的心语，避免重复
      const otherQuotes = moodSpecificQuotes.filter(q => q.text !== randomQuote.text);
      if (otherQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherQuotes.length);
        setRandomQuote(otherQuotes[randomIndex]);
        return;
      }
    }
    //  fallback: 使用通用心语
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    setRandomQuote(inspirationalQuotes[randomIndex]);
  };

  if (!isActive) return null;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/30 pointer-events-none" />

      <div className={`relative z-10 text-center mb-10 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm mb-4">
          <Share2 className="w-4 h-4 text-rose-500" />
          <span className="text-sm text-gray-600">分享与导出</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3">
          记录你的情绪旅程
        </h2>
        <p className="text-gray-500">
          分享你的进步，或导出数据备份
        </p>
      </div>

      {/* 每日心语标题 */}
      <div className="relative z-10 mb-8 text-center">
        <h3 className="text-xl font-bold text-gray-700">分享今日心语</h3>
        <p className="text-sm text-gray-500 mt-1">选择一句触动你的话，分享给朋友</p>
      </div>

      {/* Content Card - 每日心语 */}
      <div className={`relative z-10 w-full max-w-lg transition-all duration-700 delay-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/60">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 flex items-center justify-center mx-auto mb-4">
              <Quote className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">每日心语</h3>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mb-6 relative group">
            {/* 编辑按钮 */}
            {!isEditingQuote && (
              <button
                onClick={() => {
                  setEditedQuote(randomQuote.text);
                  setIsEditingQuote(true);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 text-gray-400 hover:text-amber-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                title="编辑心语"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            
            {isEditingQuote ? (
              <div className="space-y-3">
                <textarea
                  value={editedQuote}
                  onChange={(e) => setEditedQuote(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all resize-none text-gray-700 leading-relaxed"
                  rows={4}
                  placeholder="输入你想分享的话..."
                  maxLength={200}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{editedQuote.length}/200</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditingQuote(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        if (editedQuote.trim()) {
                          setRandomQuote({ ...randomQuote, text: editedQuote.trim() });
                          setIsEditingQuote(false);
                        }
                      }}
                      disabled={!editedQuote.trim()}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      保存
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-lg text-gray-700 text-center leading-relaxed mb-4">
                  "{randomQuote.text}"
                </p>
                <p className="text-sm text-gray-400 text-center">
                  —— {username || randomQuote.author}
                </p>
              </>
            )}
          </div>

          {/* 按钮组 */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={refreshQuote}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-all"
            >
              换一句
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              邀请好友
            </button>
          </div>

          {/* 生成情绪卡片按钮 */}
          <button
            onClick={() => setShowCard(true)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-6"
          >
            <ImageIcon className="w-4 h-4" />
            生成情绪卡片
          </button>

          {/* 复制纯文本按钮（小字） */}
          <button
            onClick={handleCopy}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? '已复制到剪贴板' : '复制纯文本'}
          </button>
        </div>
      </div>

      {/* 邀请好友奖励说明 */}
      <div className={`relative z-10 mt-6 w-full max-w-lg transition-all duration-700 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-white/60">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-rose-500" />
            <h4 className="font-semibold text-gray-700">邀请好友奖励</h4>
          </div>
          <div className="space-y-3">
            {inviteRewards.map((reward, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-sm font-bold text-rose-500">
                  {reward.milestone}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">邀请 {reward.milestone} 位好友</p>
                  <p className="text-xs text-rose-500 font-medium">{reward.reward}</p>
                </div>
                <div className="text-rose-400">{reward.icon}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            💡 每邀请一位好友打卡，你们都能获得情绪积分
          </p>
        </div>
      </div>

      {/* 情绪卡片弹窗 */}
      <MoodCard
        record={recentRecord || null}
        quote={randomQuote}
        isOpen={showCard}
        onClose={() => setShowCard(false)}
      />

    </section>
  );
}
