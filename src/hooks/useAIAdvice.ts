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

// 情绪导向建议库（36种情绪 × 2-8条建议）
// 核心目标：提高情绪认知、提供心理安抚和支持
const emotionBasedAdviceDatabase: Record<string, AIAdvice[]> = {
  // ===== 正面高能量区 (valence 6) =====
  
  // 宁静 (Serenity) - 4条
  serenity: [
    { id: 'serenity-1', title: '宁静是内心的财富', content: '在这个喧嚣的世界里，能拥有一份宁静是难得的财富。这份平和不是逃避，而是你内在力量的体现。珍惜它，让它滋养你的身心。', category: 'cognition' },
    { id: 'serenity-2', title: '宁静中的智慧', content: '当内心平静时，你能更清晰地听见自己的声音。这是思考、反思、与自己对话的最佳时刻。很多困惑的答案，往往在宁静中浮现。', category: 'cognition' },
    { id: 'serenity-3', title: '享受当下', content: '此刻的宁静是生活给你的礼物。不需要急着做什么，不需要想下一步。就让自己沉浸在这份安宁中，感受呼吸，感受存在。', category: 'acceptance' },
    { id: 'serenity-4', title: '宁静会再来', content: '如果这份宁静离开了，不要担心，它会再回来。你已经知道它的味道，你知道如何找到它。记住这种感觉，它是你的内在锚点。', category: 'support' },
  ],
  
  // 安心 (Relief) - 4条
  relief: [
    { id: 'relief-1', title: '安心源于信任', content: '感到安心说明你对周围的人或环境有信任感。这种信任是珍贵的，它让你能够放下戒备，真实地做自己。', category: 'cognition' },
    { id: 'relief-2', title: '被支持的力量', content: '当你感到被保护和支持时，你的内在会变得更有力量。这份安心感是安全的港湾，让你在风雨中有地方停靠。', category: 'cognition' },
    { id: 'relief-3', title: '珍惜这份安全感', content: '不是每个人都能经常感到安心。花一点时间感谢那些让你感到安全的人和事，这份感恩会让安心感更加稳固。', category: 'acceptance' },
    { id: 'relief-4', title: '传递安心', content: '你感受到的安心也可以传递给他人。当你内心安定时，你的存在本身就能给身边的人带来平静和信任。', category: 'support' },
  ],
  
  // 喜悦 (Delight) - 4条
  delight: [
    { id: 'delight-1', title: '喜悦是心灵的阳光', content: '这份喜悦比快乐更深层，它来自内心的满足和幸福。让它充分绽放，不要压抑或怀疑。你值得拥有这份美好。', category: 'cognition' },
    { id: 'delight-2', title: '品味喜悦', content: '喜悦往往稍纵即逝。试着放慢脚步，深呼吸，让这份喜悦渗透到每一个细胞。记住这种感觉，它是你生命中的高光时刻。', category: 'cognition' },
    { id: 'delight-3', title: '喜悦值得被分享', content: '喜悦有一个奇妙的特质：分享后不会减少，反而会加倍。把你的喜悦传递出去，一个微笑、一个拥抱、一句真诚的话。', category: 'reframe' },
    { id: 'delight-4', title: '创造更多喜悦', content: '记住是什么带来了这份喜悦。是某个人、某件事、还是某个时刻？这些是你的"喜悦密码"，未来可以再次创造。', category: 'support' },
  ],
  
  // 兴奋 (Excitement) - 4条
  excitement: [
    { id: 'excitement-1', title: '兴奋是能量的释放', content: '兴奋是高能量的积极情绪，说明你对某件事充满热情和期待。这份能量是珍贵的，好好利用它去创造、去行动。', category: 'cognition' },
    { id: 'excitement-2', title: '享受期待的过程', content: '研究表明，期待某件事的过程往往比事情本身更让人快乐。你正处在这个美好的阶段，享受这份充满可能性的感受。', category: 'cognition' },
    { id: 'excitement-3', title: '把兴奋转化为行动', content: '兴奋是最好的行动燃料。有什么是你一直想做但没做的？趁现在这股热情，迈出第一步吧。', category: 'reframe' },
    { id: 'excitement-4', title: '保持平衡', content: '兴奋时也要记得给自己留一点缓冲空间。高能量的状态很棒，但也要照顾身体，确保有足够的休息。', category: 'support' },
  ],
  
  // ===== 正面社会/认知区 (valence 5) =====
  
  // 珍爱 (Cherish) - 4条
  cherish: [
    { id: 'cherish-1', title: '珍爱是爱的表达', content: '能感到珍爱，说明你心中有深深在乎的人或事物。这种温柔的情感是爱的表达，它让你的生命更有意义。', category: 'cognition' },
    { id: 'cherish-2', title: '珍惜的力量', content: '珍爱让你懂得保护、呵护。这种情感让你成为一个更有温度的人，也让被珍爱的人或事物感受到价值。', category: 'cognition' },
    { id: 'cherish-3', title: '表达你的珍爱', content: '不要把这份珍爱藏在心里。告诉对方你有多在乎，用行动表达你的珍惜。爱需要表达，才能被真正感受到。', category: 'reframe' },
    { id: 'cherish-4', title: '珍爱也意味着放手', content: '有时候，最深的爱是允许对方自由。珍爱不是占有，而是希望对方好。这种成熟的爱会让关系更加健康长久。', category: 'support' },
  ],
  
  // 欣赏 (Appreciation) - 4条
  appreciation: [
    { id: 'appreciation-1', title: '欣赏是心灵的眼睛', content: '能看到美好并心生愉悦，这是一种能力。你的心灵有一双善于发现美的眼睛，这是幸福的重要来源。', category: 'cognition' },
    { id: 'appreciation-2', title: '欣赏创造积极能量', content: '当你欣赏某个人或事物时，你其实是在创造积极的能量。这份能量会回馈给你，让你自己也变得更美好。', category: 'cognition' },
    { id: 'appreciation-3', title: '表达欣赏', content: '不要吝啬你的赞美。告诉对方你欣赏TA什么，这会让对方感到被看见，也会加深你们之间的连接。', category: 'reframe' },
    { id: 'appreciation-4', title: '培养欣赏的习惯', content: '每天找出一件值得欣赏的事，无论大小。这个习惯会重塑你的大脑，让你更容易发现生活中的美好。', category: 'support' },
  ],
  
  // 乐观 (Optimism) - 4条
  optimism: [
    { id: 'optimism-1', title: '乐观是一种选择', content: '乐观不是天生的，而是每天的选择。你选择相信未来会更好，这本身就是一种力量。这种信念会影响你的行动和结果。', category: 'cognition' },
    { id: 'optimism-2', title: '乐观不是盲目', content: '真正的乐观不是忽视困难，而是相信困难可以被克服。你看到挑战，同时也看到可能性。这是成熟乐观者的智慧。', category: 'cognition' },
    { id: 'optimism-3', title: '保持弹性', content: '乐观也需要弹性。即使事情不如预期，也不必完全失望。调整期待，继续前行。灵活的乐观比僵化的乐观更有韧性。', category: 'acceptance' },
    { id: 'optimism-4', title: '乐观是可以传染的', content: '你的乐观会影响身边的人。当你相信美好会发生时，这种信念会传递给他人，创造一个更积极的氛围。', category: 'support' },
  ],
  
  // 自豪 (Pride) - 4条
  pride: [
    { id: 'pride-1', title: '自豪是对自己的认可', content: '感到自豪说明你认可了自己的努力和成就。这是健康的自我肯定，不是傲慢。你值得为自己感到骄傲。', category: 'cognition' },
    { id: 'pride-2', title: '记住你的成就', content: '这份自豪来自哪里？是你完成的事情、克服的困难、还是坚持的选择？记住这些成就，它们是你能力的证明。', category: 'cognition' },
    { id: 'pride-3', title: '分享你的喜悦', content: '不要害怕分享你的成就。告诉信任的人你为什么自豪。分享不会显得炫耀，反而会获得更多支持和认可。', category: 'reframe' },
    { id: 'pride-4', title: '继续前行', content: '自豪是旅途中的里程碑，但不是终点。享受这份成就感，然后带着这份自信继续前进。更好的自己在前方等你。', category: 'support' },
  ],
  
  // 感激 (Gratitude) - 4条
  gratitude: [
    { id: 'gratitude-1', title: '感激重塑大脑', content: '研究表明，经常感恩会改变大脑结构，让你更容易感受幸福。此刻的感激正在让你的大脑变得更积极。', category: 'cognition' },
    { id: 'gratitude-2', title: '感激是关系的桥梁', content: '当你感激某人时，你们之间的连接会加深。感激让被感谢的人感到被看见和被重视，这是关系中最美好的礼物。', category: 'cognition' },
    { id: 'gratitude-3', title: '表达感激', content: '不要把感激藏在心里。告诉对方你感谢TA什么，为什么感谢。具体的感激比泛泛的感谢更有力量。', category: 'reframe' },
    { id: 'gratitude-4', title: '记录感激', content: '把这份感激记录下来。每天写下三件感恩的事，这个简单的习惯会显著提升你的幸福感。', category: 'support' },
  ],
  
  // 好奇 (Curiosity) - 4条
  curiosity: [
    { id: 'curiosity-1', title: '好奇是成长的动力', content: '好奇心是学习和探索的原动力。当你对某事好奇时，你的大脑处于最活跃的学习状态。珍惜这份求知欲。', category: 'cognition' },
    { id: 'curiosity-2', title: '好奇让生活更有趣', content: '好奇心能让平凡的事物变得有趣。你正在发现世界的更多层面，这种探索让生活充满惊喜和可能性。', category: 'cognition' },
    { id: 'curiosity-3', title: '跟随你的好奇', content: '不要压抑好奇心。去探索你想了解的事物，去问你想问的问题。好奇心指引的方向，往往藏着你的热情所在。', category: 'reframe' },
    { id: 'curiosity-4', title: '保持开放', content: '好奇心需要开放的心态。不要急于判断，先保持"不知道"的状态，让好奇心带你去发现新的答案。', category: 'support' },
  ],
  
  // ===== 中性混合区 (valence 4) =====
  
  // 释然 (Relieved) - 4条
  relieved: [
    { id: 'relieved-1', title: '释然是放下的智慧', content: '能感到释然，说明你学会了放下。这种放下不是放弃，而是不再被过去的事情消耗。这是一种成熟的智慧。', category: 'cognition' },
    { id: 'relieved-2', title: '享受轻松', content: '负担卸下后的轻松感是珍贵的。深呼吸，感受肩膀的放松、内心的轻快。这是你应得的平静时刻。', category: 'cognition' },
    { id: 'relieved-3', title: '记住这种放下', content: '记住你是如何走到释然的。是某个顿悟、某次对话、还是时间的流逝？这些是你未来放下负担的经验。', category: 'reframe' },
    { id: 'relieved-4', title: '向前看', content: '释然之后，你有更多的能量面向未来。过去的已经过去，现在的你是轻盈的，可以继续前行了。', category: 'support' },
  ],
  
  // 怀念 (Nostalgia) - 4条
  nostalgia: [
    { id: 'nostalgia-1', title: '怀念是爱的延续', content: '怀念说明你心中有珍贵的记忆。这种温柔的回望是对过去美好时光的致敬，也是爱的一种延续方式。', category: 'cognition' },
    { id: 'nostalgia-2', title: '过去塑造了现在', content: '那些你怀念的时光，塑造了今天的你。感谢那些经历，它们是你生命故事中不可或缺的章节。', category: 'cognition' },
    { id: 'nostalgia-3', title: '怀念不等于沉溺', content: '怀念过去的同时，也要记得珍惜现在。过去的美好可以成为力量，而不是让你停滞不前的理由。', category: 'reframe' },
    { id: 'nostalgia-4', title: '创造新的美好', content: '过去的美好值得怀念，但未来还有更多美好等着你去创造。把怀念转化为动力，去书写新的故事。', category: 'support' },
  ],
  
  // 惊讶 (Surprise) - 4条
  surprise: [
    { id: 'surprise-1', title: '惊讶打破常规', content: '惊讶说明生活给你带来了意想不到的东西。这种打破常规的体验，让生活充满悬念和新鲜感。', category: 'cognition' },
    { id: 'surprise-2', title: '拥抱未知', content: '惊讶时，你的思维会暂时停顿。这是接受新信息的过程。给自己一点时间消化，看看这个意外带来什么。', category: 'cognition' },
    { id: 'surprise-3', title: '惊喜与惊吓', content: '惊讶可以是正面的也可以是负面的。无论哪种，先接受它的存在，然后再决定如何回应。', category: 'acceptance' },
    { id: 'surprise-4', title: '保持开放', content: '生活中的惊喜让日子不再平淡。即使有些惊讶让人措手不及，它们也是生活丰富性的体现。', category: 'support' },
  ],
  
  // 敬畏 (Awe) - 4条
  awe: [
    { id: 'awe-1', title: '敬畏让人谦卑', content: '面对宏大的事物感到敬畏，这是人类最深刻的情感之一。它让我们意识到自己的渺小，也让我们与世界产生更深的连接。', category: 'cognition' },
    { id: 'awe-2', title: '敬畏扩展视野', content: '敬畏的体验会改变你看待世界的方式。那些比个人更大的存在——自然、宇宙、生命——会让你重新审视什么才是重要的。', category: 'cognition' },
    { id: 'awe-3', title: '珍惜这份体验', content: '不是每个人都能经常感受到敬畏。这份体验是珍贵的，让它沉淀在心中，成为你精神世界的一部分。', category: 'acceptance' },
    { id: 'awe-4', title: '寻找更多敬畏', content: '大自然、艺术、人类的成就都能带来敬畏。多去接触这些宏大的事物，它们会滋养你的灵魂。', category: 'support' },
  ],
  
  // 困惑 (Confusion) - 4条
  confusion: [
    { id: 'confusion-1', title: '困惑是成长的前奏', content: '困惑说明你在思考、在质疑。这往往是突破的前夜。很多重要的领悟，都从"我不明白"开始。', category: 'cognition' },
    { id: 'confusion-2', title: '允许自己困惑', content: '不需要立刻弄清楚一切。困惑本身也是一种状态，允许自己暂时"不知道"。答案会在适当的时候出现。', category: 'acceptance' },
    { id: 'confusion-3', title: '拆解困惑', content: '如果困惑持续，试着把它拆分成小问题。哪些是你能理解的？哪些是完全不懂的？一步步来，不必急于求成。', category: 'reframe' },
    { id: 'confusion-4', title: '寻求帮助', content: '困惑时，向他人请教或讨论往往能带来新的视角。你不必独自承担所有困惑，交流本身就是解惑的过程。', category: 'support' },
  ],
  
  // ===== 轻微负面区 (valence 3) =====
  
  // 迷茫 (Lost) - 4条
  lost: [
    { id: 'lost-1', title: '迷茫是转折的信号', content: '迷茫往往出现在人生的转折点。它说明旧的方向不再适用，新的方向还未清晰。这是成长的必经阶段。', category: 'cognition' },
    { id: 'lost-2', title: '允许自己迷失', content: '不是每时每刻都需要有明确的方向。迷失一段时间也是正常的。给自己一点耐心，答案会慢慢浮现。', category: 'acceptance' },
    { id: 'lost-3', title: '小步探索', content: '不知道大方向时，先迈出小步。尝试一些新事物，认识一些新的人。方向往往在行动中逐渐清晰。', category: 'reframe' },
    { id: 'lost-4', title: '你终会找到', content: '现在的迷茫不会永远持续。很多人在迷茫后找到了更适合自己的路。相信自己，你也会找到属于你的方向。', category: 'support' },
  ],
  
  // 犹豫 (Hesitation) - 4条
  hesitation: [
    { id: 'hesitation-1', title: '犹豫说明你在认真', content: '犹豫不是优柔寡断，而是你在认真权衡。这说明你重视这个决定，不想草率行事。这是负责任的态度。', category: 'cognition' },
    { id: 'hesitation-2', title: '没有完美选择', content: '你可能想找到最好的答案，但往往不存在绝对完美的选择。每个选项都有利弊，关键是选择对你而言足够好的那个。', category: 'cognition' },
    { id: 'hesitation-3', title: '设定决定时间', content: '给自己设定一个决定的截止时间。收集足够的信息后，在截止时间前做出选择。过度犹豫反而会消耗更多精力。', category: 'reframe' },
    { id: 'hesitation-4', title: '相信直觉', content: '除了理性分析，也要听听内心的声音。有时候，直觉会比头脑更快地知道答案。给直觉一个发言的机会。', category: 'support' },
  ],
  
  // 忐忑 (Unease) - 4条
  unease: [
    { id: 'unease-1', title: '忐忑是正常的', content: '面对未知的结果感到不安，这是人之常情。不要责怪自己"为什么不能更淡定"。忐忑说明你在乎。', category: 'cognition' },
    { id: 'unease-2', title: '区分可控与不可控', content: '问问自己：哪些是我能控制的？哪些不是？专注于能控制的部分，对不能控制的学会放手。', category: 'reframe' },
    { id: 'unease-3', title: '转移注意力', content: '如果忐忑持续，试着做些其他事情转移注意力。运动、阅读、和朋友聊天，让大脑暂时离开焦虑的源头。', category: 'reframe' },
    { id: 'unease-4', title: '相信自己的应对能力', content: '无论结果如何，你都有能力应对。回想过去你度过的难关，每一次你都挺过来了。这次也一样。', category: 'support' },
  ],
  
  // 矛盾 (Conflict) - 4条
  conflict: [
    { id: 'conflict-1', title: '矛盾是内心对话', content: '矛盾说明你内心有不同的声音在对话。这不是坏事，而是你在认真面对复杂的情境。给自己一点时间和空间。', category: 'cognition' },
    { id: 'conflict-2', title: '倾听每个声音', content: '试着倾听内心每个声音在说什么。它们各有什么理由？理解每个声音背后的需求，才能找到平衡点。', category: 'cognition' },
    { id: 'conflict-3', title: '寻找第三选择', content: '矛盾不一定是二选一。有没有第三种可能？能不能找到一个兼顾各方需求的方案？创意往往来自矛盾的张力。', category: 'reframe' },
    { id: 'conflict-4', title: '接受不完美', content: '有些矛盾可能无法完全解决。接受这种张力，学会带着矛盾生活，也是一种成熟。', category: 'support' },
  ],
  
  // ===== 中度负面区 (valence 2) =====
  
  // 厌倦 (Boredom) - 4条
  boredom: [
    { id: 'boredom-1', title: '厌倦是改变的信号', content: '厌倦说明你需要一些新鲜感或变化。它在提醒你：是时候做点不同的事情了。', category: 'cognition' },
    { id: 'boredom-2', title: '厌倦也是休息', content: '有时候厌倦只是大脑需要休息。不必急着填满每个时刻，允许自己有一段空白期。', category: 'acceptance' },
    { id: 'boredom-3', title: '寻找小变化', content: '不需要大改变，小小的变化就能打破厌倦。换条路走、尝试新餐厅、学个小技能，都是不错的选择。', category: 'reframe' },
    { id: 'boredom-4', title: '探索内在', content: '厌倦有时来自内心的空虚。试着问问自己：我真正想要的是什么？厌倦可能是探索内心需求的入口。', category: 'support' },
  ],
  
  // 孤独 (Loneliness) - 4条
  loneliness: [
    { id: 'loneliness-1', title: '孤独不等于独处', content: '孤独是一种缺乏连接的感觉，与是否独处无关。理解这一点，你就能更准确地找到解决孤独的方式。', category: 'cognition' },
    { id: 'loneliness-2', title: '允许孤独存在', content: '感到孤独不是软弱，而是人类对连接的本能需求。允许自己感受孤独，然后思考如何建立更多连接。', category: 'acceptance' },
    { id: 'loneliness-3', title: '主动连接', content: '孤独时，可以主动创造连接。给朋友发个消息、参加一个活动、或者只是和陌生人聊几句。小小的连接也有力量。', category: 'reframe' },
    { id: 'loneliness-4', title: '与自己连接', content: '在等待他人连接的同时，也可以加深与自己的连接。独处时做些喜欢的事，享受与自己相处的时光。', category: 'support' },
  ],
  
  // 沮丧 (Frustration) - 4条
  frustration: [
    { id: 'frustration-1', title: '沮丧说明你在乎', content: '沮丧是因为目标受阻，而你在乎这个目标。这份在乎本身就是有意义的，它说明你有追求。', category: 'cognition' },
    { id: 'frustration-2', title: '调整策略', content: '目标受阻时，也许需要调整方法而不是放弃。有没有其他路径可以达到同样的目标？', category: 'reframe' },
    { id: 'frustration-3', title: '允许自己沮丧', content: '沮丧时不要强迫自己立刻振作。给自己一点时间消化这份挫败，然后再决定下一步。', category: 'acceptance' },
    { id: 'frustration-4', title: '回顾成功经验', content: '回想过去你克服的困难。每一次沮丧后你都找到了出路。这次也一样，你有能力跨过这个障碍。', category: 'support' },
  ],
  
  // 失望 (Disappointment) - 4条
  disappointment: [
    { id: 'disappointment-1', title: '失望源于期待', content: '失望说明你对某件事有期待。这份期待本身没有错，只是结果与预期不符。给自己一点时间消化。', category: 'cognition' },
    { id: 'disappointment-2', title: '调整期待', content: '失望后，可以反思：我的期待是否合理？是否可以调整期待，让它更符合现实？', category: 'reframe' },
    { id: 'disappointment-3', title: '允许悲伤', content: '失望会带来悲伤，这是正常的。不要急着"看开"，允许自己难过一会儿。情绪需要被感受，才能被释放。', category: 'acceptance' },
    { id: 'disappointment-4', title: '新的开始', content: '失望结束后，新的机会会出现。这次的经历会成为你的经验，帮助你更好地面对未来。', category: 'support' },
  ],
  
  // 压抑 (Suppression) - 4条
  suppression: [
    { id: 'suppression-1', title: '压抑是自我保护', content: '压抑情绪往往是出于自我保护——可能是害怕冲突、害怕被拒绝。理解这个机制，对自己多一份理解。', category: 'cognition' },
    { id: 'suppression-2', title: '情绪需要出口', content: '长期压抑情绪会消耗大量能量，也可能影响身心健康。找到安全的方式表达情绪，是自我关怀的重要部分。', category: 'cognition' },
    { id: 'suppression-3', title: '寻找安全出口', content: '写日记、运动、和信任的人倾诉、创作——找到适合你的情绪出口。表达出来，压力会减轻很多。', category: 'reframe' },
    { id: 'suppression-4', title: '逐步练习表达', content: '如果表达情绪对你来说很难，可以从小事开始练习。慢慢建立"表达是安全的"这个信念。', category: 'support' },
  ],
  
  // 悲伤 (Sadness) - 4条
  sadness: [
    { id: 'sadness-1', title: '悲伤是爱的代价', content: '能感到悲伤，说明你爱过、在乎过。悲伤是爱的另一面，它证明你有能力深情地对待生命。', category: 'cognition' },
    { id: 'sadness-2', title: '允许悲伤流淌', content: '悲伤需要时间流淌。不要急着"好起来"，给自己足够的耐心。哭泣是释放，不是软弱。', category: 'acceptance' },
    { id: 'sadness-3', title: '温柔对待自己', content: '悲伤时，对自己格外温柔。做一些让自己舒服的事：听音乐、散步、喝热茶。小小的自我照顾也很重要。', category: 'reframe' },
    { id: 'sadness-4', title: '悲伤会过去', content: '现在的悲伤感觉无边无际，但它不会永远持续。时间会疗愈，你也会慢慢好起来。相信这个过程。', category: 'support' },
  ],
  
  // ===== 深度负面区 (valence 1) =====
  
  // 麻木 (Numbness) - 4条
  numbness: [
    { id: 'numbness-1', title: '麻木是保护机制', content: '麻木往往是情绪过载后的自我保护。当感受太多时，心灵选择暂时关闭。这不是你的错，是你在保护自己。', category: 'cognition' },
    { id: 'numbness-2', title: '不要强迫感觉', content: '麻木时不要强迫自己"应该感觉点什么"。感受会回来的，给身体和心灵一些时间恢复。', category: 'acceptance' },
    { id: 'numbness-3', title: '从小事开始', content: '试着关注一些简单的感官体验：阳光的温度、水的触感、食物的味道。这些小小的感觉是感受力恢复的起点。', category: 'reframe' },
    { id: 'numbness-4', title: '寻求支持', content: '如果麻木持续很长时间，考虑和专业人士聊聊。这不是软弱，而是照顾自己的重要一步。', category: 'support' },
  ],
  
  // 空虚 (Emptiness) - 4条
  emptiness: [
    { id: 'emptiness-1', title: '空虚是需求的信号', content: '空虚感在告诉你：内心有些需求没有得到满足。也许是连接、意义、或自我实现。试着理解这个信号。', category: 'cognition' },
    { id: 'emptiness-2', title: '不要用填充逃避', content: '空虚时很容易想用各种东西填满——娱乐、食物、工作。但真正的满足来自内心，不是外在的填充。', category: 'cognition' },
    { id: 'emptiness-3', title: '探索意义', content: '什么让你感到有意义？是创造、帮助他人、学习、还是连接？寻找这些源泉，空虚会逐渐被填补。', category: 'reframe' },
    { id: 'emptiness-4', title: '小小的行动', content: '不需要立刻找到人生意义。从小事开始：做一件让自己感到充实的事，哪怕很小。积累会带来改变。', category: 'support' },
  ],
  
  // 羞愧 (Shame) - 4条
  shame: [
    { id: 'shame-1', title: '羞愧不等于你不好', content: '羞愧是一种情绪，不等于你这个人有问题。每个人都会有感到羞愧的时刻，这是人之常情。', category: 'cognition' },
    { id: 'shame-2', title: '区分内疚与羞愧', content: '内疚是"我做错了事"，羞愧是"我这个人有问题"。试着把羞愧转化为内疚：这件事可以改进，但你本身是有价值的。', category: 'reframe' },
    { id: 'shame-3', title: '自我同情', content: '羞愧时，想象你最好的朋友经历了同样的事。你会对TA说什么？用同样温柔的话语对待自己。', category: 'acceptance' },
    { id: 'shame-4', title: '你值得被接纳', content: '无论发生了什么，你都值得被接纳——包括被自己接纳。羞愧会过去，你的价值不会因此减少。', category: 'support' },
  ],
  
  // 恐惧 (Fear) - 4条
  fear: [
    { id: 'fear-1', title: '恐惧是保护机制', content: '恐惧是人类最原始的保护机制，它在提醒你注意潜在的危险。这份恐惧想保护你，理解它的善意。', category: 'cognition' },
    { id: 'fear-2', title: '区分真实与想象', content: '问问自己：我害怕的事情真的会发生吗？概率有多大？很多时候，恐惧来自想象而非现实。', category: 'reframe' },
    { id: 'fear-3', title: '小步面对', content: '如果恐惧来自真实的问题，试着小步面对。不需要一下子解决，每次迈出一小步，恐惧会逐渐减轻。', category: 'reframe' },
    { id: 'fear-4', title: '你比恐惧更强大', content: '回想过去你克服恐惧的经历。每一次你都挺过来了。你有能力面对现在的恐惧，相信自己。', category: 'support' },
  ],
  
  // 痛苦 (Pain) - 4条
  pain: [
    { id: 'pain-1', title: '痛苦需要被看见', content: '痛苦是真实的，不要否认或压抑它。承认自己正在经历痛苦，是疗愈的第一步。', category: 'cognition' },
    { id: 'pain-2', title: '给自己时间', content: '痛苦没有时间表，不需要急着"好起来"。给自己足够的时间和空间去感受、去疗愈。', category: 'acceptance' },
    { id: 'pain-3', title: '寻找支持', content: '痛苦时不要独自承受。向信任的人倾诉，或寻求专业帮助。你不需要一个人面对这一切。', category: 'support' },
    { id: 'pain-4', title: '相信疗愈的可能', content: '现在的痛苦感觉难以承受，但它不会永远持续。很多人从深重的痛苦中走了出来，你也可以。', category: 'support' },
  ],
  
  // 绝望 (Despair) - 4条
  despair: [
    { id: 'despair-1', title: '绝望是情绪的极限', content: '绝望说明你承受了很多，已经到了情绪的极限。这不是软弱，而是你一直在坚强地支撑。', category: 'cognition' },
    { id: 'despair-2', title: '不要独自面对', content: '绝望时，最重要的是不要独自承受。请告诉身边的人你的感受，或寻求专业帮助。', category: 'support' },
    { id: 'despair-3', title: '此刻不是永远', content: '绝望会让人觉得"永远都会这样"。但情绪是流动的，即使是最深的黑暗也不会永远持续。', category: 'reframe' },
    { id: 'despair-4', title: '求助是勇气', content: '在绝望中求助需要巨大的勇气。如果你正在经历绝望，请拨打心理援助热线或寻求专业帮助。你值得被帮助。', category: 'support' },
  ],
  
  // ===== 原有9种情绪（保留完整8条） =====
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

// 负面情绪列表（valence 1-3）
const negativeMoods = ['anxiety', 'melancholy', 'regret', 'stress', 'doubt', 'sadness', 'fear', 'shame', 'despair', 'pain', 'loneliness', 'frustration', 'disappointment', 'suppression', 'boredom', 'lost', 'hesitation', 'unease', 'conflict', 'numbness', 'emptiness', 'confusion'];
// 正面情绪列表（valence 5-6）
const positiveMoods = ['happy', 'calm', 'content', 'anticipation', 'serenity', 'relief', 'contentment', 'joy', 'delight', 'excitement', 'cherish', 'appreciation', 'optimism', 'pride', 'gratitude', 'curiosity', 'relieved'];

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
    // 如果没有moodId，随机选择一个情绪（36种）
    const allMoodIds = ['serenity', 'relief', 'contentment', 'joy', 'delight', 'excitement', 'cherish', 'appreciation', 'optimism', 'pride', 'gratitude', 'curiosity', 'relieved', 'nostalgia', 'surprise', 'anticipation', 'awe', 'confusion', 'melancholy', 'lost', 'hesitation', 'unease', 'anxiety', 'conflict', 'boredom', 'loneliness', 'frustration', 'disappointment', 'suppression', 'sadness', 'numbness', 'emptiness', 'shame', 'fear', 'pain', 'despair'];
    const defaultMoodId = moodId || allMoodIds[Math.floor(Math.random() * allMoodIds.length)];
    
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
