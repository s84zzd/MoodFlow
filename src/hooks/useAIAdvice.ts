import { useState, useCallback } from 'react';
import type { Mood } from '@/types';
import type { MoodStats, MoodRecord } from '@/hooks/useMoodHistory';
import { generateAIAdviceWithDeepSeek, isAIServiceAvailable } from '@/services/aiService';

export interface AIAdvice {
  id: string;
  title: string;
  content: string;
  category: 'cognition' | 'acceptance' | 'reframe' | 'support';
  moodId?: string;
  isAIGenerated?: boolean;
}

// AI建议每日限制
const MAX_DAILY_AI_ADVICE = 8;
const DAILY_ADVICE_COUNT_KEY = 'moodflow_daily_advice_count';
const DAILY_ADVICE_DATE_KEY = 'moodflow_daily_advice_date';
const ENABLE_AI_ADVICE_LIMIT = import.meta.env.VITE_ENABLE_AI_ADVICE_LIMIT === 'true';

// 情绪导向建议库（9种情绪 × 8条建议 = 72条）
// 核心目标：提高情绪认知、提供心理安抚和支持
const emotionBasedAdviceDatabase: Record<string, AIAdvice[]> = {
  // 焦虑 (Anxiety) - 8条
  anxiety: [
    { id: 'anxiety-1', title: '焦虑是保护机制', content: '焦虑是大脑的预警系统，提醒你关注潜在风险。它不是敌人，而是想保护你的朋友。当你理解它的善意，就能更平和地与它相处。', category: 'cognition' },
    { id: 'anxiety-2', title: '焦虑源于不确定', content: '焦虑往往源于对未来的不确定感。你可能在担心"如果...会怎样"。记住：大多数担心的事情不会发生，即使发生，你也比想象中更有能力应对。', category: 'cognition' },
    { id: 'anxiety-3', title: '允许自己焦虑', content: '感到焦虑很正常，不需要为此责怪自己。每个人都会焦虑，这是人类的基本情绪。试着对自己说："我现在有点焦虑，这没关系，它会过去的。"', category: 'acceptance' },
    { id: 'anxiety-4', title: '你不需要完美', content: '焦虑常常伴随着对自己过高的期待。提醒自己：你不需要在每件事上都表现完美。允许自己有瑕疵，允许自己不那么强大，这是自我疼惜的开始。', category: 'acceptance' },
    { id: 'anxiety-5', title: '区分事实与想象', content: '焦虑会让我们把想象当成事实。问问自己：这个担心是基于确凿的事实，还是我的想象？很多时候，我们焦虑的不是现实，而是脑海中的"如果"。', category: 'reframe' },
    { id: 'anxiety-6', title: '专注可控的部分', content: '焦虑常让人想控制一切。但有些事情本就不在我们控制范围内。试着把注意力放在你能控制的部分：此刻的行动、当下的选择、自己的态度。', category: 'reframe' },
    { id: 'anxiety-7', title: '你比想象中坚强', content: '回想过去你克服的困难，每一次你都挺过来了。焦虑会让你忘记自己的力量，但事实是：你比焦虑更强大，你有能力度过这一刻。', category: 'support' },
    { id: 'anxiety-8', title: '此刻你是安全的', content: '当焦虑席卷而来，提醒自己：此时此刻，我是安全的。环顾四周，感受脚踏实地，你现在所在的地方是安全的。深呼吸，让身体相信这份安全感。', category: 'support' },
  ],
  
  // 忧郁 (Melancholy) - 8条
  melancholy: [
    { id: 'melancholy-1', title: '忧郁的意义', content: '忧郁不是软弱，而是深度感受的证明。它说明你有一颗敏感而细腻的心，能够体察到生活的复杂和细微。这种深度是一份礼物，尽管有时会感到沉重。', category: 'cognition' },
    { id: 'melancholy-2', title: '情绪的潮汐', content: '情绪就像潮水，有涨有落。忧郁是低潮期，它不会永远持续。记住：每一次低潮后都会有涨潮，这是自然的规律，也是情绪的规律。', category: 'cognition' },
    { id: 'melancholy-3', title: '允许悲伤存在', content: '你不需要强迫自己快乐起来。悲伤和忧郁是正当的情绪，它们有权利存在。试着对自己说："我允许自己感到忧郁，这是我此刻真实的状态。"', category: 'acceptance' },
    { id: 'melancholy-4', title: '放下苛责', content: '忧郁时我们容易自责："我为什么这么脆弱？"但请记住：感受情绪不是脆弱，压抑情绪才是。给自己一些温柔，你已经足够勇敢了。', category: 'acceptance' },
    { id: 'melancholy-5', title: '寻找微光', content: '即使在最忧郁的时刻，生活中也有微小的美好：一杯热茶的温度、窗外的阳光、喜欢的歌曲。试着留意这些微光，它们是穿透云层的希望。', category: 'reframe' },
    { id: 'melancholy-6', title: '今天不代表明天', content: '忧郁会让我们觉得"永远都会这样"。但事实是：今天的感受不代表明天。天气会变，季节会换，你的心情也会。给明天一个机会。', category: 'reframe' },
    { id: 'melancholy-7', title: '你不孤单', content: '世界上有无数人此刻也在感受着忧郁，包括那些看起来很坚强的人。你不是唯一一个，你不孤单。如果需要，请向身边的人伸出手。', category: 'support' },
    { id: 'melancholy-8', title: '温柔陪伴自己', content: '想象你最好的朋友正在经历这种忧郁，你会对TA说什么？现在，请用同样温柔的话语对待自己。你值得被温柔以待，包括被自己。', category: 'support' },
  ],
  
  // 快乐 (Happy) - 8条
  happy: [
    { id: 'happy-1', title: '快乐是礼物', content: '快乐不是理所当然的，它是生活送给你的礼物。花一点时间觉察这份快乐：它从哪里来？是什么让你微笑？珍惜它，记住它。', category: 'cognition' },
    { id: 'happy-2', title: '品味快乐', content: '快乐往往转瞬即逝，因为我们急于追逐下一个目标。试着放慢脚步，深呼吸，让这份快乐在心中多停留一会儿。这是你应得的美好时光。', category: 'cognition' },
    { id: 'happy-3', title: '你值得快乐', content: '有些人在快乐时会感到愧疚，觉得"我不配这么开心"。但请记住：你值得快乐，你值得美好，你值得生活中的每一个笑容。', category: 'acceptance' },
    { id: 'happy-4', title: '快乐无需理由', content: '你不需要为快乐找理由或证明自己值得快乐。快乐本身就是足够的，它不需要被证明或解释。允许自己单纯地享受这份感受。', category: 'acceptance' },
    { id: 'happy-5', title: '分享快乐', content: '快乐有一个神奇的特质：分享出去不会减少，反而会加倍。把你的快乐传递给身边的人，一个微笑、一句赞美、一个拥抱。', category: 'reframe' },
    { id: 'happy-6', title: '快乐是选择', content: '研究表明，约40%的快乐来自我们主动的选择和习惯。这意味着你有能力创造更多快乐，通过你的态度、行动和关注点。', category: 'reframe' },
    { id: 'happy-7', title: '记录快乐时刻', content: '把这一刻记录下来：写在日记里、拍张照片、或只是在心中留个记号。当未来感到低落时，这些记忆会成为你的情绪储备。', category: 'support' },
    { id: 'happy-8', title: '快乐会回来', content: '即使快乐现在离开，它也会再回来。就像季节轮转，快乐也会循环往复。珍惜当下，但也不必过度执着，相信它会再次到来。', category: 'support' },
  ],
  
  // 懊悔 (Regret) - 8条
  regret: [
    { id: 'regret-1', title: '懊悔说明成长', content: '你感到懊悔，是因为现在的你比过去更成熟、更有智慧。懊悔不是失败的证明，而是成长的标志。它说明你在进步。', category: 'cognition' },
    { id: 'regret-2', title: '过去的最优解', content: '回望过去时，要记住：那时的你已经尽力了。用现在的认知评判过去的选择是不公平的。你带着当时的资源和理解，做出了那时最好的选择。', category: 'cognition' },
    { id: 'regret-3', title: '原谅自己', content: '原谅不是忘记或纵容，而是放下沉重的负担。试着对自己说："我原谅那时的自己，我接纳那个不完美的我。"这是给自己的礼物。', category: 'acceptance' },
    { id: 'regret-4', title: '没有人完美', content: '每个人都有懊悔的事，这是人生的一部分。完美的人不存在，完美的决定也不存在。你的懊悔让你更人性化，更真实。', category: 'acceptance' },
    { id: 'regret-5', title: '从懊悔中学习', content: '把懊悔转化为智慧：如果重来一次，你会怎么做？把答案记录下来，这是未来的自己的指南。懊悔可以成为成长的养分。', category: 'reframe' },
    { id: 'regret-6', title: '活在当下', content: '懊悔让我们困在过去，但生活在当下。每一次呼吸都是新的开始，每一刻都是重新选择的机会。过去不能改变，但现在可以。', category: 'reframe' },
    { id: 'regret-7', title: '时间会疗愈', content: '现在刺痛的懊悔，随着时间推移会慢慢变淡。相信时间的力量，也相信自己的韧性。你有能力走过这段艰难的时光。', category: 'support' },
    { id: 'regret-8', title: '你还有未来', content: '懊悔是关于过去的，但你的人生还有很长的未来。不要让过去定义你的未来。你还有无数次机会做得更好、选择更好。', category: 'support' },
  ],
  
  // 平静 (Calm) - 8条
  calm: [
    { id: 'calm-1', title: '平静的珍贵', content: '在这个快节奏的世界里，平静是稀缺而宝贵的。此刻的你正处在一个难得的状态，好好享受这份宁静，让它滋养你的心灵。', category: 'cognition' },
    { id: 'calm-2', title: '平静的力量', content: '平静不是软弱或消极，而是一种强大的力量。在平静中，你能看得更清楚、想得更深入、做出更明智的决定。这是你的超能力。', category: 'cognition' },
    { id: 'calm-3', title: '允许平静存在', content: '有些人在平静时会感到不安，觉得"应该做点什么"。但其实，平静本身就足够好。允许自己什么都不做，只是存在。', category: 'acceptance' },
    { id: 'calm-4', title: '平静不等于停滞', content: '平静不是停止前进，而是在前进中保持内在的稳定。就像水面平静的湖水，深处依然在流动。平静让你以更好的状态前行。', category: 'acceptance' },
    { id: 'calm-5', title: '找到平静锚点', content: '留意是什么带来了这份平静：环境、活动、还是某种想法？这些是你的"平静锚点"，记住它们，未来需要时可以回到这里。', category: 'reframe' },
    { id: 'calm-6', title: '平静是可习得的', content: '平静不只是运气，它是可以培养的技能。通过正念练习、深呼吸、冥想，你可以训练自己更容易进入平静状态。', category: 'reframe' },
    { id: 'calm-7', title: '分享平静能量', content: '平静会传染。你的平静能影响周围的人，让他们也感到安宁。在这个焦虑的时代，你的平静是送给世界的礼物。', category: 'support' },
    { id: 'calm-8', title: '储存平静能量', content: '把这份平静储存在心里，像充电一样。当未来遇到风浪时，你可以回想这一刻，提醒自己：我知道平静的感觉，我可以再次找到它。', category: 'support' },
  ],
  
  // 期待 (Anticipation) - 8条
  anticipation: [
    { id: 'anticipation-1', title: '期待的喜悦', content: '研究发现，期待某件事的过程往往比事情本身更让人快乐。你正处在这个美好的阶段，好好享受这份充满可能性的感受。', category: 'cognition' },
    { id: 'anticipation-2', title: '不确定的美', content: '期待之所以美好，正是因为结果还未知。这份不确定性让生活充满悬念和惊喜。拥抱这份未知，它是冒险的开始。', category: 'cognition' },
    { id: 'anticipation-3', title: '期待是正常的', content: '对未来充满期待是人之常情，不需要为此感到不踏实。期待给我们动力，让我们对未来保持热情。这是健康而积极的情绪。', category: 'acceptance' },
    { id: 'anticipation-4', title: '平衡期待与现实', content: '期待时也要保持弹性。最健康的期待是："我希望它发生，但我也能接受其他可能。"这样无论结果如何，你都不会太失望。', category: 'acceptance' },
    { id: 'anticipation-5', title: '准备而不焦虑', content: '期待不等于焦虑。你可以为未来做准备，但不必过度担忧。问自己：我能做些什么准备？做完这些，剩下的就交给时间。', category: 'reframe' },
    { id: 'anticipation-6', title: '享受过程', content: '通往目标的路途也是旅程的一部分。不要只盯着终点，看看沿途的风景。每一步都值得被珍惜，每一刻都是经历。', category: 'reframe' },
    { id: 'anticipation-7', title: '保持耐心', content: '好的东西值得等待。期待教会我们耐心，锻炼我们延迟满足的能力。这是一份重要的人生功课，你正在学习它。', category: 'support' },
    { id: 'anticipation-8', title: '相信美好', content: '你的期待说明你相信未来会有美好的事情发生。这份信念很珍贵，请好好保护它。即使有时会失望，也不要失去相信美好的能力。', category: 'support' },
  ],
  
  // 满足 (Content) - 8条
  content: [
    { id: 'content-1', title: '满足是智慧', content: '在一个不断追求"更多"的时代，能感到满足是一种智慧。你懂得欣赏已经拥有的，这让你比大多数人更富有。', category: 'cognition' },
    { id: 'content-2', title: '足够的魔法', content: '满足告诉你："我已经足够了。"这不是停止成长，而是不再被匮乏感驱使。你可以从内在的充足出发，而不是从恐惧出发。', category: 'cognition' },
    { id: 'content-3', title: '珍惜这一刻', content: '满足是稀有的情绪，请好好珍惜。深呼吸，让这份感觉渗透进每一个细胞。记住此刻的感受，它是你情绪世界的宝藏。', category: 'acceptance' },
    { id: 'content-4', title: '满足不是终点', content: '满足不意味着不再追求，而是在追求的路上保持内在的充实。你可以同时满足于现状，又向往更好的未来。', category: 'acceptance' },
    { id: 'content-5', title: '感恩的力量', content: '满足常常伴随着感恩。留意你此刻感激的事物，无论大小。感恩能重塑大脑，让你更容易感受到满足和幸福。', category: 'reframe' },
    { id: 'content-6', title: '抵御匮乏感', content: '广告和社交媒体总在告诉我们"还不够"。但你的满足是对这种声音的回应："我已经拥有的就很好。"这是一种勇气。', category: 'reframe' },
    { id: 'content-7', title: '分享你的满足', content: '满足感是会传染的。分享你对生活的满意，不是炫耀，而是提醒别人：幸福不需要等到"某一天"，它可以是现在。', category: 'support' },
    { id: 'content-8', title: '建立满足清单', content: '记录下让你感到满足的事物，无论多小：一杯热茶、一通电话、一个拥抱。这个清单是你的情绪锚点，需要时可以回看。', category: 'support' },
  ],
  
  // 怀疑 (Doubt) - 8条
  doubt: [
    { id: 'doubt-1', title: '怀疑是理性的开始', content: '怀疑不是软弱，而是批判性思维的起点。你不盲目相信，而是认真思考，这是理性和成熟的表现。', category: 'cognition' },
    { id: 'doubt-2', title: '不确定也正常', content: '在这个充满不确定性的世界里，怀疑是正常的。你不需要对每件事都有答案，不确定本身也是一种诚实的状态。', category: 'cognition' },
    { id: 'doubt-3', title: '允许自己犹豫', content: '不是每个决定都需要立刻做出。允许自己有犹豫的空间，给自己时间思考。匆忙的决定往往不是好决定。', category: 'acceptance' },
    { id: 'doubt-4', title: '完美的选择不存在', content: '你可能在寻找"完美的答案"，但往往不存在绝对完美的选择。每个选择都有利弊，关键是找到对你而言足够好的那个。', category: 'acceptance' },
    { id: 'doubt-5', title: '区分怀疑与恐惧', content: '问自己：我的怀疑基于事实还是恐惧？事实需要分析，恐惧需要勇气。识别它们的区别，然后对症下药。', category: 'reframe' },
    { id: 'doubt-6', title: '小步验证', content: '如果不确定某个选择，试着小规模测试。不必一步到位，先迈出小小的一步，看看感觉如何。用实践代替空想。', category: 'reframe' },
    { id: 'doubt-7', title: '信任你的直觉', content: '除了理性分析，也要听听内心的声音。有时候，直觉会比头脑更快地知道答案。给直觉一个发言的机会。', category: 'support' },
    { id: 'doubt-8', title: '没有完美的时机', content: '你可能在等待"完美的时机"，但它很少会来。有时候，最好的策略就是：收集足够的信息，设定一个决定截止时间，然后行动。', category: 'support' },
  ],
  
  // 压力 (Stress) - 8条
  stress: [
    { id: 'stress-1', title: '压力是成长信号', content: '压力说明你正在挑战自己的舒适区，这是成长的必经之路。没有压力就没有突破，你正走在进步的路上。', category: 'cognition' },
    { id: 'stress-2', title: '适度压力提升表现', content: '研究表明，适度的压力能提高专注力和表现力（耶克斯-多德森定律）。你的压力可能是帮助你完成任务的动力。', category: 'cognition' },
    { id: 'stress-3', title: '承认压力的存在', content: '不要假装"我很好"。承认压力的存在不是软弱，而是自我觉察。只有承认它，你才能有效地应对它。', category: 'acceptance' },
    { id: 'stress-4', title: '你已经够努力了', content: '压力常让我们觉得"还不够努力"。但请停下来问自己：我真的不够努力吗？还是我已经尽力了？给自己应得的肯定。', category: 'acceptance' },
    { id: 'stress-5', title: '分解压力源', content: '把大的压力拆解成小的部分：哪些是你能控制的？哪些不能？专注于能控制的部分，对不能控制的部分学会放手。', category: 'reframe' },
    { id: 'stress-6', title: '压力是暂时的', content: '现在的压力感觉很大，但它不会永远持续。回想过去，每一次压力都过去了，每一次你都挺了过来。这次也一样。', category: 'reframe' },
    { id: 'stress-7', title: '寻求支持', content: '你不需要独自承担所有压力。向可信赖的人倾诉，寻求帮助不是软弱，而是智慧。我们都需要彼此的支持。', category: 'support' },
    { id: 'stress-8', title: '照顾好身体', content: '压力会消耗身体能量。确保基本的自我照顾：充足的睡眠、健康的饮食、适度的运动。身体状态好，应对压力的能力会更强。', category: 'support' },
  ],
};


// ===== 以下是旧的建议库，已被上面的情绪导向建议库取代，保留作为参考 =====
// 如果将来需要可以完全删除

// 情绪趋势类型（用于个性化洞察）
type Trend = 'improving' | 'worsening' | 'stable' | 'mixed';

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

  // 获取今日AI建议使用次数
  const getDailyAdviceCount = useCallback((): number => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem(DAILY_ADVICE_DATE_KEY);
    const savedCount = localStorage.getItem(DAILY_ADVICE_COUNT_KEY);
    
    if (savedDate !== today) {
      // 新的一天，重置计数
      localStorage.setItem(DAILY_ADVICE_DATE_KEY, today);
      localStorage.setItem(DAILY_ADVICE_COUNT_KEY, '0');
      return 0;
    }
    
    return parseInt(savedCount || '0', 10);
  }, []);

  // 增加今日AI建议使用次数
  const incrementDailyAdviceCount = useCallback(() => {
    const count = getDailyAdviceCount();
    localStorage.setItem(DAILY_ADVICE_COUNT_KEY, (count + 1).toString());
  }, [getDailyAdviceCount]);

  // 根据情绪获取本地建议（情绪导向）
  const getEmotionBasedAdvice = useCallback((moodId?: string, excludeId?: string): AIAdvice => {
    // 如果没有moodId，随机选择一个情绪
    const defaultMoodId = moodId || ['anxiety', 'melancholy', 'happy', 'calm', 'regret', 'anticipation', 'content', 'doubt', 'stress'][
      Math.floor(Math.random() * 9)
    ];
    
    let emotionAdvices = emotionBasedAdviceDatabase[defaultMoodId] || emotionBasedAdviceDatabase.anxiety;
    
    // 如果有排除ID，过滤掉当前正在显示的建议
    if (excludeId) {
      const filtered = emotionAdvices.filter((advice: AIAdvice) => advice.id !== excludeId);
      if (filtered.length > 0) {
        emotionAdvices = filtered;
      }
    }
    
    // 随机选择一条建议
    const randomIndex = Math.floor(Math.random() * emotionAdvices.length);
    
    return {
      ...emotionAdvices[randomIndex],
      id: `${emotionAdvices[randomIndex].id}-${Date.now()}`,
      moodId: defaultMoodId,
      isAIGenerated: false,
    };
  }, []);

  // 生成本地情绪化建议（不消耗AI额度）
  const generateLocalAdvice = useCallback(async (
    currentMood?: Mood | null,
    recentRecords?: MoodRecord[],
    excludeId?: string
  ): Promise<AIAdvice> => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 优先使用当前情绪，其次使用最近一条记录的情绪
    const moodId = currentMood?.id || recentRecords?.[0]?.moodId;
    // 提取原始ID（去除时间戳后缀）
    const originalExcludeId = excludeId?.split('-').slice(0, -1).join('-');
    const advice = getEmotionBasedAdvice(moodId, originalExcludeId);
    
    setCurrentAdvice(advice);
    setIsGenerating(false);
    
    return advice;
  }, [getEmotionBasedAdvice]);

  // 生成AI建议（消耗额度）
  const generateAIAdvice = useCallback(async (
    currentMood?: Mood | null,
    recentRecords?: MoodRecord[]
  ): Promise<AIAdvice | null> => {
    // 如果启用了限制，检查每日额度
    if (ENABLE_AI_ADVICE_LIMIT) {
      const dailyCount = getDailyAdviceCount();
      if (dailyCount >= MAX_DAILY_AI_ADVICE) {
        return null; // 额度已用完
      }
    }
    
    const aiAvailable = isAIServiceAvailable();
    if (!aiAvailable || !currentMood) {
      return null;
    }
    
    setIsGenerating(true);
    
    try {
      const aiAdvice = await generateAIAdviceWithDeepSeek({
        currentMood: currentMood.name,
        currentScene: recentRecords?.[0]?.sceneId || '未知场景',
        recentRecords: recentRecords || [],
      });
      
      if (aiAdvice) {
        // 如果启用了限制，增加使用次数
        if (ENABLE_AI_ADVICE_LIMIT) {
          incrementDailyAdviceCount();
        }
        setCurrentAdvice(aiAdvice);
        setIsGenerating(false);
        return aiAdvice;
      }
    } catch (error) {
      console.error('[useAIAdvice] AI service failed:', error);
    }
    
    setIsGenerating(false);
    return null;
  }, [getDailyAdviceCount, incrementDailyAdviceCount]);

  // 获取剩余AI建议次数
  const getRemainingAIAdviceCount = useCallback((): number => {
    // 如果未启用限制，返回无限额度
    if (!ENABLE_AI_ADVICE_LIMIT) {
      return 999; // 显示无限额度
    }
    const dailyCount = getDailyAdviceCount();
    return Math.max(0, MAX_DAILY_AI_ADVICE - dailyCount);
  }, [getDailyAdviceCount]);

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
    generateLocalAdvice,
    generateAIAdvice,
    getRemainingAIAdviceCount,
    getPersonalizedInsights,
    clearAdvice,
  };
}
