import { useCallback, useState } from 'react';
import { inspirationalQuotes } from '@/data/moods';
import type { MoodStats } from '@/hooks/useMoodHistory';

export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

export function useSocialShare() {
  const [isSharing, setIsSharing] = useState(false);

  // Get random inspirational quote
  const getRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    return inspirationalQuotes[randomIndex];
  }, []);

  // Generate share text for mood stats
  const generateStatsShareText = useCallback((stats: MoodStats): string => {
    const dominantMood = Object.entries(stats.moodDistribution)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '平静';
    
    const quote = getRandomQuote();
    
    return `🌸 我的情绪打卡记录\n\n` +
      `📊 已记录 ${stats.totalRecords} 次情绪\n` +
      `🔥 连续打卡 ${stats.streakDays} 天\n` +
      `💭 主要情绪：${dominantMood}\n\n` +
      `✨ "${quote.text}"\n` +
      `   —— ${quote.author}\n\n` +
      `来自 MoodFlow 情绪打卡`;
  }, [getRandomQuote]);

  // Native Web Share API
  const shareNative = useCallback(async (data: ShareData): Promise<boolean> => {
    if (typeof navigator === 'undefined' || !navigator.share) return false;
    
    try {
      setIsSharing(true);
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url || window.location.href,
      });
      return true;
    } catch (error) {
      // User cancelled or share failed
      return false;
    } finally {
      setIsSharing(false);
    }
  }, []);

  // Share to clipboard
  const shareToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, []);

  // Check if native share is available
  const isNativeShareAvailable = (): boolean => {
    return typeof navigator !== 'undefined' && 'share' in navigator;
  };

  // Share mood stats
  const shareMoodStats = useCallback(async (stats: MoodStats): Promise<boolean> => {
    const shareText = generateStatsShareText(stats);
    
    // Try native share first
    if (isNativeShareAvailable()) {
      const success = await shareNative({
        title: '我的情绪打卡记录',
        text: shareText,
      });
      if (success) return true;
    }
    
    // Fall back to clipboard
    return await shareToClipboard(shareText);
  }, [generateStatsShareText, shareNative, shareToClipboard]);

  // Share quote only
  const shareQuote = useCallback(async (): Promise<boolean> => {
    const quote = getRandomQuote();
    const shareText = `✨ "${quote.text}"\n   —— ${quote.author}\n\n来自 MoodFlow 情绪打卡`;
    
    if (isNativeShareAvailable()) {
      const success = await shareNative({
        title: '每日心语',
        text: shareText,
      });
      if (success) return true;
    }
    
    return await shareToClipboard(shareText);
  }, [getRandomQuote, shareNative, shareToClipboard]);

  return {
    isSharing,
    getRandomQuote,
    generateStatsShareText,
    shareNative,
    shareToClipboard,
    shareMoodStats,
    shareQuote,
  };
}
