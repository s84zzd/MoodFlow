import { useState, useCallback } from 'react';
import type { Mood } from '@/types';
import type { MoodStats, MoodRecord } from '@/hooks/useMoodHistory';

export interface AIAdvice {
  id: string;
  title: string;
  content: string;
  category: 'immediate' | 'pattern' | 'lifestyle';
  moodId?: string;
}

// Simulated AI advice database based on mood patterns
const aiAdviceDatabase: Record<string, AIAdvice[]> = {
  anxiety: [
    {
      id: 'anxiety-1',
      title: ' grounding 技巧',
      content: '当你感到焦虑时，尝试「5-4-3-2-1」grounding 技巧：说出5样你看到的东西、4样你听到的声音、3样你能触摸到的质感、2样你闻到的气味、1样你尝到的味道。这能帮助你回到当下。',
      category: 'immediate',
      moodId: 'anxiety',
    },
    {
      id: 'anxiety-2',
      title: '焦虑的正面意义',
      content: '焦虑其实是大脑在试图保护你。试着对焦虑说：「谢谢你想要保护我，但我现在很安全。」这种接纳的态度往往能减轻焦虑的强度。',
      category: 'pattern',
      moodId: 'anxiety',
    },
    {
      id: 'anxiety-3',
      title: '建立「焦虑时间」',
      content: '每天设定15分钟的「焦虑时间」，在这个时间段内允许自己尽情担心。其他时间当焦虑出现时，告诉自己「我会留到焦虑时间再想」。这能帮助你重获掌控感。',
      category: 'lifestyle',
      moodId: 'anxiety',
    },
    {
      id: 'anxiety-4',
      title: '身体扫描放松',
      content: '从脚趾开始，逐步放松身体的每个部位：脚趾→脚掌→小腿→大腿→腹部→胸部→肩膀→手臂→面部。配合深呼吸，焦虑会随着身体的放松而减轻。',
      category: 'immediate',
      moodId: 'anxiety',
    },
    {
      id: 'anxiety-5',
      title: '焦虑日记',
      content: '记录每次焦虑的内容和结果。几周后回看，你会发现90%担心的事情都没有发生。这个数据会帮助你建立对焦虑的理性认知。',
      category: 'pattern',
      moodId: 'anxiety',
    },
    {
      id: 'anxiety-6',
      title: '规律运动习惯',
      content: '每周3次、每次30分钟的有氧运动（快走、慢跑、游泳）能显著降低焦虑水平。运动消耗压力激素，同时产生内啡肽，是天然的抗焦虑药。',
      category: 'lifestyle',
      moodId: 'anxiety',
    },
  ],
  melancholy: [
    {
      id: 'melancholy-1',
      title: '允许悲伤流动',
      content: '悲伤是一种自然的情绪，不需要急于摆脱。给自己设定一个「悲伤时间」，比如30分钟，在这段时间内允许自己充分感受悲伤，然后做一些自我关怀的事情。',
      category: 'immediate',
      moodId: 'melancholy',
    },
    {
      id: 'melancholy-2',
      title: '情绪与天气',
      content: '把情绪想象成天气：忧郁就像阴天或小雨，它不会永远持续。记录你的情绪模式，你会发现即使是忧郁的日子，也有阳光穿透云层的时刻。',
      category: 'pattern',
      moodId: 'melancholy',
    },
    {
      id: 'melancholy-3',
      title: '创造「愉悦清单」',
      content: '列出10件能让你感到一丝愉悦的小事（如泡杯热茶、听喜欢的歌、看窗外的风景）。当忧郁来袭时，选择其中一件去做，哪怕只是短暂的转移也是有益的。',
      category: 'lifestyle',
      moodId: 'melancholy',
    },
    {
      id: 'melancholy-4',
      title: '倾诉疗愈',
      content: '找一个信任的人倾诉，或者把感受写下来。表达本身就是疗愈的过程，把内心的沉重转化为语言，负担会减轻很多。',
      category: 'immediate',
      moodId: 'melancholy',
    },
    {
      id: 'melancholy-5',
      title: '忧郁的创造力',
      content: '历史上许多伟大的艺术作品都诞生于忧郁之中。试着把忧郁转化为创作：写日记、画画、听音乐。你的忧郁可能是创造力的源泉。',
      category: 'pattern',
      moodId: 'melancholy',
    },
    {
      id: 'melancholy-6',
      title: '光照疗法',
      content: '每天保证30分钟的户外光照，特别是早晨的阳光。光照能促进血清素分泌，改善情绪。如果天气不好，可以使用光疗灯。',
      category: 'lifestyle',
      moodId: 'melancholy',
    },
  ],
  happy: [
    {
      id: 'happy-1',
      title: ' savoring 技巧',
      content: '快乐时，试着「品味」这份感受：闭上眼睛，深呼吸，让快乐的感受在身体中扩散。研究表明， savoring 能延长积极情绪的持续时间。',
      category: 'immediate',
      moodId: 'happy',
    },
    {
      id: 'happy-2',
      title: '快乐的涟漪效应',
      content: '你的快乐不仅影响你自己，也会影响周围的人。分享你的快乐，无论是通过微笑、赞美还是帮助他人，都会让快乐倍增。',
      category: 'pattern',
      moodId: 'happy',
    },
    {
      id: 'happy-3',
      title: '建立「快乐银行」',
      content: '创建一个「快乐银行」，每天存入至少一件让你开心的小事。当情绪低落时，你可以从这个「银行」中提取快乐回忆。',
      category: 'lifestyle',
      moodId: 'happy',
    },
    {
      id: 'happy-4',
      title: '庆祝小胜利',
      content: '不要只庆祝大成就，为每一个小进步鼓掌：完成了一项任务、学会了新技能、帮助了他人。小胜利的积累会带来持久的幸福感。',
      category: 'immediate',
      moodId: 'happy',
    },
    {
      id: 'happy-5',
      title: '快乐的习惯',
      content: '研究发现，约50%的快乐来自基因，10%来自环境，40%来自我们的选择和习惯。主动选择快乐的活动，培养快乐的习惯。',
      category: 'pattern',
      moodId: 'happy',
    },
    {
      id: 'happy-6',
      title: '社交连接',
      content: '哈佛大学的研究表明，良好的人际关系是幸福的最重要预测因子。定期与亲友聚会，建立深层的社交连接，这是快乐的长效投资。',
      category: 'lifestyle',
      moodId: 'happy',
    },
  ],
  calm: [
    {
      id: 'calm-1',
      title: '深化平静',
      content: '平静是宝贵的状态。试着在这个时刻对自己说：「我允许自己享受这份宁静，我不需要做任何事，只需要存在。」',
      category: 'immediate',
      moodId: 'calm',
    },
    {
      id: 'calm-2',
      title: '平静的锚点',
      content: '注意是什么让你感到平静——是环境、活动还是某种想法？这些是你的「平静锚点」，可以在未来情绪波动时帮助你找回平静。',
      category: 'pattern',
      moodId: 'calm',
    },
    {
      id: 'calm-3',
      title: '每日平静仪式',
      content: '建立一个每日平静仪式：可能是早晨的5分钟冥想、午后的茶歇时光，或睡前的放松练习。让平静成为生活的常态。',
      category: 'lifestyle',
      moodId: 'calm',
    },
    {
      id: 'calm-4',
      title: '正念呼吸',
      content: '专注于呼吸的进出，感受空气流过鼻腔的温度变化。当思绪飘走时，温柔地把注意力带回到呼吸。这是回到当下的快速通道。',
      category: 'immediate',
      moodId: 'calm',
    },
    {
      id: 'calm-5',
      title: '平静的力量',
      content: '平静不是没有波澜，而是学会在波澜中保持中心。就像台风眼，外界再混乱，中心依然宁静。培养这种内在的稳定性。',
      category: 'pattern',
      moodId: 'calm',
    },
    {
      id: 'calm-6',
      title: '数字排毒',
      content: '每天设定1小时的「无屏幕时间」：不看手机、不刷社交媒体。让大脑从信息过载中解脱，回归内在的宁静。',
      category: 'lifestyle',
      moodId: 'calm',
    },
  ],
  stress: [
    {
      id: 'stress-1',
      title: '压力释放',
      content: '压力是身体在准备应对挑战。试着对身体说：「谢谢你为我做准备，但现在我可以放松了。」然后做几次深呼吸，释放紧绷的肌肉。',
      category: 'immediate',
      moodId: 'stress',
    },
    {
      id: 'stress-2',
      title: '压力的正面价值',
      content: '适度的压力实际上能提高表现（耶克斯-多德森定律）。关键是找到平衡点：足够的压力让你保持专注，但不过度压垮你。',
      category: 'pattern',
      moodId: 'stress',
    },
    {
      id: 'stress-3',
      title: '压力预防系统',
      content: '识别你的压力预警信号（如头痛、易怒、睡眠问题）。当这些信号出现时，立即启动「减压模式」：减少任务、增加休息、寻求支持。',
      category: 'lifestyle',
      moodId: 'stress',
    },
    {
      id: 'stress-4',
      title: '任务分解法',
      content: '当压力来自任务过多时，试试「番茄工作法」：25分钟专注一个任务，然后休息5分钟。小步前进比大步停滞更有效。',
      category: 'immediate',
      moodId: 'stress',
    },
    {
      id: 'stress-5',
      title: '压力与成长',
      content: '回想过去，你最自豪的成就往往伴随着压力。压力是成长的催化剂，它推动你走出舒适区，发现新的可能。',
      category: 'pattern',
      moodId: 'stress',
    },
    {
      id: 'stress-6',
      title: '建立支持网络',
      content: '不要独自承担所有压力。建立一个「支持清单」：列出3-5个你可以在困难时求助的人。知道有人支持你，压力会减轻很多。',
      category: 'lifestyle',
      moodId: 'stress',
    },
  ],
  // 懊悔 - 新增
  regret: [
    {
      id: 'regret-1',
      title: '与过去和解',
      content: '懊悔说明你有一颗在乎的心。试着对自己说：「那时的我已经尽力了，带着当时的认知和资源，我做了最好的选择。」',
      category: 'immediate',
      moodId: 'regret',
    },
    {
      id: 'regret-2',
      title: '懊悔的功课',
      content: '每一次懊悔都是一次学习的机会。问自己：「如果重来一次，我会怎么做？」然后把答案写下来，这是给未来的自己的礼物。',
      category: 'pattern',
      moodId: 'regret',
    },
    {
      id: 'regret-3',
      title: '原谅练习',
      content: '每天对着镜子说：「我原谅自己，我接纳自己，我在成长。」自我原谅不是放纵，而是给自己重新出发的力量。',
      category: 'lifestyle',
      moodId: 'regret',
    },
    {
      id: 'regret-4',
      title: '转换视角',
      content: '想象10年后的自己回看现在，会对今天的你说什么？通常我们会发现，现在纠结的事，在时间的长河中并没有那么重要。',
      category: 'immediate',
      moodId: 'regret',
    },
    {
      id: 'regret-5',
      title: '行动疗愈',
      content: '如果可能，为过去的事做一次弥补：道歉、改正、或只是承认错误。行动是化解懊悔最有效的方式，哪怕只是一小步。',
      category: 'pattern',
      moodId: 'regret',
    },
    {
      id: 'regret-6',
      title: '珍惜当下',
      content: '懊悔让我们忽视现在。建立一个「当下感恩」习惯：每天记录3件今天做得好的小事，把注意力从过去拉回到现在。',
      category: 'lifestyle',
      moodId: 'regret',
    },
  ],
  // 期待 - 新增
  anticipation: [
    {
      id: 'anticipation-1',
      title: '享受期待本身',
      content: '研究表明，期待某件事的过程往往比事情本身更让人快乐。深呼吸，细细品味这份美好的不确定性。',
      category: 'immediate',
      moodId: 'anticipation',
    },
    {
      id: 'anticipation-2',
      title: '期待的双面性',
      content: '期待带来动力，但也可能带来焦虑。觉察你的期待是否变成了执念。健康的期待是开放的：「我希望它发生，但我也接受其他可能。」',
      category: 'pattern',
      moodId: 'anticipation',
    },
    {
      id: 'anticipation-3',
      title: '可视化练习',
      content: '每天花5分钟想象期待的事情已经实现：看到什么、听到什么、感受到什么。可视化能增强动力，也能让大脑提前适应成功。',
      category: 'lifestyle',
      moodId: 'anticipation',
    },
    {
      id: 'anticipation-4',
      title: '准备计划',
      content: '期待最好的结果，但为可能的情况做准备。列一个「如果-那么」清单：如果A发生，我怎么做；如果B发生，我怎么做。',
      category: 'immediate',
      moodId: 'anticipation',
    },
    {
      id: 'anticipation-5',
      title: '期待与耐心',
      content: '好东西值得等待。把期待看作一场马拉松而不是短跑，每一次等待都是在锻炼你的耐心肌肉。',
      category: 'pattern',
      moodId: 'anticipation',
    },
    {
      id: 'anticipation-6',
      title: '小期待日常',
      content: '不要只期待大事，培养对小事情的期待：明天的早餐、周末的电影、朋友的电话。让生活充满小确幸的期待。',
      category: 'lifestyle',
      moodId: 'anticipation',
    },
  ],
  // 满足 - 新增
  content: [
    {
      id: 'content-1',
      title: '停留此刻',
      content: '满足是一种珍贵的状态，不需要急于追求下一个目标。闭上眼睛，深呼吸，让满足感渗透进每一个细胞。',
      category: 'immediate',
      moodId: 'content',
    },
    {
      id: 'content-2',
      title: '满足的智慧',
      content: '满足不等于停滞不前，而是懂得欣赏已经拥有的。就像登山者回望来时的路，满足让我们看到已经走过的距离。',
      category: 'pattern',
      moodId: 'content',
    },
    {
      id: 'content-3',
      title: '感恩日记',
      content: '每天记录3件让你感到满足的事，无论多小。持续的感恩练习能重塑大脑，让你更容易发现生活中的美好。',
      category: 'lifestyle',
      moodId: 'content',
    },
    {
      id: 'content-4',
      title: '分享满足',
      content: '满足感会传染。把你的满足分享给身边的人：告诉朋友你为什么开心，赞美家人的付出，传递这份温暖。',
      category: 'immediate',
      moodId: 'content',
    },
    {
      id: 'content-5',
      title: '足够的心态',
      content: '广告让我们永远觉得自己缺少什么，但满足告诉我们：「我已经足够了。」这种心态是抵御消费主义的最佳防线。',
      category: 'pattern',
      moodId: 'content',
    },
    {
      id: 'content-6',
      title: '知足常乐',
      content: '建立一个「足够清单」：列出你已经拥有的、让你感到幸福的东西。当你感到匮乏时，看看这个清单。',
      category: 'lifestyle',
      moodId: 'content',
    },
  ],
  // 怀疑 - 新增
  doubt: [
    {
      id: 'doubt-1',
      title: '怀疑暂停键',
      content: '当怀疑让你陷入分析瘫痪时，设定一个「决定截止时间」。告诉自己：「我会在今晚8点前做出选择，然后执行。」',
      category: 'immediate',
      moodId: 'doubt',
    },
    {
      id: 'doubt-2',
      title: '怀疑的价值',
      content: '怀疑是批判性思维的起点，它让你更谨慎、更全面地考虑问题。关键是不要让怀疑变成自我否定。',
      category: 'pattern',
      moodId: 'doubt',
    },
    {
      id: 'doubt-3',
      title: '信息收集期',
      content: '当怀疑源于信息不足时，设定一个「研究期限」。在这个期限内收集信息，期限到了就做决定，不再无限拖延。',
      category: 'lifestyle',
      moodId: 'doubt',
    },
    {
      id: 'doubt-4',
      title: '小步验证',
      content: '如果怀疑某个选择，先小规模测试。想换工作？先兼职试试；想搬家？先去住一周。用实践代替空想。',
      category: 'immediate',
      moodId: 'doubt',
    },
    {
      id: 'doubt-5',
      title: '区分怀疑与恐惧',
      content: '问自己：「我的怀疑是基于事实，还是基于恐惧？」事实需要分析，恐惧需要勇气。识别它们的区别，对症下药。',
      category: 'pattern',
      moodId: 'doubt',
    },
    {
      id: 'doubt-6',
      title: '信任练习',
      content: '怀疑往往源于不信任。每天练习一次「信任」：相信一个陌生人的善意、相信自己的直觉、相信事情会好起来。',
      category: 'lifestyle',
      moodId: 'doubt',
    },
  ],
  default: [
    {
      id: 'default-1',
      title: '情绪觉察',
      content: '无论你现在感受到什么情绪，都值得被关注和理解。情绪是内心的信使，试着倾听它想告诉你什么。',
      category: 'immediate',
    },
    {
      id: 'default-2',
      title: '情绪日记的价值',
      content: '持续记录情绪能帮助你发现模式和触发因素。随着时间的推移，你会更了解自己的情绪规律，从而更好地管理它们。',
      category: 'pattern',
    },
    {
      id: 'default-3',
      title: '自我关怀日常',
      content: '建立自我关怀的日常习惯：充足的睡眠、健康的饮食、适度的运动、与亲友的联系。这些是你的情绪健康基础。',
      category: 'lifestyle',
    },
  ],
};

// 情绪趋势类型
type Trend = 'improving' | 'worsening' | 'stable' | 'mixed';

// 记录最近推荐的建议ID（避免重复）
const recentAdviceIds: string[] = [];
const MAX_RECENT_MEMORY = 3;

// 负面情绪列表
const negativeMoods = ['anxiety', 'melancholy', 'regret', 'stress', 'doubt'];
const positiveMoods = ['happy', 'calm', 'content', 'anticipation'];

export function useAIAdvice() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAdvice, setCurrentAdvice] = useState<AIAdvice | null>(null);

  // 分析情绪趋势
  const analyzeTrend = useCallback((records: MoodRecord[]): Trend => {
    if (records.length < 3) return 'stable';
    
    const recent3 = records.slice(0, 3).map(r => r.moodId);
    const negativeCount = recent3.filter(m => negativeMoods.includes(m)).length;
    const positiveCount = recent3.filter(m => positiveMoods.includes(m)).length;
    
    if (negativeCount >= 2) return 'worsening';
    if (positiveCount >= 2) return 'improving';
    if (negativeCount === 1 && positiveCount === 1) return 'mixed';
    return 'stable';
  }, []);

  // 检查连续负面情绪
  const checkNegativeStreak = useCallback((records: MoodRecord[]): boolean => {
    const recent3 = records.slice(0, 3);
    if (recent3.length === 3 && recent3.every(r => negativeMoods.includes(r.moodId))) {
      return true;
    }
    return false;
  }, []);

  // 根据类别选择建议（避免重复）
  const selectByCategory = useCallback(
    (moodAdvice: AIAdvice[], category: string, excludeIds: string[]): AIAdvice | null => {
      const available = moodAdvice.filter(
        a => a.category === category && !excludeIds.includes(a.id)
      );
      
      if (available.length > 0) {
        return available[Math.floor(Math.random() * available.length)];
      }
      
      // 如果目标类别都推荐过了，从其他类别中选择
      const otherAvailable = moodAdvice.filter(a => !excludeIds.includes(a.id));
      if (otherAvailable.length > 0) {
        return otherAvailable[Math.floor(Math.random() * otherAvailable.length)];
      }
      
      return null;
    },
  []);

  // 智能选择建议
  const selectSmartAdvice = useCallback(
    (moodAdvice: AIAdvice[], trend: Trend, hasNegativeStreak: boolean): AIAdvice => {
      // 策略4: 连续负面情绪预警 - 优先即时缓解
      if (hasNegativeStreak) {
        const advice = selectByCategory(moodAdvice, 'immediate', recentAdviceIds);
        if (advice) return advice;
      }
      
      // 策略1: 基于情绪趋势选择
      const trendCategoryMap: Record<Trend, string> = {
        improving: 'pattern',    // 改善中: 强化积极模式
        worsening: 'immediate',  // 恶化中: 即时缓解
        stable: 'lifestyle',     // 稳定: 维持习惯
        mixed: 'pattern',        // 混合: 帮助理解
      };
      
      const targetCategory = trendCategoryMap[trend];
      let advice = selectByCategory(moodAdvice, targetCategory, recentAdviceIds);
      
      // 策略2: 避免重复 - 如果目标类别都推荐过了，尝试其他类别
      if (!advice) {
        // 尝试其他类别，按优先级
        const otherCategories = ['immediate', 'pattern', 'lifestyle'].filter(c => c !== targetCategory);
        for (const category of otherCategories) {
          advice = selectByCategory(moodAdvice, category, recentAdviceIds);
          if (advice) break;
        }
      }
      
      // 如果所有类别都过滤掉了（说明最近推荐了很多），选择最近推荐中最老的一条
      if (!advice && recentAdviceIds.length > 0) {
        // 移除最老的记录，释放一个选择
        recentAdviceIds.shift();
        // 重新尝试选择
        advice = selectByCategory(moodAdvice, targetCategory, recentAdviceIds);
        if (!advice) {
          // 如果还是选不到，从所有建议中排除剩余的最近记录
          const available = moodAdvice.filter(a => !recentAdviceIds.includes(a.id));
          if (available.length > 0) {
            advice = available[Math.floor(Math.random() * available.length)];
          }
        }
      }
      
      // 最后的保底：随机选择（理论上不会走到这里）
      if (!advice) {
        advice = moodAdvice[Math.floor(Math.random() * moodAdvice.length)];
      }
      
      return advice;
    },
    [selectByCategory]
  );

  // 更新推荐历史
  const updateAdviceHistory = useCallback((adviceId: string) => {
    recentAdviceIds.push(adviceId);
    if (recentAdviceIds.length > MAX_RECENT_MEMORY) {
      recentAdviceIds.shift();
    }
  }, []);

  // Generate advice based on current mood and historical patterns
  const generateAdvice = useCallback(async (
    currentMood?: Mood | null,
    stats?: MoodStats,
    recentRecords?: MoodRecord[]
  ): Promise<AIAdvice> => {
    setIsGenerating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let advice: AIAdvice;
    
    // Get advice based on current mood
    if (currentMood && aiAdviceDatabase[currentMood.id]) {
      const moodAdvice = aiAdviceDatabase[currentMood.id];
      
      // 新用户（记录少于3条）：给第一条即时建议
      if (!stats || stats.totalRecords < 3) {
        advice = moodAdvice[0];
      } else {
        // 智能推荐
        const trend = analyzeTrend(recentRecords || []);
        const hasNegativeStreak = checkNegativeStreak(recentRecords || []);
        advice = selectSmartAdvice(moodAdvice, trend, hasNegativeStreak);
      }
    } else {
      // Default advice
      const defaultAdvice = aiAdviceDatabase.default;
      advice = defaultAdvice[Math.floor(Math.random() * defaultAdvice.length)];
    }
    
    // 记录本次推荐
    updateAdviceHistory(advice.id);
    
    setCurrentAdvice(advice);
    setIsGenerating(false);
    
    return advice;
  }, [analyzeTrend, checkNegativeStreak, selectSmartAdvice, updateAdviceHistory]);

  // Get personalized insights based on mood patterns
  const getPersonalizedInsights = useCallback((stats: MoodStats, recentRecords?: MoodRecord[]): string[] => {
    const insights: string[] = [];
    
    if (stats.totalRecords < 3) {
      insights.push('继续记录情绪，我会更了解你的情绪模式 ✨');
      return insights;
    }
    
    // Analyze mood distribution
    const moodEntries = Object.entries(stats.moodDistribution);
    const totalMoods = moodEntries.reduce((sum, [, count]) => sum + count, 0);
    
    // Find dominant mood
    const dominantMood = moodEntries.sort((a, b) => b[1] - a[1])[0];
    if (dominantMood) {
      const percentage = Math.round((dominantMood[1] / totalMoods) * 100);
      insights.push(`你最近${percentage}%的时间感受到${dominantMood[0]}，这是你的主要情绪状态`);
    }
    
    // Check for mood variety
    if (moodEntries.length >= 5) {
      insights.push('你的情绪体验很丰富，这说明你对内心世界的觉察很敏锐 🌈');
    } else if (moodEntries.length <= 2) {
      insights.push('试着关注更多不同的情绪，它们都是内心世界的色彩 🎨');
    }
    
    // Check streak
    if (stats.streakDays >= 7) {
      insights.push(`连续打卡${stats.streakDays}天！坚持记录是自我关怀的好习惯 🔥`);
    }
    
    // Check for negative emotions pattern
    const negativeMoodNames = ['焦虑', '忧郁', '懊悔', '压力', '怀疑'];
    const negativeCount = moodEntries
      .filter(([mood]) => negativeMoodNames.includes(mood))
      .reduce((sum, [, count]) => sum + count, 0);
    
    if (negativeCount / totalMoods > 0.6) {
      insights.push('最近负面情绪较多，记得给自己更多关爱和休息 💝');
    } else if (negativeCount / totalMoods < 0.3) {
      insights.push('你的情绪状态很积极，继续保持这份内心的平衡 🌟');
    }
    
    // 策略4: 连续负面情绪预警
    if (recentRecords && recentRecords.length >= 3) {
      const hasNegativeStreak = checkNegativeStreak(recentRecords);
      if (hasNegativeStreak) {
        insights.push('⚠️ 注意到你最近连续情绪低落，试试文中的即时缓解技巧，或和信任的人聊聊');
      }
      
      // 添加趋势洞察
      const trend = analyzeTrend(recentRecords);
      const trendMessages: Record<Trend, string> = {
        improving: '📈 你的情绪正在好转，继续保持！',
        worsening: '📉 最近情绪有些波动，记得对自己温柔一点',
        stable: '➡️ 你的情绪状态比较稳定',
        mixed: '🔄 情绪有起有落是正常的，接纳这种变化',
      };
      insights.push(trendMessages[trend]);
    }
    
    return insights;
  }, [analyzeTrend, checkNegativeStreak]);

  // Clear current advice
  const clearAdvice = useCallback(() => {
    setCurrentAdvice(null);
  }, []);

  return {
    isGenerating,
    currentAdvice,
    generateAdvice,
    getPersonalizedInsights,
    clearAdvice,
  };
}
