import type { Mood, Scene, Activity } from '@/types';

export const moods: Mood[] = [
  {
    id: 'anxiety',
    name: '焦虑',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    ringColor: 'ring-rose-300',
    icon: '😰',
    description: '内心不安，需要平静'
  },
  {
    id: 'melancholy',
    name: '忧郁',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    ringColor: 'ring-blue-300',
    icon: '😔',
    description: '淡淡的忧伤笼罩'
  },
  {
    id: 'happy',
    name: '快乐',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    ringColor: 'ring-yellow-300',
    icon: '😊',
    description: '心情愉悦，充满活力'
  },
  {
    id: 'regret',
    name: '懊悔',
    color: 'text-violet-600',
    bgColor: 'bg-violet-100',
    ringColor: 'ring-violet-300',
    icon: '😞',
    description: '为过去的事感到遗憾'
  },
  {
    id: 'calm',
    name: '平静',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    ringColor: 'ring-emerald-300',
    icon: '😌',
    description: '内心安宁，波澜不惊'
  },
  {
    id: 'anticipation',
    name: '期待',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    ringColor: 'ring-orange-300',
    icon: '🤩',
    description: '对未来充满憧憬'
  },
  {
    id: 'content',
    name: '满足',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    ringColor: 'ring-amber-300',
    icon: '😊',
    description: '知足常乐的状态'
  },
  {
    id: 'doubt',
    name: '怀疑',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    ringColor: 'ring-purple-300',
    icon: '🤔',
    description: '不确定，需要验证'
  },
  {
    id: 'stress',
    name: '压力',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    ringColor: 'ring-red-300',
    icon: '😫',
    description: '感到紧张和压迫'
  }
];

export const scenes: Scene[] = [
  {
    id: 'home',
    name: '居家',
    icon: '🏠',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    id: 'alone',
    name: '独处',
    icon: '🧘',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    id: 'work',
    name: '工作',
    icon: '💼',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50'
  },
  {
    id: 'commute',
    name: '通勤',
    icon: '🚌',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  },
  {
    id: 'love',
    name: '恋爱',
    icon: '💕',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  },
  {
    id: 'social',
    name: '社交',
    icon: '🎉',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  }
];

// 场景活动数据库 - 每种场景至少3个活动，符合情绪调节逻辑
export const sceneActivities: Record<string, Activity[]> = {
  // 居家场景 - 舒适、私密、放松
  home: [
    {
      id: 'home-cozy',
      title: '打造舒适角落',
      description: '整理一个专属放松角落，点上香薰，铺上柔软的毯子，营造安全感',
      duration: '10分钟',
      color: 'text-amber-600',
      bgGradient: 'from-amber-50 to-orange-50'
    },
    {
      id: 'home-tea',
      title: '居家茶疗',
      description: '泡一杯温热的花草茶，坐在窗边慢慢品味，观察窗外的景色',
      duration: '15分钟',
      color: 'text-amber-600',
      bgGradient: 'from-amber-50 to-yellow-50'
    },
    {
      id: 'home-bath',
      title: '温暖沐浴',
      description: '准备一次舒适的泡澡或淋浴，让热水冲刷疲惫，放松全身肌肉',
      duration: '20分钟',
      color: 'text-amber-600',
      bgGradient: 'from-amber-50 to-rose-50'
    },
    {
      id: 'home-journal',
      title: '情绪日记',
      description: '在安静的环境中写下今天的感受，不用修饰，让情绪自然流淌',
      duration: '10分钟',
      color: 'text-amber-600',
      bgGradient: 'from-amber-50 to-teal-50'
    }
  ],
  // 独处场景 - 自我觉察、内省、充电
  alone: [
    {
      id: 'alone-breathe',
      title: '正念呼吸',
      description: '找一个安静的地方，闭上眼睛，专注于呼吸的进出，觉察身体感受',
      duration: '10分钟',
      color: 'text-teal-600',
      bgGradient: 'from-teal-50 to-emerald-50'
    },
    {
      id: 'alone-meditation',
      title: '独处冥想',
      description: '播放轻音乐或自然声音，让思绪沉淀，享受与自我相处的宁静',
      duration: '15分钟',
      color: 'text-teal-600',
      bgGradient: 'from-teal-50 to-cyan-50'
    },
    {
      id: 'alone-walk',
      title: '独自漫步',
      description: '一个人慢慢走走，观察周围细节，让思绪随着脚步流动',
      duration: '20分钟',
      color: 'text-teal-600',
      bgGradient: 'from-teal-50 to-blue-50'
    },
    {
      id: 'alone-reflect',
      title: '自我对话',
      description: '对着镜子或闭上眼睛，温柔地和自己对话，倾听内心的声音',
      duration: '10分钟',
      color: 'text-teal-600',
      bgGradient: 'from-teal-50 to-indigo-50'
    }
  ],
  // 工作场景 - 高效、专注、减压
  work: [
    {
      id: 'work-stretch',
      title: '工位拉伸',
      description: '在座位上做一些简单的颈部、肩部和腰部拉伸，缓解身体紧张',
      duration: '5分钟',
      color: 'text-slate-600',
      bgGradient: 'from-slate-50 to-gray-50'
    },
    {
      id: 'work-pomodoro',
      title: '番茄工作法',
      description: '设定25分钟专注时间，然后休息5分钟，提高工作效率',
      duration: '30分钟',
      color: 'text-slate-600',
      bgGradient: 'from-slate-50 to-blue-50'
    },
    {
      id: 'work-organize',
      title: '桌面整理',
      description: '花几分钟整理工作桌面，清理杂物，让环境更清爽有序',
      duration: '10分钟',
      color: 'text-slate-600',
      bgGradient: 'from-slate-50 to-teal-50'
    },
    {
      id: 'work-break',
      title: '短暂离席',
      description: '离开工位，去茶水间或窗边站一会儿，让大脑短暂休息',
      duration: '5分钟',
      color: 'text-slate-600',
      bgGradient: 'from-slate-50 to-indigo-50'
    }
  ],
  // 通勤场景 - 过渡、放松、准备
  commute: [
    {
      id: 'commute-music',
      title: '音乐疗愈',
      description: '戴上耳机，听喜欢的音乐或播客，让通勤时间成为放松时刻',
      duration: '15分钟',
      color: 'text-cyan-600',
      bgGradient: 'from-cyan-50 to-blue-50'
    },
    {
      id: 'commute-observe',
      title: '观察练习',
      description: '看着窗外的风景或周围的人，不做评判，只是观察当下',
      duration: '10分钟',
      color: 'text-cyan-600',
      bgGradient: 'from-cyan-50 to-teal-50'
    },
    {
      id: 'commute-breathe',
      title: '通勤呼吸',
      description: '利用通勤时间做深呼吸练习，4-7-8呼吸法帮助平静心情',
      duration: '5分钟',
      color: 'text-cyan-600',
      bgGradient: 'from-cyan-50 to-emerald-50'
    },
    {
      id: 'commute-plan',
      title: '日程预演',
      description: '在脑海中预演今天的安排，为即将到来的事情做好心理准备',
      duration: '5分钟',
      color: 'text-cyan-600',
      bgGradient: 'from-cyan-50 to-indigo-50'
    }
  ],
  // 恋爱场景 - 亲密、沟通、温暖
  love: [
    {
      id: 'love-message',
      title: '甜蜜留言',
      description: '给对方发一条表达爱意或感谢的消息，分享此刻的心情',
      duration: '3分钟',
      color: 'text-pink-600',
      bgGradient: 'from-pink-50 to-rose-50'
    },
    {
      id: 'love-memory',
      title: '回忆美好',
      description: '翻看两人的照片或回忆美好的共同经历，感受爱的温暖',
      duration: '10分钟',
      color: 'text-pink-600',
      bgGradient: 'from-pink-50 to-purple-50'
    },
    {
      id: 'love-plan',
      title: '约会计划',
      description: '计划一次特别的约会或活动，为关系注入新鲜感和期待',
      duration: '10分钟',
      color: 'text-pink-600',
      bgGradient: 'from-pink-50 to-orange-50'
    },
    {
      id: 'love-gratitude',
      title: '感恩伴侣',
      description: '写下伴侣让你感激的3件事，体会被爱和爱人的幸福',
      duration: '5分钟',
      color: 'text-pink-600',
      bgGradient: 'from-pink-50 to-red-50'
    }
  ],
  // 社交场景 - 连接、互动、能量
  social: [
    {
      id: 'social-connect',
      title: '深度交流',
      description: '和身边的人进行一次真诚的对话，分享感受，倾听对方',
      duration: '15分钟',
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-50 to-purple-50'
    },
    {
      id: 'social-laugh',
      title: '寻找欢乐',
      description: '和朋友一起看搞笑视频或分享趣事，让笑声释放压力',
      duration: '10分钟',
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-50 to-blue-50'
    },
    {
      id: 'social-support',
      title: '互相支持',
      description: '向朋友表达关心，或寻求朋友的支持，感受人际连接的力量',
      duration: '10分钟',
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-50 to-pink-50'
    },
    {
      id: 'social-boundary',
      title: '设定界限',
      description: '如果感到疲惫，学会礼貌地暂时退出社交，给自己充电时间',
      duration: '5分钟',
      color: 'text-indigo-600',
      bgGradient: 'from-indigo-50 to-slate-50'
    }
  ]
};

// 情绪+场景组合活动数据库 - 更精准的推荐
export const getActivities = (moodId: string, sceneId?: string): Activity[] => {
  // 基础情绪活动库
  const moodActivityDatabase: Record<string, Activity[]> = {
    anxiety: [
      {
        id: 'anxiety-breathing',
        title: '深呼吸练习',
        description: '尝试4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒，重复5次',
        duration: '3分钟',
        color: 'text-rose-600',
        bgGradient: 'from-rose-50 to-pink-50'
      },
      {
        id: 'anxiety-grounding',
        title: '五感 grounding',
        description: '说出5样能看到、4样能听到、3样能摸到、2样能闻到、1样能尝到的',
        duration: '5分钟',
        color: 'text-rose-600',
        bgGradient: 'from-rose-50 to-orange-50'
      },
      {
        id: 'anxiety-walk',
        title: '轻度散步',
        description: '到户外慢走10分钟，专注于脚步和周围的自然声音',
        duration: '10分钟',
        color: 'text-rose-600',
        bgGradient: 'from-rose-50 to-red-50'
      }
    ],
    melancholy: [
      {
        id: 'melancholy-journaling',
        title: '情绪日记',
        description: '写下此刻的感受，不用修饰，让情绪自然流淌到纸上',
        duration: '10分钟',
        color: 'text-blue-600',
        bgGradient: 'from-blue-50 to-indigo-50'
      },
      {
        id: 'melancholy-music',
        title: '治愈音乐',
        description: '听一首能共鸣你情绪的歌曲，允许自己感受这份忧伤',
        duration: '15分钟',
        color: 'text-blue-600',
        bgGradient: 'from-blue-50 to-cyan-50'
      },
      {
        id: 'melancholy-warmth',
        title: '温暖疗愈',
        description: '泡一杯热茶或热可可，裹上毛毯，给自己一个拥抱',
        duration: '15分钟',
        color: 'text-blue-600',
        bgGradient: 'from-blue-50 to-slate-50'
      }
    ],
    happy: [
      {
        id: 'happy-gratitude',
        title: '感恩记录',
        description: '写下3件让你开心的事，细细品味这份喜悦',
        duration: '5分钟',
        color: 'text-yellow-600',
        bgGradient: 'from-yellow-50 to-amber-50'
      },
      {
        id: 'happy-share',
        title: '分享快乐',
        description: '给在乎的人发条消息，分享你的好心情',
        duration: '5分钟',
        color: 'text-yellow-600',
        bgGradient: 'from-yellow-50 to-orange-50'
      },
      {
        id: 'happy-dance',
        title: '随心舞动',
        description: '放一首喜欢的歌，跟着节奏自由舞动身体',
        duration: '10分钟',
        color: 'text-yellow-600',
        bgGradient: 'from-yellow-50 to-lime-50'
      }
    ],
    regret: [
      {
        id: 'regret-compassion',
        title: '自我宽恕',
        description: '对自己说："我已经尽力了，我允许自己犯错，我在成长"',
        duration: '5分钟',
        color: 'text-violet-600',
        bgGradient: 'from-violet-50 to-purple-50'
      },
      {
        id: 'regret-lesson',
        title: '经验提取',
        description: '写下这件事教会了你什么，未来可以如何做得更好',
        duration: '10分钟',
        color: 'text-violet-600',
        bgGradient: 'from-violet-50 to-fuchsia-50'
      },
      {
        id: 'regret-action',
        title: '补救行动',
        description: '如果可能，写下你可以采取的一个小小补救措施',
        duration: '10分钟',
        color: 'text-violet-600',
        bgGradient: 'from-violet-50 to-indigo-50'
      }
    ],
    calm: [
      {
        id: 'calm-meditation',
        title: '冥想深化',
        description: '闭上眼睛，专注于呼吸，让平静更加深入',
        duration: '10分钟',
        color: 'text-emerald-600',
        bgGradient: 'from-emerald-50 to-teal-50'
      },
      {
        id: 'calm-nature',
        title: '自然连接',
        description: '望向窗外或到户外，观察自然界的细节之美',
        duration: '10分钟',
        color: 'text-emerald-600',
        bgGradient: 'from-emerald-50 to-green-50'
      },
      {
        id: 'calm-reading',
        title: '静心阅读',
        description: '读几页喜欢的书，享受这份宁静时光',
        duration: '20分钟',
        color: 'text-emerald-600',
        bgGradient: 'from-emerald-50 to-cyan-50'
      }
    ],
    anticipation: [
      {
        id: 'anticipation-planning',
        title: '愿景规划',
        description: '写下你期待的事情，规划如何让它们实现',
        duration: '15分钟',
        color: 'text-orange-600',
        bgGradient: 'from-orange-50 to-amber-50'
      },
      {
        id: 'anticipation-visualization',
        title: '积极想象',
        description: '闭上眼睛，生动想象期待之事成真的场景',
        duration: '10分钟',
        color: 'text-orange-600',
        bgGradient: 'from-orange-50 to-yellow-50'
      },
      {
        id: 'anticipation-prepare',
        title: '准备行动',
        description: '为期待的事情做一个小准备，让期待更加具体',
        duration: '15分钟',
        color: 'text-orange-600',
        bgGradient: 'from-orange-50 to-red-50'
      }
    ],
    content: [
      {
        id: 'content-savor',
        title: '品味当下',
        description: '闭上眼睛，深呼吸， fully 感受这份满足感',
        duration: '3分钟',
        color: 'text-amber-600',
        bgGradient: 'from-amber-50 to-yellow-50'
      },
      {
        id: 'content-appreciate',
        title: '欣赏拥有',
        description: '列出5件你感恩拥有的事物，感受内心的富足',
        duration: '5分钟',
        color: 'text-amber-600',
        bgGradient: 'from-amber-50 to-orange-50'
      },
      {
        id: 'content-create',
        title: '创作记录',
        description: '用照片、文字或画作记录这份美好的感觉',
        duration: '15分钟',
        color: 'text-amber-600',
        bgGradient: 'from-amber-50 to-lime-50'
      }
    ],
    doubt: [
      {
        id: 'doubt-research',
        title: '信息收集',
        description: '列出你的疑问，寻找可靠的信息来源来验证',
        duration: '20分钟',
        color: 'text-purple-600',
        bgGradient: 'from-purple-50 to-violet-50'
      },
      {
        id: 'doubt-procon',
        title: '利弊分析',
        description: '写下这件事的利弊清单，让思路更清晰',
        duration: '10分钟',
        color: 'text-purple-600',
        bgGradient: 'from-purple-50 to-fuchsia-50'
      },
      {
        id: 'doubt-consult',
        title: '寻求建议',
        description: '向信任的朋友或专家请教，获取不同视角',
        duration: '15分钟',
        color: 'text-purple-600',
        bgGradient: 'from-purple-50 to-indigo-50'
      }
    ],
    stress: [
      {
        id: 'stress-stretch',
        title: '身体舒展',
        description: '做5分钟的简单拉伸，释放身体的紧张感',
        duration: '5分钟',
        color: 'text-red-600',
        bgGradient: 'from-red-50 to-rose-50'
      },
      {
        id: 'stress-breakdown',
        title: '任务分解',
        description: '把让你压力大的事拆成3个小步骤，从最简单的开始',
        duration: '10分钟',
        color: 'text-red-600',
        bgGradient: 'from-red-50 to-orange-50'
      },
      {
        id: 'stress-shower',
        title: '热水沐浴',
        description: '洗个热水澡，让水流带走压力和疲惫',
        duration: '15分钟',
        color: 'text-red-600',
        bgGradient: 'from-red-50 to-pink-50'
      }
    ]
  };

  // 如果有场景ID，混合场景活动和情绪活动
  if (sceneId && sceneActivities[sceneId]) {
    const sceneActs = sceneActivities[sceneId];
    const moodActs = moodActivityDatabase[moodId] || moodActivityDatabase.calm;
    
    // 合并场景活动和情绪活动，优先场景活动
    const combined = [...sceneActs];
    
    // 添加情绪专属活动（避免重复）
    moodActs.forEach(act => {
      if (!combined.find(a => a.duration === act.duration)) {
        combined.push(act);
      }
    });
    
    return combined.slice(0, 4);
  }

  return moodActivityDatabase[moodId] || moodActivityDatabase.calm;
};

// Inspirational quotes for sharing - 按情绪分类
export const inspirationalQuotes = [
  // 通用语录
  { text: '每一次情绪的波动，都是内心在与你对话', author: 'MoodFlow' },
  { text: '允许自己感受，是治愈的开始', author: 'MoodFlow' },
  { text: '今天的你，已经很棒了', author: 'MoodFlow' },
  { text: '情绪没有好坏，只有来了又去的流动', author: 'MoodFlow' },
  { text: '关爱自己，从记录情绪开始', author: 'MoodFlow' },
  { text: '每一种情绪，都值得被温柔对待', author: 'MoodFlow' },
  { text: '你比自己想象的更坚强', author: 'MoodFlow' },
  { text: '情绪是内心的天气，总会雨过天晴', author: 'MoodFlow' },
];

// 按情绪分类的心语库
export const moodQuotes: Record<string, { text: string; author: string }[]> = {
  // 焦虑 - 8条
  anxiety: [
    { text: '焦虑是大脑在试图保护你，试着对它说声谢谢', author: 'MoodFlow' },
    { text: '深呼吸，此刻你是安全的，焦虑会过去', author: 'MoodFlow' },
    { text: '把注意力带回当下，焦虑就会失去力量', author: 'MoodFlow' },
    { text: '你的担心90%都不会发生，放轻松', author: 'MoodFlow' },
    { text: '焦虑像海浪，来了又会退去', author: 'MoodFlow' },
    { text: '慢慢来，你不需要一次性解决所有问题', author: 'MoodFlow' },
    { text: '允许自己暂停一下，休息不是放弃', author: 'MoodFlow' },
    { text: '你已经做得很好了，给自己一点信任', author: 'MoodFlow' },
  ],
  // 忧郁 - 8条
  melancholy: [
    { text: '悲伤是心灵的雨季，雨过总会天晴', author: 'MoodFlow' },
    { text: '允许自己难过，这是治愈的一部分', author: 'MoodFlow' },
    { text: '你的感受是真实的，值得被倾听', author: 'MoodFlow' },
    { text: '即使此刻阴霾，你内心仍有光芒', author: 'MoodFlow' },
    { text: '忧郁不会定义你，它只是暂时的访客', author: 'MoodFlow' },
    { text: '给自己一个拥抱，你值得被温柔以待', author: 'MoodFlow' },
    { text: '眼泪是心灵的洗礼，哭出来会好一些', author: 'MoodFlow' },
    { text: '这段路很难，但你不是一个人在走', author: 'MoodFlow' },
  ],
  // 快乐 - 8条
  happy: [
    { text: '享受这份快乐，这是你应得的', author: 'MoodFlow' },
    { text: '你的笑容是这个世界的美好', author: 'MoodFlow' },
    { text: '快乐会传染，分享给你的身边人', author: 'MoodFlow' },
    { text: '记住此刻的感受，它是你的力量源泉', author: 'MoodFlow' },
    { text: '你值得拥有所有的美好', author: 'MoodFlow' },
    { text: '开心的时候，时间就让它慢下来', author: 'MoodFlow' },
    { text: '你的快乐是给自己最好的礼物', author: 'MoodFlow' },
    { text: '今天的好心情，是明天的好兆头', author: 'MoodFlow' },
  ],
  // 懊悔 - 8条
  regret: [
    { text: '过去的已经过去，你已经在成长', author: 'MoodFlow' },
    { text: '原谅自己，那时你已经尽力了', author: 'MoodFlow' },
    { text: '懊悔说明你在乎，但别让它困住你', author: 'MoodFlow' },
    { text: '每一次跌倒，都是站起来的机会', author: 'MoodFlow' },
    { text: '错误是老师，教会我们更好的方式', author: 'MoodFlow' },
    { text: '放下过去，才能拥抱更好的未来', author: 'MoodFlow' },
    { text: '你值得被原谅，尤其是被自己', author: 'MoodFlow' },
    { text: '今天的你，比昨天更智慧', author: 'MoodFlow' },
  ],
  // 平静 - 8条
  calm: [
    { text: '享受这份宁静，这是你内心的港湾', author: 'MoodFlow' },
    { text: '平静是最珍贵的状态，好好珍惜', author: 'MoodFlow' },
    { text: '此刻的你，与自己和解', author: 'MoodFlow' },
    { text: '内心的安宁，是最好的礼物', author: 'MoodFlow' },
    { text: '让这份平静成为你的力量', author: 'MoodFlow' },
    { text: '你找到了属于自己的节奏', author: 'MoodFlow' },
    { text: '平静不是没有波澜，而是学会航行', author: 'MoodFlow' },
    { text: '这份宁静，是你给自己的温柔', author: 'MoodFlow' },
  ],
  // 期待 - 8条
  anticipation: [
    { text: '期待让生活充满色彩', author: 'MoodFlow' },
    { text: '美好的事情正在向你走来', author: 'MoodFlow' },
    { text: '保持这份憧憬，它会成真', author: 'MoodFlow' },
    { text: '期待是心灵的翅膀', author: 'MoodFlow' },
    { text: '你的期待，宇宙都听到了', author: 'MoodFlow' },
    { text: '带着希望前行，路会越走越宽', author: 'MoodFlow' },
    { text: '期待的过程，本身就是一种幸福', author: 'MoodFlow' },
    { text: '相信美好的事情即将发生', author: 'MoodFlow' },
  ],
  // 满足 - 8条
  content: [
    { text: '知足是幸福的起点', author: 'MoodFlow' },
    { text: '你拥有的一切，都值得感恩', author: 'MoodFlow' },
    { text: '满足是内心最踏实的幸福', author: 'MoodFlow' },
    { text: '此刻的你，刚刚好', author: 'MoodFlow' },
    { text: '感恩让平凡的日子闪闪发光', author: 'MoodFlow' },
    { text: '你已经拥有很多，珍惜当下', author: 'MoodFlow' },
    { text: '满足不是停止，而是懂得欣赏', author: 'MoodFlow' },
    { text: '内心的富足，胜过一切', author: 'MoodFlow' },
  ],
  // 怀疑 - 8条
  doubt: [
    { text: '不确定是正常的，答案会浮现', author: 'MoodFlow' },
    { text: '怀疑是思考的开始，不是终点', author: 'MoodFlow' },
    { text: '相信你的直觉，它很少出错', author: 'MoodFlow' },
    { text: '迷茫时，先停下来听听内心', author: 'MoodFlow' },
    { text: '答案就在你心里，只是需要安静', author: 'MoodFlow' },
    { text: '怀疑让你更谨慎，这是优点', author: 'MoodFlow' },
    { text: '不必急于确定，给自己时间', author: 'MoodFlow' },
    { text: '困惑时，信息会自然清晰', author: 'MoodFlow' },
  ],
  // 压力 - 8条
  stress: [
    { text: '压力是成长的催化剂，适度就好', author: 'MoodFlow' },
    { text: '你不需要一直坚强，允许自己脆弱', author: 'MoodFlow' },
    { text: '把大压力拆成小步骤，一步步来', author: 'MoodFlow' },
    { text: '深呼吸，告诉自己：我可以', author: 'MoodFlow' },
    { text: '压力会过去，你会更强大', author: 'MoodFlow' },
    { text: '记得给自己留白的时间', author: 'MoodFlow' },
    { text: '你已经扛过很多，这次也可以', author: 'MoodFlow' },
    { text: '放下完美主义，完成比完美重要', author: 'MoodFlow' },
  ],
};
