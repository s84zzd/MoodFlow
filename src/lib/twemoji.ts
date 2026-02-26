/**
 * Twemoji 工具函数
 * 将原生 emoji 转换为统一的 Twemoji 图片 URL
 * 解决 html2canvas 在不同设备上渲染 emoji 不一致的问题
 */

/**
 * 将 emoji 转换为 Unicode 码点（用于 Twemoji CDN URL）
 */
export function emojiToCodePoint(emoji: string): string {
  const codePoints: string[] = [];
  
  for (const char of emoji) {
    const codePoint = char.codePointAt(0);
    if (codePoint !== undefined) {
      // 跳过变体选择器 (FE0F)
      if (codePoint !== 0xfe0f) {
        codePoints.push(codePoint.toString(16));
      }
    }
  }
  
  return codePoints.join('-');
}

/**
 * 获取 Twemoji SVG 图片 URL
 * 使用 jsDelivr CDN 提供的 Twemoji 资源
 */
export function getTwemojiUrl(emoji: string): string {
  const codePoint = emojiToCodePoint(emoji);
  // 使用 jsDelivr CDN 的 Twemoji SVG
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${codePoint}.svg`;
}

/**
 * 预定义的情绪 emoji 到 Twemoji URL 的映射
 * 避免每次都计算，提高性能
 */
export const moodTwemojiMap: Record<string, string> = {
  '😰': getTwemojiUrl('😰'), // 焦虑
  '😔': getTwemojiUrl('😔'), // 忧郁
  '😊': getTwemojiUrl('😊'), // 快乐/满足
  '😞': getTwemojiUrl('😞'), // 懊悔
  '😌': getTwemojiUrl('😌'), // 平静
  '🤩': getTwemojiUrl('🤩'), // 期待
  '🤔': getTwemojiUrl('🤔'), // 怀疑
  '😫': getTwemojiUrl('😫'), // 压力
};
