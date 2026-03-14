import type { Mood, Scene, Activity } from '@/types';

// 36种情绪标签 - 基于效价(valence)、唤醒度(arousal)、能量值(energy_value)维度
export const moods: Mood[] = [
  // === 正面高能量区 (valence 5-6, arousal 4-6) ===
  {
    id: 'serenity',
    name: '宁静',
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
    ringColor: 'ring-sky-300',
    icon: '🕊️',
    description: '内心平和无波的状态',
    valence: 6, arousal: 1, energy: 8
  },
  {
    id: 'relief',
    name: '安心',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    ringColor: 'ring-emerald-300',
    icon: '🛡️',
    description: '感到被保护和支持',
    valence: 6, arousal: 2, energy: 23
  },
  {
    id: 'contentment',
    name: '满足',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    ringColor: 'ring-yellow-300',
    icon: '😊',
    description: '愿望被满足后的充盈感',
    valence: 6, arousal: 3, energy: 38
  },
  {
    id: 'joy',
    name: '快乐',
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
    ringColor: 'ring-amber-300',
    icon: '😄',
    description: '轻松愉悦的积极体验',
    valence: 6, arousal: 4, energy: 53
  },
  {
    id: 'delight',
    name: '喜悦',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    ringColor: 'ring-orange-300',
    icon: '🥰',
    description: '更深层的暖意与幸福',
    valence: 6, arousal: 5, energy: 68
  },
  {
    id: 'excitement',
    name: '兴奋',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    ringColor: 'ring-orange-400',
    icon: '🤩',
    description: '高能量的积极期待',
    valence: 6, arousal: 6, energy: 88
  },
  // === 正面社会/认知区 (valence 5) ===
  {
    id: 'cherish',
    name: '珍爱',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
    ringColor: 'ring-pink-300',
    icon: '💝',
    description: '对重要事物的温柔呵护',
    valence: 5, arousal: 1, energy: 8
  },
  {
    id: 'appreciation',
    name: '欣赏',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    ringColor: 'ring-green-300',
    icon: '🌟',
    description: '看到美好并心生愉悦',
    valence: 5, arousal: 2, energy: 23
  },
  {
    id: 'optimism',
    name: '乐观',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    ringColor: 'ring-yellow-300',
    icon: '🌈',
    description: '对未来抱有积极预期',
    valence: 5, arousal: 3, energy: 38
  },
  {
    id: 'pride',
    name: '自豪',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    ringColor: 'ring-purple-300',
    icon: '🏆',
    description: '因成就而感到荣耀',
    valence: 5, arousal: 4, energy: 53
  },
  {
    id: 'gratitude',
    name: '感激',
    color: 'text-green-400',
    bgColor: 'bg-green-100',
    ringColor: 'ring-green-300',
    icon: '🙏',
    description: '被善意触动后的温暖',
    valence: 5, arousal: 5, energy: 68
  },
  {
    id: 'curiosity',
    name: '好奇',
    color: 'text-amber-400',
    bgColor: 'bg-amber-100',
    ringColor: 'ring-amber-300',
    icon: '🔍',
    description: '想探索未知的动力',
    valence: 5, arousal: 6, energy: 88
  },
  // === 中性混合区 (valence 4) ===
  {
    id: 'relieved',
    name: '释然',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
    ringColor: 'ring-emerald-300',
    icon: '😌',
    description: '放下负担后的轻松',
    valence: 4, arousal: 1, energy: 8
  },
  {
    id: 'nostalgia',
    name: '怀念',
    color: 'text-stone-500',
    bgColor: 'bg-stone-100',
    ringColor: 'ring-stone-300',
    icon: '📜',
    description: '对过去温柔的回望',
    valence: 4, arousal: 2, energy: 23
  },
  {
    id: 'surprise',
    name: '惊讶',
    color: 'text-violet-500',
    bgColor: 'bg-violet-100',
    ringColor: 'ring-violet-300',
    icon: '😲',
    description: '突发信息带来的瞬间停顿',
    valence: 4, arousal: 3, energy: 38
  },
  {
    id: 'anticipation',
    name: '期待',
    color: 'text-lime-500',
    bgColor: 'bg-lime-100',
    ringColor: 'ring-lime-300',
    icon: '✨',
    description: '对未来的积极投注',
    valence: 4, arousal: 4, energy: 53
  },
  {
    id: 'awe',
    name: '敬畏',
    color: 'text-blue-400',
    bgColor: 'bg-blue-100',
    ringColor: 'ring-blue-300',
    icon: '🏔️',
    description: '面对宏大事物的震撼',
    valence: 4, arousal: 5, energy: 68
  },
  {
    id: 'confusion',
    name: '困惑',
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    ringColor: 'ring-gray-300',
    icon: '🤔',
    description: '信息冲突导致的混乱',
    valence: 4, arousal: 6, energy: 88
  },
  // === 轻微负面区 (valence 3) ===
  {
    id: 'melancholy',
    name: '惆怅',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-100',
    ringColor: 'ring-indigo-300',
    icon: '🍂',
    description: '淡淡的忧伤与失落',
    valence: 3, arousal: 1, energy: 8
  },
  {
    id: 'lost',
    name: '迷茫',
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    ringColor: 'ring-slate-300',
    icon: '🌫️',
    description: '方向感丧失的无所适从',
    valence: 3, arousal: 2, energy: 23
  },
  {
    id: 'hesitation',
    name: '犹豫',
    color: 'text-stone-500',
    bgColor: 'bg-stone-100',
    ringColor: 'ring-stone-300',
    icon: '🤷',
    description: '难以做决定的停滞',
    valence: 3, arousal: 3, energy: 38
  },
  {
    id: 'unease',
    name: '忐忑',
    color: 'text-purple-400',
    bgColor: 'bg-purple-100',
    ringColor: 'ring-purple-300',
    icon: '💭',
    description: '对未知结果的轻微不安',
    valence: 3, arousal: 4, energy: 53
  },
  {
    id: 'anxiety',
    name: '焦虑',
    color: 'text-rose-500',
    bgColor: 'bg-rose-100',
    ringColor: 'ring-rose-300',
    icon: '😰',
    description: '对不确定性的担忧',
    valence: 3, arousal: 5, energy: 68
  },
  {
    id: 'conflict',
    name: '矛盾',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    ringColor: 'ring-amber-300',
    icon: '⚖️',
    description: '两种力量拉扯的内耗',
    valence: 3, arousal: 6, energy: 88
  },
  // === 中度负面区 (valence 2) ===
  {
    id: 'boredom',
    name: '厌倦',
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    ringColor: 'ring-stone-400',
    icon: '😑',
    description: '对重复事物的疲惫',
    valence: 2, arousal: 1, energy: 8
  },
  {
    id: 'loneliness',
    name: '孤独',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    ringColor: 'ring-blue-300',
    icon: '🥺',
    description: '缺乏连接的清冷感',
    valence: 2, arousal: 2, energy: 23
  },
  {
    id: 'frustration',
    name: '沮丧',
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
    ringColor: 'ring-violet-300',
    icon: '😔',
    description: '目标受阻后的挫败',
    valence: 2, arousal: 3, energy: 38
  },
  {
    id: 'disappointment',
    name: '失望',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    ringColor: 'ring-gray-400',
    icon: '😞',
    description: '期待落空后的落差',
    valence: 2, arousal: 4, energy: 53
  },
  {
    id: 'suppression',
    name: '压抑',
    color: 'text-stone-700',
    bgColor: 'bg-stone-200',
    ringColor: 'ring-stone-400',
    icon: '😶',
    description: '情绪被压住无法表达',
    valence: 2, arousal: 5, energy: 68
  },
  {
    id: 'sadness',
    name: '悲伤',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    ringColor: 'ring-blue-400',
    icon: '😢',
    description: '深层的忧伤与哀痛',
    valence: 2, arousal: 6, energy: 88
  },
  // === 深度负面区 (valence 1) ===
  {
    id: 'numbness',
    name: '麻木',
    color: 'text-gray-600',
    bgColor: 'bg-gray-200',
    ringColor: 'ring-gray-400',
    icon: '🫥',
    description: '情绪关闭后的空白',
    valence: 1, arousal: 1, energy: 8
  },
  {
    id: 'emptiness',
    name: '空虚',
    color: 'text-slate-600',
    bgColor: 'bg-slate-200',
    ringColor: 'ring-slate-400',
    icon: '🕳️',
    description: '内心空洞缺乏意义感',
    valence: 1, arousal: 2, energy: 23
  },
  {
    id: 'shame',
    name: '羞愧',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    ringColor: 'ring-red-400',
    icon: '😳',
    description: '因暴露缺陷而难堪',
    valence: 1, arousal: 3, energy: 38
  },
  {
    id: 'fear',
    name: '恐惧',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-200',
    ringColor: 'ring-indigo-400',
    icon: '😨',
    description: '面对威胁的本能反应',
    valence: 1, arousal: 4, energy: 53
  },
  {
    id: 'pain',
    name: '痛苦',
    color: 'text-red-800',
    bgColor: 'bg-red-200',
    ringColor: 'ring-red-500',
    icon: '💔',
    description: '难以承受的强烈煎熬',
    valence: 1, arousal: 5, energy: 68
  },
  {
    id: 'despair',
    name: '绝望',
    color: 'text-gray-800',
    bgColor: 'bg-gray-300',
    ringColor: 'ring-gray-500',
    icon: '🖤',
    description: '看不到希望的虚无感',
    valence: 1, arousal: 6, energy: 88
  }
];

// 场景数据保持不变
export const scenes: Scene[] = [
  { id: 'home', name: '居家', icon: '🏠', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { id: 'alone', name: '独处', icon: '🧘', color: 'text-teal-600', bgColor: 'bg-teal-50' },
  { id: 'work', name: '工作', icon: '💼', color: 'text-slate-600', bgColor: 'bg-slate-50' },
  { id: 'commute', name: '通勤', icon: '🚌', color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  { id: 'love', name: '恋爱', icon: '💕', color: 'text-pink-600', bgColor: 'bg-pink-50' },
  { id: 'social', name: '社交', icon: '🎉', color: 'text-indigo-600', bgColor: 'bg-indigo-50' }
];

// 场景活动数据库
export const sceneActivities: Record<string, Activity[]> = {
  home: [
    { id: 'home-cozy', title: '打造舒适角落', description: '整理一个专属放松角落，点上香薰，铺上柔软的毯子，营造安全感', duration: '10分钟', color: 'text-amber-600', bgGradient: 'from-amber-50 to-orange-50' },
    { id: 'home-tea', title: '居家茶疗', description: '泡一杯温热的花草茶，坐在窗边慢慢品味，观察窗外的景色', duration: '15分钟', color: 'text-amber-600', bgGradient: 'from-amber-50 to-yellow-50' },
    { id: 'home-bath', title: '温暖沐浴', description: '准备一次舒适的泡澡或淋浴，让热水冲刷疲惫，放松全身肌肉', duration: '20分钟', color: 'text-amber-600', bgGradient: 'from-amber-50 to-rose-50' },
    { id: 'home-journal', title: '情绪日记', description: '在安静的环境中写下今天的感受，不用修饰，让情绪自然流淌', duration: '10分钟', color: 'text-amber-600', bgGradient: 'from-amber-50 to-teal-50' }
  ],
  alone: [
    { id: 'alone-breathe', title: '正念呼吸', description: '找一个安静的地方，闭上眼睛，专注于呼吸的进出，觉察身体感受', duration: '10分钟', color: 'text-teal-600', bgGradient: 'from-teal-50 to-emerald-50' },
    { id: 'alone-meditation', title: '独处冥想', description: '播放轻音乐或自然声音，让思绪沉淀，享受与自我相处的宁静', duration: '15分钟', color: 'text-teal-600', bgGradient: 'from-teal-50 to-cyan-50' },
    { id: 'alone-walk', title: '独自漫步', description: '一个人慢慢走走，观察周围细节，让思绪随着脚步流动', duration: '20分钟', color: 'text-teal-600', bgGradient: 'from-teal-50 to-blue-50' },
    { id: 'alone-reflect', title: '自我对话', description: '对着镜子或闭上眼睛，温柔地和自己对话，倾听内心的声音', duration: '10分钟', color: 'text-teal-600', bgGradient: 'from-teal-50 to-indigo-50' }
  ],
  work: [
    { id: 'work-stretch', title: '工位拉伸', description: '在座位上做一些简单的颈部、肩部和腰部拉伸，缓解身体紧张', duration: '5分钟', color: 'text-slate-600', bgGradient: 'from-slate-50 to-gray-50' },
    { id: 'work-pomodoro', title: '番茄工作法', description: '设定25分钟专注时间，然后休息5分钟，提高工作效率', duration: '30分钟', color: 'text-slate-600', bgGradient: 'from-slate-50 to-blue-50' },
    { id: 'work-organize', title: '桌面整理', description: '花几分钟整理工作桌面，清理杂物，让环境更清爽有序', duration: '10分钟', color: 'text-slate-600', bgGradient: 'from-slate-50 to-teal-50' },
    { id: 'work-break', title: '短暂离席', description: '离开工位，去茶水间或窗边站一会儿，让大脑短暂休息', duration: '5分钟', color: 'text-slate-600', bgGradient: 'from-slate-50 to-indigo-50' }
  ],
  commute: [
    { id: 'commute-music', title: '音乐疗愈', description: '戴上耳机，听喜欢的音乐或播客，让通勤时间成为放松时刻', duration: '15分钟', color: 'text-cyan-600', bgGradient: 'from-cyan-50 to-blue-50' },
    { id: 'commute-observe', title: '观察练习', description: '看着窗外的风景或周围的人，不做评判，只是观察当下', duration: '10分钟', color: 'text-cyan-600', bgGradient: 'from-cyan-50 to-teal-50' },
    { id: 'commute-breathe', title: '通勤呼吸', description: '利用通勤时间做深呼吸练习，4-7-8呼吸法帮助平静心情', duration: '5分钟', color: 'text-cyan-600', bgGradient: 'from-cyan-50 to-emerald-50' },
    { id: 'commute-plan', title: '日程预演', description: '在脑海中预演今天的安排，为即将到来的事情做好心理准备', duration: '5分钟', color: 'text-cyan-600', bgGradient: 'from-cyan-50 to-indigo-50' }
  ],
  love: [
    { id: 'love-message', title: '甜蜜留言', description: '给对方发一条表达爱意或感谢的消息，分享此刻的心情', duration: '3分钟', color: 'text-pink-600', bgGradient: 'from-pink-50 to-rose-50' },
    { id: 'love-memory', title: '回忆美好', description: '翻看两人的照片或回忆美好的共同经历，感受爱的温暖', duration: '10分钟', color: 'text-pink-600', bgGradient: 'from-pink-50 to-purple-50' },
    { id: 'love-plan', title: '约会计划', description: '计划一次特别的约会或活动，为关系注入新鲜感和期待', duration: '10分钟', color: 'text-pink-600', bgGradient: 'from-pink-50 to-orange-50' },
    { id: 'love-gratitude', title: '感恩伴侣', description: '写下伴侣让你感激的3件事，体会被爱和爱人的幸福', duration: '5分钟', color: 'text-pink-600', bgGradient: 'from-pink-50 to-red-50' }
  ],
  social: [
    { id: 'social-connect', title: '深度交流', description: '和身边的人进行一次真诚的对话，分享感受，倾听对方', duration: '15分钟', color: 'text-indigo-600', bgGradient: 'from-indigo-50 to-purple-50' },
    { id: 'social-laugh', title: '寻找欢乐', description: '和朋友一起看搞笑视频或分享趣事，让笑声释放压力', duration: '10分钟', color: 'text-indigo-600', bgGradient: 'from-indigo-50 to-blue-50' },
    { id: 'social-support', title: '互相支持', description: '向朋友表达关心，或寻求朋友的支持，感受人际连接的力量', duration: '10分钟', color: 'text-indigo-600', bgGradient: 'from-indigo-50 to-pink-50' },
    { id: 'social-boundary', title: '设定界限', description: '如果感到疲惫，学会礼貌地暂时退出社交，给自己充电时间', duration: '5分钟', color: 'text-indigo-600', bgGradient: 'from-indigo-50 to-slate-50' }
  ]
};

// 36种情绪活动推荐库
const moodActivityDatabase: Record<string, Activity[]> = {
  // === 正面高能量区 ===
  serenity: [
    { id: 'serenity-meditation', title: '深度冥想', description: '闭上眼睛，感受这份宁静，让身心完全放松', duration: '15分钟', color: 'text-sky-600', bgGradient: 'from-sky-50 to-blue-50' },
    { id: 'serenity-nature', title: '自然连接', description: '望向窗外或到户外，观察自然界的细节之美', duration: '10分钟', color: 'text-sky-600', bgGradient: 'from-sky-50 to-teal-50' },
    { id: 'serenity-reading', title: '静心阅读', description: '读几页喜欢的书，享受这份宁静时光', duration: '20分钟', color: 'text-sky-600', bgGradient: 'from-sky-50 to-indigo-50' }
  ],
  relief: [
    { id: 'relief-breathe', title: '感恩呼吸', description: '深呼吸，感受安全和支持，对自己说"我很好"', duration: '5分钟', color: 'text-emerald-600', bgGradient: 'from-emerald-50 to-green-50' },
    { id: 'relief-rest', title: '安心休息', description: '躺下来，让身体完全放松，感受被保护的安全感', duration: '15分钟', color: 'text-emerald-600', bgGradient: 'from-emerald-50 to-teal-50' },
    { id: 'relief-thanks', title: '表达感谢', description: '给支持你的人发一条感谢消息', duration: '3分钟', color: 'text-emerald-600', bgGradient: 'from-emerald-50 to-cyan-50' }
  ],
  contentment: [
    { id: 'contentment-savor', title: '品味当下', description: '闭上眼睛，深呼吸，充分感受这份满足感', duration: '3分钟', color: 'text-yellow-600', bgGradient: 'from-yellow-50 to-amber-50' },
    { id: 'contentment-appreciate', title: '欣赏拥有', description: '列出5件你感恩拥有的事物，感受内心的富足', duration: '5分钟', color: 'text-yellow-600', bgGradient: 'from-yellow-50 to-orange-50' },
    { id: 'contentment-create', title: '创作记录', description: '用照片、文字或画作记录这份美好的感觉', duration: '15分钟', color: 'text-yellow-600', bgGradient: 'from-yellow-50 to-lime-50' }
  ],
  joy: [
    { id: 'joy-gratitude', title: '感恩记录', description: '写下3件让你开心的事，细细品味这份喜悦', duration: '5分钟', color: 'text-amber-500', bgGradient: 'from-amber-50 to-yellow-50' },
    { id: 'joy-share', title: '分享快乐', description: '给在乎的人发条消息，分享你的好心情', duration: '5分钟', color: 'text-amber-500', bgGradient: 'from-amber-50 to-orange-50' },
    { id: 'joy-dance', title: '随心舞动', description: '放一首喜欢的歌，跟着节奏自由舞动身体', duration: '10分钟', color: 'text-amber-500', bgGradient: 'from-amber-50 to-pink-50' }
  ],
  delight: [
    { id: 'delight-embrace', title: '拥抱美好', description: '张开双臂，让这份喜悦在身体里流动', duration: '3分钟', color: 'text-orange-500', bgGradient: 'from-orange-50 to-amber-50' },
    { id: 'delight-connect', title: '传递温暖', description: '给爱的人一个拥抱或发一条温暖的消息', duration: '5分钟', color: 'text-orange-500', bgGradient: 'from-orange-50 to-rose-50' },
    { id: 'delight-celebrate', title: '小小庆祝', description: '用一个小仪式庆祝这份喜悦，哪怕只是一块巧克力', duration: '10分钟', color: 'text-orange-500', bgGradient: 'from-orange-50 to-red-50' }
  ],
  excitement: [
    { id: 'excitement-channel', title: '能量引导', description: '把这股兴奋能量投入到具体的行动中', duration: '15分钟', color: 'text-orange-600', bgGradient: 'from-orange-50 to-amber-50' },
    { id: 'excitement-plan', title: '愿景规划', description: '写下你期待的事情，规划如何让它们实现', duration: '15分钟', color: 'text-orange-600', bgGradient: 'from-orange-50 to-yellow-50' },
    { id: 'excitement-ground', title: '适度落地', description: '做几次深呼吸，保持兴奋但不过度消耗', duration: '5分钟', color: 'text-orange-600', bgGradient: 'from-orange-50 to-red-50' }
  ],
  // === 正面社会/认知区 ===
  cherish: [
    { id: 'cherish-express', title: '表达珍爱', description: '对你珍爱的人或物表达你的珍惜之情', duration: '5分钟', color: 'text-pink-500', bgGradient: 'from-pink-50 to-rose-50' },
    { id: 'cherish-memory', title: '珍藏回忆', description: '整理一张照片或一件小物，回忆珍贵时刻', duration: '10分钟', color: 'text-pink-500', bgGradient: 'from-pink-50 to-purple-50' },
    { id: 'cherish-care', title: '温柔呵护', description: '用行动照顾你珍爱的事物', duration: '15分钟', color: 'text-pink-500', bgGradient: 'from-pink-50 to-fuchsia-50' }
  ],
  appreciation: [
    { id: 'appreciation-observe', title: '发现美好', description: '用5分钟观察身边的美，无论大小', duration: '5分钟', color: 'text-green-500', bgGradient: 'from-green-50 to-emerald-50' },
    { id: 'appreciation-art', title: '艺术欣赏', description: '欣赏一幅画、一首歌或一段文字', duration: '15分钟', color: 'text-green-500', bgGradient: 'from-green-50 to-teal-50' },
    { id: 'appreciation-share', title: '分享美好', description: '把你发现的美分享给他人', duration: '5分钟', color: 'text-green-500', bgGradient: 'from-green-50 to-lime-50' }
  ],
  optimism: [
    { id: 'optimism-vision', title: '积极想象', description: '闭上眼睛，生动想象美好的未来场景', duration: '10分钟', color: 'text-yellow-500', bgGradient: 'from-yellow-50 to-amber-50' },
    { id: 'optimism-affirm', title: '积极肯定', description: '对自己说3句积极的话，相信美好的可能', duration: '3分钟', color: 'text-yellow-500', bgGradient: 'from-yellow-50 to-orange-50' },
    { id: 'optimism-action', title: '小步前进', description: '为美好的未来做一个小小的行动', duration: '10分钟', color: 'text-yellow-500', bgGradient: 'from-yellow-50 to-lime-50' }
  ],
  pride: [
    { id: 'pride-acknowledge', title: '认可自己', description: '对自己说"我做得很好，我值得骄傲"', duration: '3分钟', color: 'text-purple-500', bgGradient: 'from-purple-50 to-violet-50' },
    { id: 'pride-record', title: '成就记录', description: '把这次成就写下来，成为你的力量源泉', duration: '10分钟', color: 'text-purple-500', bgGradient: 'from-purple-50 to-fuchsia-50' },
    { id: 'pride-share', title: '适度分享', description: '和信任的人分享你的成就', duration: '10分钟', color: 'text-purple-500', bgGradient: 'from-purple-50 to-indigo-50' }
  ],
  gratitude: [
    { id: 'gratitude-list', title: '感恩清单', description: '写下今天让你感激的3件事', duration: '5分钟', color: 'text-green-400', bgGradient: 'from-green-50 to-emerald-50' },
    { id: 'gratitude-letter', title: '感谢信', description: '写一条感谢消息给帮助过你的人', duration: '10分钟', color: 'text-green-400', bgGradient: 'from-green-50 to-teal-50' },
    { id: 'gratitude-feel', title: '感受温暖', description: '闭上眼睛，让感激的温暖在心中流淌', duration: '5分钟', color: 'text-green-400', bgGradient: 'from-green-50 to-lime-50' }
  ],
  curiosity: [
    { id: 'curiosity-explore', title: '探索新知', description: '花15分钟了解一个新话题', duration: '15分钟', color: 'text-amber-400', bgGradient: 'from-amber-50 to-yellow-50' },
    { id: 'curiosity-ask', title: '提出问题', description: '写下你想了解的问题，寻找答案', duration: '10分钟', color: 'text-amber-400', bgGradient: 'from-amber-50 to-orange-50' },
    { id: 'curiosity-try', title: '小试牛刀', description: '尝试一件从未做过的小事', duration: '15分钟', color: 'text-amber-400', bgGradient: 'from-amber-50 to-lime-50' }
  ],
  // === 中性混合区 ===
  relieved: [
    { id: 'relieved-exhale', title: '深呼气', description: '做3次深长的呼气，释放所有紧张', duration: '3分钟', color: 'text-emerald-500', bgGradient: 'from-emerald-50 to-green-50' },
    { id: 'relieved-rest', title: '放松休息', description: '允许自己休息，你已经做得够好了', duration: '15分钟', color: 'text-emerald-500', bgGradient: 'from-emerald-50 to-teal-50' },
    { id: 'relieved-reflect', title: '回顾成长', description: '想想这段经历教会了你什么', duration: '10分钟', color: 'text-emerald-500', bgGradient: 'from-emerald-50 to-cyan-50' }
  ],
  nostalgia: [
    { id: 'nostalgia-memory', title: '温柔回忆', description: '允许自己沉浸在美好的回忆中', duration: '10分钟', color: 'text-stone-500', bgGradient: 'from-stone-50 to-gray-50' },
    { id: 'nostalgia-photo', title: '翻看照片', description: '看看旧照片，感受时光的温度', duration: '15分钟', color: 'text-stone-500', bgGradient: 'from-stone-50 to-amber-50' },
    { id: 'nostalgia-write', title: '记录回忆', description: '写下这段回忆，让它成为永恒', duration: '10分钟', color: 'text-stone-500', bgGradient: 'from-stone-50 to-orange-50' }
  ],
  surprise: [
    { id: 'surprise-pause', title: '暂停反应', description: '给自己一点时间消化这个意外', duration: '3分钟', color: 'text-violet-500', bgGradient: 'from-violet-50 to-purple-50' },
    { id: 'surprise-breathe', title: '平稳呼吸', description: '做几次深呼吸，让心跳平稳下来', duration: '5分钟', color: 'text-violet-500', bgGradient: 'from-violet-50 to-indigo-50' },
    { id: 'surprise-process', title: '理清思路', description: '写下发生了什么，以及你可以怎么做', duration: '10分钟', color: 'text-violet-500', bgGradient: 'from-violet-50 to-fuchsia-50' }
  ],
  anticipation: [
    { id: 'anticipation-planning', title: '愿景规划', description: '写下你期待的事情，规划如何让它们实现', duration: '15分钟', color: 'text-lime-500', bgGradient: 'from-lime-50 to-green-50' },
    { id: 'anticipation-visualization', title: '积极想象', description: '闭上眼睛，生动想象期待之事成真的场景', duration: '10分钟', color: 'text-lime-500', bgGradient: 'from-lime-50 to-emerald-50' },
    { id: 'anticipation-prepare', title: '准备行动', description: '为期待的事情做一个小准备，让期待更加具体', duration: '15分钟', color: 'text-lime-500', bgGradient: 'from-lime-50 to-teal-50' }
  ],
  awe: [
    { id: 'awe-presence', title: '全然临在', description: '放下手机，全身心感受这一刻的震撼', duration: '10分钟', color: 'text-blue-400', bgGradient: 'from-blue-50 to-indigo-50' },
    { id: 'awe-nature', title: '自然连接', description: '到户外感受大自然的宏大', duration: '20分钟', color: 'text-blue-400', bgGradient: 'from-blue-50 to-cyan-50' },
    { id: 'awe-record', title: '记录震撼', description: '用文字或照片记录这份触动', duration: '10分钟', color: 'text-blue-400', bgGradient: 'from-blue-50 to-violet-50' }
  ],
  confusion: [
    { id: 'confusion-clarity', title: '信息整理', description: '把困惑的问题写下来，逐条分析', duration: '15分钟', color: 'text-gray-500', bgGradient: 'from-gray-50 to-slate-50' },
    { id: 'confusion-ask', title: '寻求帮助', description: '向信任的人或专家请教', duration: '10分钟', color: 'text-gray-500', bgGradient: 'from-gray-50 to-blue-50' },
    { id: 'confusion-pause', title: '暂停思考', description: '暂时放下，答案会在合适的时候浮现', duration: '5分钟', color: 'text-gray-500', bgGradient: 'from-gray-50 to-indigo-50' }
  ],
  // === 轻微负面区 ===
  melancholy: [
    { id: 'melancholy-feel', title: '允许感受', description: '允许自己感受这份淡淡的忧伤', duration: '10分钟', color: 'text-indigo-400', bgGradient: 'from-indigo-50 to-blue-50' },
    { id: 'melancholy-music', title: '治愈音乐', description: '听一首能共鸣你情绪的歌曲', duration: '15分钟', color: 'text-indigo-400', bgGradient: 'from-indigo-50 to-violet-50' },
    { id: 'melancholy-warmth', title: '温暖疗愈', description: '泡一杯热茶，裹上毛毯，给自己温暖', duration: '15分钟', color: 'text-indigo-400', bgGradient: 'from-indigo-50 to-purple-50' }
  ],
  lost: [
    { id: 'lost-pause', title: '暂停脚步', description: '你不需要马上找到答案，先停下来', duration: '5分钟', color: 'text-slate-500', bgGradient: 'from-slate-50 to-gray-50' },
    { id: 'lost-values', title: '回归价值', description: '写下对你真正重要的3件事', duration: '10分钟', color: 'text-slate-500', bgGradient: 'from-slate-50 to-blue-50' },
    { id: 'lost-small', title: '小步尝试', description: '不需要看清整条路，先迈出一步', duration: '15分钟', color: 'text-slate-500', bgGradient: 'from-slate-50 to-indigo-50' }
  ],
  hesitation: [
    { id: 'hesitation-procon', title: '利弊分析', description: '写下选择的利弊，让思路更清晰', duration: '10分钟', color: 'text-stone-500', bgGradient: 'from-stone-50 to-gray-50' },
    { id: 'hesitation-deadline', title: '设定时限', description: '给自己一个决定的截止时间', duration: '5分钟', color: 'text-stone-500', bgGradient: 'from-stone-50 to-amber-50' },
    { id: 'hesitation-trust', title: '信任直觉', description: '闭上眼睛，听听内心真正的声音', duration: '5分钟', color: 'text-stone-500', bgGradient: 'from-stone-50 to-orange-50' }
  ],
  unease: [
    { id: 'unease-ground', title: '落地练习', description: '感受双脚踩在地上的稳定感', duration: '3分钟', color: 'text-purple-400', bgGradient: 'from-purple-50 to-violet-50' },
    { id: 'unease-breathe', title: '稳定呼吸', description: '做5次深长的呼吸，让心跳平稳', duration: '5分钟', color: 'text-purple-400', bgGradient: 'from-purple-50 to-indigo-50' },
    { id: 'unease-prepare', title: '做好准备', description: '写下你能控制的部分，放下不能控制的', duration: '10分钟', color: 'text-purple-400', bgGradient: 'from-purple-50 to-fuchsia-50' }
  ],
  anxiety: [
    { id: 'anxiety-breathing', title: '深呼吸练习', description: '尝试4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒', duration: '3分钟', color: 'text-rose-500', bgGradient: 'from-rose-50 to-pink-50' },
    { id: 'anxiety-grounding', title: '五感落地', description: '说出5样能看到、4样能听到、3样能摸到、2样能闻到、1样能尝到的', duration: '5分钟', color: 'text-rose-500', bgGradient: 'from-rose-50 to-orange-50' },
    { id: 'anxiety-walk', title: '轻度散步', description: '到户外慢走10分钟，专注于脚步和周围的声音', duration: '10分钟', color: 'text-rose-500', bgGradient: 'from-rose-50 to-red-50' }
  ],
  conflict: [
    { id: 'conflict-identify', title: '识别冲突', description: '写下内心拉扯的两种力量是什么', duration: '10分钟', color: 'text-amber-700', bgGradient: 'from-amber-50 to-orange-50' },
    { id: 'conflict-feel', title: '感受双方', description: '分别站在两个角度感受，理解每一方的需求', duration: '15分钟', color: 'text-amber-700', bgGradient: 'from-amber-50 to-yellow-50' },
    { id: 'conflict-accept', title: '接纳矛盾', description: '冲突是理解自己的开始，不必急于消除', duration: '5分钟', color: 'text-amber-700', bgGradient: 'from-amber-50 to-red-50' }
  ],
  // === 中度负面区 ===
  boredom: [
    { id: 'boredom-pause', title: '允许暂停', description: '你可以暂停一下，不必时刻保持高效', duration: '5分钟', color: 'text-stone-600', bgGradient: 'from-stone-50 to-gray-50' },
    { id: 'boredom-new', title: '尝试新事', description: '做一件从未做过的小事打破单调', duration: '15分钟', color: 'text-stone-600', bgGradient: 'from-stone-50 to-amber-50' },
    { id: 'boredom-reflect', title: '反思需求', description: '厌倦背后可能是什么需求没被满足？', duration: '10分钟', color: 'text-stone-600', bgGradient: 'from-stone-50 to-orange-50' }
  ],
  loneliness: [
    { id: 'loneliness-connect', title: '主动连接', description: '给一个朋友发消息，哪怕只是问候', duration: '5分钟', color: 'text-blue-500', bgGradient: 'from-blue-50 to-indigo-50' },
    { id: 'loneliness-self', title: '陪伴自己', description: '对自己说"我在这里陪着你"', duration: '5分钟', color: 'text-blue-500', bgGradient: 'from-blue-50 to-cyan-50' },
    { id: 'loneliness-community', title: '寻找社群', description: '参加一个线上或线下的活动', duration: '20分钟', color: 'text-blue-500', bgGradient: 'from-blue-50 to-violet-50' }
  ],
  frustration: [
    { id: 'frustration-accept', title: '接纳挫折', description: '挫折是成长的一部分，你已经很努力了', duration: '5分钟', color: 'text-violet-600', bgGradient: 'from-violet-50 to-purple-50' },
    { id: 'frustration-adjust', title: '调整目标', description: '目标是否需要调整？小步前进更容易', duration: '10分钟', color: 'text-violet-600', bgGradient: 'from-violet-50 to-indigo-50' },
    { id: 'frustration-support', title: '寻求支持', description: '向信任的人倾诉，不要一个人扛', duration: '15分钟', color: 'text-violet-600', bgGradient: 'from-violet-50 to-fuchsia-50' }
  ],
  disappointment: [
    { id: 'disappointment-feel', title: '允许失望', description: '失望说明你曾真心期待，这是值得的', duration: '5分钟', color: 'text-gray-600', bgGradient: 'from-gray-50 to-slate-50' },
    { id: 'disappointment-grieve', title: '小小哀悼', description: '允许自己为落空的期待感到难过', duration: '10分钟', color: 'text-gray-600', bgGradient: 'from-gray-50 to-blue-50' },
    { id: 'disappointment-hope', title: '重新期待', description: '写下新的期待，生活总有惊喜', duration: '10分钟', color: 'text-gray-600', bgGradient: 'from-gray-50 to-indigo-50' }
  ],
  suppression: [
    { id: 'suppression-release', title: '安全释放', description: '找一个安全的空间，允许情绪流淌', duration: '10分钟', color: 'text-stone-700', bgGradient: 'from-stone-100 to-gray-100' },
    { id: 'suppression-express', title: '表达出来', description: '用书写、绘画或说话表达被压抑的感受', duration: '15分钟', color: 'text-stone-700', bgGradient: 'from-stone-100 to-amber-100' },
    { id: 'suppression-support', title: '寻求帮助', description: '你不需要一个人扛，找信任的人倾诉', duration: '15分钟', color: 'text-stone-700', bgGradient: 'from-stone-100 to-orange-100' }
  ],
  sadness: [
    { id: 'sadness-cry', title: '允许流泪', description: '眼泪是心灵的洗礼，哭出来会好一些', duration: '10分钟', color: 'text-blue-700', bgGradient: 'from-blue-50 to-indigo-50' },
    { id: 'sadness-comfort', title: '自我安抚', description: '给自己一个拥抱，你值得被温柔对待', duration: '5分钟', color: 'text-blue-700', bgGradient: 'from-blue-50 to-cyan-50' },
    { id: 'sadness-express', title: '表达悲伤', description: '写下或说出你的悲伤，让情绪流淌', duration: '15分钟', color: 'text-blue-700', bgGradient: 'from-blue-50 to-violet-50' }
  ],
  // === 深度负面区 ===
  numbness: [
    { id: 'numbness-gentle', title: '温柔对待', description: '麻木是保护机制，你值得被温柔对待', duration: '5分钟', color: 'text-gray-600', bgGradient: 'from-gray-100 to-slate-100' },
    { id: 'numbness-sense', title: '感官唤醒', description: '用冷水洗脸，或触摸不同质地的物品', duration: '5分钟', color: 'text-gray-600', bgGradient: 'from-gray-100 to-blue-100' },
    { id: 'numbness-small', title: '小小行动', description: '做一件很小的事，重新感受活着', duration: '10分钟', color: 'text-gray-600', bgGradient: 'from-gray-100 to-indigo-100' }
  ],
  emptiness: [
    { id: 'emptiness-fill', title: '填充意义', description: '做一件能给你带来微小意义感的事', duration: '15分钟', color: 'text-slate-600', bgGradient: 'from-slate-100 to-gray-100' },
    { id: 'emptiness-connect', title: '建立连接', description: '和一个人或一件事建立连接', duration: '15分钟', color: 'text-slate-600', bgGradient: 'from-slate-100 to-blue-100' },
    { id: 'emptiness-create', title: '创造价值', description: '创造一些东西，哪怕只是一个小手工', duration: '20分钟', color: 'text-slate-600', bgGradient: 'from-slate-100 to-indigo-100' }
  ],
  shame: [
    { id: 'shame-compassion', title: '自我慈悲', description: '对自己说"我接纳不完美的自己"', duration: '5分钟', color: 'text-red-700', bgGradient: 'from-red-50 to-rose-50' },
    { id: 'shame-share', title: '安全分享', description: '向信任的人分享，羞耻在分享中会减弱', duration: '15分钟', color: 'text-red-700', bgGradient: 'from-red-50 to-orange-50' },
    { id: 'shame-learn', title: '成长视角', description: '这是成长的机会，不是定义你的标签', duration: '10分钟', color: 'text-red-700', bgGradient: 'from-red-50 to-amber-50' }
  ],
  fear: [
    { id: 'fear-ground', title: '落地安全', description: '感受双脚踩在地上，你是安全的', duration: '3分钟', color: 'text-indigo-700', bgGradient: 'from-indigo-100 to-violet-100' },
    { id: 'fear-breathe', title: '平稳呼吸', description: '做深呼吸，让身体从恐惧反应中恢复', duration: '5分钟', color: 'text-indigo-700', bgGradient: 'from-indigo-100 to-blue-100' },
    { id: 'fear-support', title: '寻求支持', description: '恐惧时不要独自面对，寻求帮助', duration: '10分钟', color: 'text-indigo-700', bgGradient: 'from-indigo-100 to-purple-100' }
  ],
  pain: [
    { id: 'pain-gentle', title: '温柔照顾', description: '请温柔地照顾自己，你正在经历艰难', duration: '5分钟', color: 'text-red-800', bgGradient: 'from-red-100 to-rose-100' },
    { id: 'pain-express', title: '表达痛苦', description: '允许自己表达痛苦，不要压抑', duration: '15分钟', color: 'text-red-800', bgGradient: 'from-red-100 to-orange-100' },
    { id: 'pain-help', title: '寻求帮助', description: '痛苦不需要独自承受，请寻求专业帮助', duration: '10分钟', color: 'text-red-800', bgGradient: 'from-red-100 to-amber-100' }
  ],
  despair: [
    { id: 'despair-hope', title: '寻找微光', description: '哪怕最黑暗的时刻，也有微小的光', duration: '10分钟', color: 'text-gray-800', bgGradient: 'from-gray-200 to-slate-200' },
    { id: 'despair-support', title: '寻求支持', description: '你值得被支持与陪伴，请联系信任的人或专业机构', duration: '15分钟', color: 'text-gray-800', bgGradient: 'from-gray-200 to-blue-200' },
    { id: 'despair-small', title: '微小行动', description: '只关注眼前这一刻，不需要看到未来', duration: '5分钟', color: 'text-gray-800', bgGradient: 'from-gray-200 to-indigo-200' }
  ]
};

// 获取活动推荐
export const getActivities = (moodId: string, sceneId?: string): Activity[] => {
  if (sceneId && sceneActivities[sceneId]) {
    const sceneActs = sceneActivities[sceneId];
    const moodActs = moodActivityDatabase[moodId] || moodActivityDatabase.serenity;
    const combined = [...sceneActs];
    moodActs.forEach(act => {
      if (!combined.find(a => a.duration === act.duration)) {
        combined.push(act);
      }
    });
    return combined.slice(0, 4);
  }
  return moodActivityDatabase[moodId] || moodActivityDatabase.serenity;
};

// 通用励志语录
export const inspirationalQuotes = [
  { text: '每一次情绪的波动，都是内心在与你对话', author: 'MoodFlow' },
  { text: '允许自己感受，是治愈的开始', author: 'MoodFlow' },
  { text: '今天的你，已经很棒了', author: 'MoodFlow' },
  { text: '情绪没有好坏，只有来了又去的流动', author: 'MoodFlow' },
  { text: '关爱自己，从记录情绪开始', author: 'MoodFlow' },
  { text: '每一种情绪，都值得被温柔对待', author: 'MoodFlow' },
  { text: '你比自己想象的更坚强', author: 'MoodFlow' },
  { text: '情绪是内心的天气，总会雨过天晴', author: 'MoodFlow' },
];

// 36种情绪心语库
export const moodQuotes: Record<string, { text: string; author: string }[]> = {
  serenity: [
    { text: '宁静是最珍贵的状态，好好珍惜', author: 'MoodFlow' },
    { text: '此刻的你，与自己和解', author: 'MoodFlow' },
    { text: '内心的安宁，是最好的礼物', author: 'MoodFlow' },
    { text: '你找到了属于自己的节奏', author: 'MoodFlow' },
    { text: '在这份宁静中，你值得被温柔对待', author: 'MoodFlow' },
  ],
  relief: [
    { text: '你是被支持的，你很安全', author: 'MoodFlow' },
    { text: '放下担忧，此刻一切都好', author: 'MoodFlow' },
    { text: '有人守护的感觉，真好', author: 'MoodFlow' },
    { text: '你不需要独自承担一切', author: 'MoodFlow' },
    { text: '安心是内心最柔软的港湾', author: 'MoodFlow' },
  ],
  contentment: [
    { text: '知足是幸福的起点', author: 'MoodFlow' },
    { text: '你拥有的一切，都值得感恩', author: 'MoodFlow' },
    { text: '此刻的你，刚刚好', author: 'MoodFlow' },
    { text: '感恩让平凡的日子闪闪发光', author: 'MoodFlow' },
    { text: '内心的富足，胜过一切', author: 'MoodFlow' },
  ],
  joy: [
    { text: '享受这份快乐，这是你应得的', author: 'MoodFlow' },
    { text: '你的笑容是这个世界的美好', author: 'MoodFlow' },
    { text: '快乐会传染，分享给你的身边人', author: 'MoodFlow' },
    { text: '记住此刻的感受，它是你的力量源泉', author: 'MoodFlow' },
    { text: '你值得拥有所有的美好', author: 'MoodFlow' },
  ],
  delight: [
    { text: '这份喜悦，是生命给你的礼物', author: 'MoodFlow' },
    { text: '让喜悦在心中流淌，温暖每一个角落', author: 'MoodFlow' },
    { text: '你被爱着，也被这个世界温柔以待', author: 'MoodFlow' },
    { text: '喜悦时刻，值得被铭记', author: 'MoodFlow' },
    { text: '你的心正在发光', author: 'MoodFlow' },
  ],
  excitement: [
    { text: '保持节奏，不过度消耗', author: 'MoodFlow' },
    { text: '美好的事情正在向你走来', author: 'MoodFlow' },
    { text: '期待是心灵的翅膀', author: 'MoodFlow' },
    { text: '相信美好的事情即将发生', author: 'MoodFlow' },
    { text: '这股能量会带你去更远的地方', author: 'MoodFlow' },
  ],
  cherish: [
    { text: '珍惜让你柔软的东西', author: 'MoodFlow' },
    { text: '珍贵的事物，值得被温柔呵护', author: 'MoodFlow' },
    { text: '你懂得珍惜，这本身就是一种幸福', author: 'MoodFlow' },
    { text: '珍爱是心最温暖的模样', author: 'MoodFlow' },
    { text: '让珍爱成为你前行的力量', author: 'MoodFlow' },
  ],
  appreciation: [
    { text: '保持对美的敏感', author: 'MoodFlow' },
    { text: '美无处不在，只需要一双发现的眼睛', author: 'MoodFlow' },
    { text: '欣赏是一种能力，也是一种幸福', author: 'MoodFlow' },
    { text: '你看到了美好，美好也会看到你', author: 'MoodFlow' },
    { text: '欣赏让生命更加丰盈', author: 'MoodFlow' },
  ],
  optimism: [
    { text: '你的希望很有力量', author: 'MoodFlow' },
    { text: '相信美好的可能', author: 'MoodFlow' },
    { text: '带着希望前行，路会越走越宽', author: 'MoodFlow' },
    { text: '乐观是一种选择，也是一种智慧', author: 'MoodFlow' },
    { text: '未来比你想象的更美好', author: 'MoodFlow' },
  ],
  pride: [
    { text: '你值得为自己骄傲', author: 'MoodFlow' },
    { text: '这是你努力的成果，好好享受', author: 'MoodFlow' },
    { text: '你的成就是实力的证明', author: 'MoodFlow' },
    { text: '为自己鼓掌，你做到了', author: 'MoodFlow' },
    { text: '这份骄傲，是你应得的', author: 'MoodFlow' },
  ],
  gratitude: [
    { text: '感激让关系更靠近', author: 'MoodFlow' },
    { text: '感恩的心，是最富有的心', author: 'MoodFlow' },
    { text: '被善意触动，也去触动他人', author: 'MoodFlow' },
    { text: '感激是爱的另一种表达', author: 'MoodFlow' },
    { text: '让感激成为习惯', author: 'MoodFlow' },
  ],
  curiosity: [
    { text: '保持探索但不必急', author: 'MoodFlow' },
    { text: '好奇心是成长的动力', author: 'MoodFlow' },
    { text: '每一个问题都是一扇门', author: 'MoodFlow' },
    { text: '探索未知，发现惊喜', author: 'MoodFlow' },
    { text: '保持好奇，保持年轻', author: 'MoodFlow' },
  ],
  relieved: [
    { text: '你已经做得够好了', author: 'MoodFlow' },
    { text: '放下负担，轻装前行', author: 'MoodFlow' },
    { text: '这一刻，你可以休息了', author: 'MoodFlow' },
    { text: '释然是另一种获得', author: 'MoodFlow' },
    { text: '让肩膀下沉，让心自由', author: 'MoodFlow' },
  ],
  nostalgia: [
    { text: '允许自己温柔地想念', author: 'MoodFlow' },
    { text: '这种柔软的伤感也值得被看见', author: 'MoodFlow' },
    { text: '回忆是时光给我们的礼物', author: 'MoodFlow' },
    { text: '怀念说明你曾经拥有美好', author: 'MoodFlow' },
    { text: '过去的温暖，会在未来照亮你', author: 'MoodFlow' },
  ],
  surprise: [
    { text: '给自己一点时间反应', author: 'MoodFlow' },
    { text: '意外是生活的调味剂', author: 'MoodFlow' },
    { text: '惊喜或惊吓，都是体验', author: 'MoodFlow' },
    { text: '慢慢来，消化这个意外', author: 'MoodFlow' },
    { text: '生活总有想不到的转折', author: 'MoodFlow' },
  ],
  anticipation: [
    { text: '期待的过程，本身就是一种幸福', author: 'MoodFlow' },
    { text: '保持这份憧憬，它会成真', author: 'MoodFlow' },
    { text: '期待让生活充满色彩', author: 'MoodFlow' },
    { text: '你的期待，宇宙都听到了', author: 'MoodFlow' },
    { text: '美好的事情正在路上', author: 'MoodFlow' },
  ],
  awe: [
    { text: '让自己被世界触动', author: 'MoodFlow' },
    { text: '敬畏让你看到自己的渺小与伟大', author: 'MoodFlow' },
    { text: '在宏大面前，感受存在的意义', author: 'MoodFlow' },
    { text: '这一刻，你与宇宙连接', author: 'MoodFlow' },
    { text: '敬畏是心灵的升华', author: 'MoodFlow' },
  ],
  confusion: [
    { text: '慢一点，你会理清的', author: 'MoodFlow' },
    { text: '不确定是正常的，答案会浮现', author: 'MoodFlow' },
    { text: '怀疑是思考的开始，不是终点', author: 'MoodFlow' },
    { text: '迷茫时，先停下来听听内心', author: 'MoodFlow' },
    { text: '答案就在你心里，只是需要安静', author: 'MoodFlow' },
  ],
  melancholy: [
    { text: '这种柔软的伤感也值得被看见', author: 'MoodFlow' },
    { text: '淡淡的忧伤，也是一种美', author: 'MoodFlow' },
    { text: '惆怅是心灵的诗意', author: 'MoodFlow' },
    { text: '允许自己感受这份温柔', author: 'MoodFlow' },
    { text: '忧伤会过去，温柔会留下', author: 'MoodFlow' },
  ],
  lost: [
    { text: '你不需要马上找到答案', author: 'MoodFlow' },
    { text: '迷茫是转折期的必经之路', author: 'MoodFlow' },
    { text: '暂停一下，方向会慢慢清晰', author: 'MoodFlow' },
    { text: '每个人都有迷茫的时候', author: 'MoodFlow' },
    { text: '迷茫说明你在思考人生', author: 'MoodFlow' },
  ],
  hesitation: [
    { text: '不必急于确定，给自己时间', author: 'MoodFlow' },
    { text: '犹豫说明你在认真考虑', author: 'MoodFlow' },
    { text: '相信你的直觉，它很少出错', author: 'MoodFlow' },
    { text: '每个选择都有它的意义', author: 'MoodFlow' },
    { text: '犹豫是决策前的必经过程', author: 'MoodFlow' },
  ],
  unease: [
    { text: '紧张说明你在乎', author: 'MoodFlow' },
    { text: '深呼吸，你比你想象的更准备好', author: 'MoodFlow' },
    { text: '忐忑是正常的，你并不孤单', author: 'MoodFlow' },
    { text: '相信自己的能力', author: 'MoodFlow' },
    { text: '不安会过去，你会度过', author: 'MoodFlow' },
  ],
  anxiety: [
    { text: '你已经尽力了，慢慢来', author: 'MoodFlow' },
    { text: '焦虑是大脑在试图保护你', author: 'MoodFlow' },
    { text: '深呼吸，此刻你是安全的', author: 'MoodFlow' },
    { text: '把注意力带回当下，焦虑就会失去力量', author: 'MoodFlow' },
    { text: '你的担心90%都不会发生', author: 'MoodFlow' },
  ],
  conflict: [
    { text: '冲突是理解自己的开始', author: 'MoodFlow' },
    { text: '两种声音都值得被听见', author: 'MoodFlow' },
    { text: '矛盾说明你在认真思考', author: 'MoodFlow' },
    { text: '给自己一点时间理清', author: 'MoodFlow' },
    { text: '内耗是成长的阵痛', author: 'MoodFlow' },
  ],
  boredom: [
    { text: '你可以暂停一下', author: 'MoodFlow' },
    { text: '厌倦说明你需要新鲜感', author: 'MoodFlow' },
    { text: '休息一下，再重新出发', author: 'MoodFlow' },
    { text: '无聊也可以是创造的开始', author: 'MoodFlow' },
    { text: '允许自己什么都不做', author: 'MoodFlow' },
  ],
  loneliness: [
    { text: '你值得被看见', author: 'MoodFlow' },
    { text: '孤独是暂时的，连接会发生', author: 'MoodFlow' },
    { text: '你并不孤单，有人在乎你', author: 'MoodFlow' },
    { text: '孤独时，先学会陪伴自己', author: 'MoodFlow' },
    { text: '你的存在本身就是意义', author: 'MoodFlow' },
  ],
  frustration: [
    { text: '你已经很努力了', author: 'MoodFlow' },
    { text: '挫折是成长的必经之路', author: 'MoodFlow' },
    { text: '调整目标，小步前进', author: 'MoodFlow' },
    { text: '每一次跌倒都是站起来的机会', author: 'MoodFlow' },
    { text: '你比自己想象的更有韧性', author: 'MoodFlow' },
  ],
  disappointment: [
    { text: '失望说明你曾真心期待', author: 'MoodFlow' },
    { text: '允许自己难过，这是正常的', author: 'MoodFlow' },
    { text: '期待落空不代表未来无望', author: 'MoodFlow' },
    { text: '失望之后，新的希望会来', author: 'MoodFlow' },
    { text: '你的真心值得被回应', author: 'MoodFlow' },
  ],
  suppression: [
    { text: '你不需要一个人扛', author: 'MoodFlow' },
    { text: '压抑的情绪需要出口', author: 'MoodFlow' },
    { text: '找一个安全的空间释放', author: 'MoodFlow' },
    { text: '你的感受值得被表达', author: 'MoodFlow' },
    { text: '压抑是暂时的保护，不是长久之计', author: 'MoodFlow' },
  ],
  sadness: [
    { text: '悲伤是爱的另一种形状', author: 'MoodFlow' },
    { text: '眼泪是心灵的洗礼', author: 'MoodFlow' },
    { text: '允许自己悲伤，这是治愈的一部分', author: 'MoodFlow' },
    { text: '你的感受是真实的，值得被倾听', author: 'MoodFlow' },
    { text: '悲伤会过去，温柔会留下', author: 'MoodFlow' },
  ],
  numbness: [
    { text: '你值得被温柔对待', author: 'MoodFlow' },
    { text: '麻木是保护机制，不是你的错', author: 'MoodFlow' },
    { text: '慢慢来，重新感受活着', author: 'MoodFlow' },
    { text: '麻木之后，感受会回来', author: 'MoodFlow' },
    { text: '你值得被关心，被爱护', author: 'MoodFlow' },
  ],
  emptiness: [
    { text: '你并不孤单', author: 'MoodFlow' },
    { text: '空虚是暂时的，意义会找到', author: 'MoodFlow' },
    { text: '小小的行动可以填补空洞', author: 'MoodFlow' },
    { text: '你的存在本身就是意义', author: 'MoodFlow' },
    { text: '连接会让你重新感到充实', author: 'MoodFlow' },
  ],
  shame: [
    { text: '你值得被理解而不是责备', author: 'MoodFlow' },
    { text: '每个人都有不完美的地方', author: 'MoodFlow' },
    { text: '羞耻在分享中会减弱', author: 'MoodFlow' },
    { text: '接纳不完美的自己', author: 'MoodFlow' },
    { text: '你的价值不因错误而减少', author: 'MoodFlow' },
  ],
  fear: [
    { text: '恐惧是保护你的信号', author: 'MoodFlow' },
    { text: '深呼吸，你是安全的', author: 'MoodFlow' },
    { text: '恐惧时，不要独自面对', author: 'MoodFlow' },
    { text: '勇敢不是没有恐惧，而是带着恐惧前行', author: 'MoodFlow' },
    { text: '你比你想象的更强大', author: 'MoodFlow' },
  ],
  pain: [
    { text: '请温柔地照顾自己', author: 'MoodFlow' },
    { text: '痛苦不需要独自承受', author: 'MoodFlow' },
    { text: '你正在经历艰难，这会过去', author: 'MoodFlow' },
    { text: '寻求帮助是勇敢的表现', author: 'MoodFlow' },
    { text: '你值得被支持与关爱', author: 'MoodFlow' },
  ],
  despair: [
    { text: '你值得被支持与陪伴', author: 'MoodFlow' },
    { text: '哪怕最黑暗的时刻，也有微小的光', author: 'MoodFlow' },
    { text: '请不要放弃，有人愿意帮助你', author: 'MoodFlow' },
    { text: '这一刻会过去，未来会有不同', author: 'MoodFlow' },
    { text: '你的生命有价值，请寻求帮助', author: 'MoodFlow' },
  ],
};
