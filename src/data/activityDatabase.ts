/**
 * 完整活动数据库
 * 基于 Gross 情绪调节理论
 * 9种情绪 × 6种场景 × 3个活动 = 162个活动
 */

import type { CustomActivity } from '@/hooks/useCustomActivities';

// 情绪列表
const moods = [
  { id: 'anxiety', name: '焦虑', color: 'text-rose-600', bg: 'from-rose-50 to-pink-50' },
  { id: 'melancholy', name: '忧郁', color: 'text-blue-600', bg: 'from-blue-50 to-indigo-50' },
  { id: 'happy', name: '快乐', color: 'text-yellow-600', bg: 'from-yellow-50 to-amber-50' },
  { id: 'regret', name: '懊悔', color: 'text-purple-600', bg: 'from-purple-50 to-violet-50' },
  { id: 'calm', name: '平静', color: 'text-emerald-600', bg: 'from-emerald-50 to-teal-50' },
  { id: 'anticipation', name: '期待', color: 'text-orange-600', bg: 'from-orange-50 to-amber-50' },
  { id: 'content', name: '满足', color: 'text-green-600', bg: 'from-green-50 to-emerald-50' },
  { id: 'doubt', name: '怀疑', color: 'text-slate-600', bg: 'from-slate-50 to-gray-50' },
  { id: 'stress', name: '压力', color: 'text-red-600', bg: 'from-red-50 to-rose-50' },
];

// 场景列表
const scenes = ['home', 'alone', 'work', 'commute', 'love', 'social'];

// 活动数据库 - 每个情绪-场景组合3个活动
const activityDatabase: Record<string, Record<string, Array<{ title: string; description: string; duration: string }>>> = {
  // ═══════════════════════════════════════════════════════════
  // 焦虑 (Anxiety)
  // ═══════════════════════════════════════════════════════════
  anxiety: {
    home: [
      { title: '冷水敷脸', description: '用冷水轻拍脸部，激活副交感神经系统，快速降低焦虑水平。', duration: '2分钟' },
      { title: '温水泡脚', description: '用40度温水泡脚10分钟，促进血液循环，缓解紧张。', duration: '10分钟' },
      { title: '香薰放松', description: '点燃薰衣草香薰，深呼吸5次，让香气安抚神经。', duration: '5分钟' },
    ],
    alone: [
      { title: '盒式呼吸', description: '吸气4秒→屏息4秒→呼气4秒→屏息4秒，循环5次。', duration: '3分钟' },
      { title: '渐进放松', description: '从脚趾开始，依次紧绷再放松每个肌肉群，直到头顶。', duration: '10分钟' },
      { title: '数数冥想', description: '闭眼从1数到100，只关注数字，其他想法让它飘走。', duration: '5分钟' },
    ],
    work: [
      { title: '桌面整理', description: '花3分钟整理办公桌，将物品按类别归位。', duration: '3分钟' },
      { title: '离开座位', description: '起身去茶水间接水，走动2分钟，打破焦虑循环。', duration: '2分钟' },
      { title: '写下担忧', description: '在纸上写下所有担忧，然后折起来放进口袋，告诉自己稍后处理。', duration: '3分钟' },
    ],
    commute: [
      { title: '感官计数', description: '闭眼，默数听到的不同声音，数到10个后睁眼。', duration: '5分钟' },
      { title: '观察呼吸', description: '专注于呼吸的进出，不控制，只是观察，持续5分钟。', duration: '5分钟' },
      { title: '手指按压', description: '用拇指依次按压其他四指的指腹，每个按压5秒。', duration: '3分钟' },
    ],
    love: [
      { title: '寻求拥抱', description: '向伴侣请求一个20秒的拥抱，催产素能快速降低皮质醇。', duration: '1分钟' },
      { title: '牵手散步', description: '和伴侣手牵手在附近走5分钟，身体接触带来安全感。', duration: '5分钟' },
      { title: '倾诉表达', description: '告诉伴侣「我有点焦虑，能陪我坐一会儿吗？」', duration: '5分钟' },
    ],
    social: [
      { title: '洗手间暂停', description: '去洗手间，对着镜子做3次深呼吸，告诉自己「我很安全」。', duration: '2分钟' },
      { title: '寻找盟友', description: '找到最熟悉的人，站在TA身边，建立安全感。', duration: '2分钟' },
      { title: '喝水缓冲', description: '慢慢喝一杯水，专注于吞咽的感觉，让自己慢下来。', duration: '3分钟' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 忧郁 (Melancholy)
  // ═══════════════════════════════════════════════════════════
  melancholy: {
    home: [
      { title: '阳光照射', description: '走到窗边或阳台，让阳光照射脸部10分钟。', duration: '10分钟' },
      { title: '整理房间', description: '花15分钟整理一个角落，环境的改变带动心情转变。', duration: '15分钟' },
      { title: '播放音乐', description: '播放节奏轻快的音乐，跟着哼唱或摇摆身体。', duration: '10分钟' },
    ],
    alone: [
      { title: '书写倾诉', description: '给信任的人写一封信（不发），倾诉此刻的感受。', duration: '10分钟' },
      { title: '外出散步', description: '出门走15分钟，观察周围的景色和人，不思考。', duration: '15分钟' },
      { title: '看喜剧视频', description: '看一段搞笑视频，允许自己笑出来。', duration: '10分钟' },
    ],
    work: [
      { title: '微任务完成', description: '选择一项5分钟内能完成的小任务，完成后的成就感能打破低落。', duration: '5分钟' },
      { title: '同事聊天', description: '找同事聊5分钟与工作无关的话题，转移注意力。', duration: '5分钟' },
      { title: '窗边远眺', description: '站在窗边远眺5分钟，让眼睛和大脑都休息一下。', duration: '5分钟' },
    ],
    commute: [
      { title: '观察行人', description: '观察路人的表情和步伐，想象他们今天的故事。', duration: '10分钟' },
      { title: '听播客', description: '听一集有趣的播客，让注意力转移到内容上。', duration: '15分钟' },
      { title: '改变路线', description: '提前一站下车，走一条不同的路，新鲜感打破低落。', duration: '10分钟' },
    ],
    love: [
      { title: '回忆相册', description: '和伴侣一起翻看过去的照片，回忆开心时刻。', duration: '10分钟' },
      { title: '拥抱依偎', description: '靠在伴侣肩上，什么都不说，只是感受温暖。', duration: '5分钟' },
      { title: '共同做饭', description: '和伴侣一起准备晚餐，专注在切菜烹饪的过程中。', duration: '20分钟' },
    ],
    social: [
      { title: '倾听他人', description: '主动询问朋友「你最近怎么样」，专注倾听。', duration: '10分钟' },
      { title: '参与活动', description: '加入正在进行的游戏或话题，让自己投入其中。', duration: '15分钟' },
      { title: '帮助他人', description: '主动帮朋友递东西或倒饮料，小行动带来价值感。', duration: '5分钟' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 快乐 (Happy)
  // ═══════════════════════════════════════════════════════════
  happy: {
    home: [
      { title: '快乐记录', description: '用手机录一段语音，描述此刻为什么开心。', duration: '3分钟' },
      { title: '跳舞庆祝', description: '放一首喜欢的歌，跟着节奏自由舞动。', duration: '5分钟' },
      { title: '美食奖励', description: '给自己做或点一份喜欢的食物，细细品味。', duration: '20分钟' },
    ],
    alone: [
      { title: '感恩分享', description: '给让你开心的人发一条感谢消息，具体说明TA做了什么。', duration: '3分钟' },
      { title: '自拍留念', description: '对着镜子拍一张笑脸照片，保存这份快乐。', duration: '2分钟' },
      { title: '购买小物', description: '给自己买一样喜欢的小东西，不贵的奖励。', duration: '10分钟' },
    ],
    work: [
      { title: '庆祝微成就', description: '站起来，给自己鼓掌3下，大声说「我做到了！」', duration: '1分钟' },
      { title: '分享喜悦', description: '告诉同事你的好消息，让快乐传递。', duration: '3分钟' },
      { title: '记录成功', description: '在笔记本上写下这次成功，留作纪念。', duration: '3分钟' },
    ],
    commute: [
      { title: '微笑练习', description: '对遇到的每个人微笑，观察他们的反应。', duration: '10分钟' },
      { title: '哼唱歌曲', description: '轻声哼唱喜欢的歌，让快乐外显。', duration: '10分钟' },
      { title: '分享动态', description: '发一条朋友圈分享此刻的快乐，收获点赞。', duration: '3分钟' },
    ],
    love: [
      { title: '亲密时刻', description: '和伴侣分享此刻的快乐，描述具体的感受。', duration: '5分钟' },
      { title: '拥抱亲吻', description: '给伴侣一个大大的拥抱和亲吻，分享喜悦。', duration: '2分钟' },
      { title: '共同庆祝', description: '和伴侣一起做件开心的事，比如吃蛋糕或看电影。', duration: '30分钟' },
    ],
    social: [
      { title: '带动氛围', description: '主动讲一个笑话或分享开心的事，带动周围气氛。', duration: '5分钟' },
      { title: '举杯庆祝', description: '提议大家举杯，分享此刻的好心情。', duration: '3分钟' },
      { title: '邀请合影', description: '提议拍一张合照，记录这个开心的时刻。', duration: '3分钟' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 懊悔 (Regret)
  // ═══════════════════════════════════════════════════════════
  regret: {
    home: [
      { title: '弥补行动', description: '立即做一件能弥补遗憾的小事，行动能打破反刍思维。', duration: '10分钟' },
      { title: '写信道歉', description: '写一封道歉信（可不发），把想说的话写出来。', duration: '10分钟' },
      { title: '重新开始', description: '把失败的事情重新做一遍，用行动覆盖遗憾。', duration: '20分钟' },
    ],
    alone: [
      { title: '自我宽恕', description: '对着镜子说：「当时的我已经尽力了，我原谅自己。」', duration: '3分钟' },
      { title: '时间视角', description: '想象一年后回看此刻，这件事还重要吗？', duration: '5分钟' },
      { title: '教训记录', description: '写下这次经历教会了你什么，下次会怎么做。', duration: '5分钟' },
    ],
    work: [
      { title: '经验提炼', description: '写下这次经历教会了你什么，下次会怎么做。', duration: '5分钟' },
      { title: '主动汇报', description: '主动向领导汇报问题，并提出解决方案。', duration: '10分钟' },
      { title: '修正错误', description: '立即修正能改正的错误，减少损失。', duration: '15分钟' },
    ],
    commute: [
      { title: '未来想象', description: '想象一年后回看此刻，这件事还重要吗？', duration: '5分钟' },
      { title: '放下练习', description: '把懊悔写在纸上，折成纸飞机扔出去。', duration: '3分钟' },
      { title: '咨询他人', description: '给朋友发消息，询问TA会怎么处理。', duration: '5分钟' },
    ],
    love: [
      { title: '坦诚沟通', description: '向伴侣坦诚表达你的懊悔，寻求理解和支持。', duration: '10分钟' },
      { title: '弥补行动', description: '做一件能让伴侣开心的事，弥补过失。', duration: '15分钟' },
      { title: '承诺改进', description: '向伴侣承诺具体的改进措施，并写下来。', duration: '5分钟' },
    ],
    social: [
      { title: '转移注意', description: '主动参与对话，将注意力转移到当下。', duration: '10分钟' },
      { title: '幽默化解', description: '用幽默的方式提及自己的小失误，轻松化解。', duration: '3分钟' },
      { title: '私下道歉', description: '找机会私下向相关的人道歉，表达诚意。', duration: '5分钟' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 平静 (Calm)
  // ═══════════════════════════════════════════════════════════
  calm: {
    home: [
      { title: '正念品茶', description: '泡一杯茶，专注感受茶香的层次、温度的变化。', duration: '10分钟' },
      { title: '阅读书籍', description: '读几页喜欢的书，享受安静的阅读时光。', duration: '15分钟' },
      { title: '静坐发呆', description: '什么都不做，只是坐着，让思绪自由流动。', duration: '10分钟' },
    ],
    alone: [
      { title: '呼吸观察', description: '不控制呼吸，只是观察自然的呼吸节奏。', duration: '10分钟' },
      { title: '自然聆听', description: '打开窗，聆听外面的风声、鸟声、树叶声。', duration: '10分钟' },
      { title: '慢步行走', description: '慢慢走动，感受脚掌与地面的接触。', duration: '10分钟' },
    ],
    work: [
      { title: '单任务专注', description: '选择一项任务，关闭所有通知，专注完成。', duration: '25分钟' },
      { title: '整理文档', description: '整理电脑文件，建立清晰的文件夹结构。', duration: '15分钟' },
      { title: '闭眼休息', description: '闭眼休息5分钟，让大脑得到短暂放松。', duration: '5分钟' },
    ],
    commute: [
      { title: '身体扫描', description: '从头顶到脚底，依次觉察每个身体部位的感觉。', duration: '15分钟' },
      { title: '观察风景', description: '看着窗外的景色，不思考，只是观察。', duration: '10分钟' },
      { title: '冥想音乐', description: '听一段冥想音乐，让身心更加放松。', duration: '10分钟' },
    ],
    love: [
      { title: '静默陪伴', description: '和伴侣一起静坐，不需要说话，感受彼此的存在。', duration: '10分钟' },
      { title: '共同阅读', description: '和伴侣各自看书，偶尔交换微笑。', duration: '20分钟' },
      { title: '依偎休息', description: '靠在伴侣身上，一起闭目养神。', duration: '10分钟' },
    ],
    social: [
      { title: '倾听冥想', description: '在对话中，专注于听对方的声音、语调、停顿。', duration: '10分钟' },
      { title: '观察互动', description: '不主动发言，只是观察大家的互动，像看电影一样。', duration: '10分钟' },
      { title: '慢饮细品', description: '慢慢品尝手中的饮料，专注于味道和温度。', duration: '5分钟' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 期待 (Anticipation)
  // ═══════════════════════════════════════════════════════════
  anticipation: {
    home: [
      { title: '愿景板制作', description: '用杂志剪贴或画图，制作期待事情的愿景板。', duration: '15分钟' },
      { title: '清单罗列', description: '列出期待事情的所有细节，越具体越好。', duration: '10分钟' },
      { title: '倒计时设置', description: '在日历上标记期待的日子，设置倒计时。', duration: '3分钟' },
    ],
    alone: [
      { title: '细节想象', description: '闭上眼睛，详细想象期待事情发生的场景。', duration: '5分钟' },
      { title: '准备研究', description: '上网搜索相关信息，为期待的事情做准备。', duration: '15分钟' },
      { title: '分享期待', description: '给朋友发消息，分享你的期待和计划。', duration: '5分钟' },
    ],
    work: [
      { title: '计划拆解', description: '将期待的目标拆解成3个具体步骤，写在纸上。', duration: '10分钟' },
      { title: '资源准备', description: '整理实现目标需要的资源和工具。', duration: '10分钟' },
      { title: '时间规划', description: '在日程表上为期待的事情预留时间。', duration: '5分钟' },
    ],
    commute: [
      { title: '资源盘点', description: '思考实现期待需要哪些资源，你已经具备了哪些。', duration: '10分钟' },
      { title: '障碍预想', description: '预想可能遇到的障碍，并思考应对方案。', duration: '10分钟' },
      { title: '成功想象', description: '想象期待实现后的成功场景，感受那份喜悦。', duration: '5分钟' },
    ],
    love: [
      { title: '共同规划', description: '和伴侣分享你的期待，讨论如何互相支持。', duration: '15分钟' },
      { title: '约定庆祝', description: '和伴侣约定期待实现后的庆祝方式。', duration: '5分钟' },
      { title: '准备惊喜', description: '为期待的事情准备一个惊喜给对方。', duration: '20分钟' },
    ],
    social: [
      { title: '分享期待', description: '告诉朋友你期待的事情，让他们为你加油。', duration: '5分钟' },
      { title: '征求意见', description: '询问朋友对期待事情的看法和建议。', duration: '10分钟' },
      { title: '邀请参与', description: '邀请朋友一起参与期待的事情。', duration: '5分钟' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 满足 (Content)
  // ═══════════════════════════════════════════════════════════
  content: {
    home: [
      { title: '环顾感恩', description: '环顾房间，找出3样让你感到满足的物品，触摸它们。', duration: '3分钟' },
      { title: '舒适享受', description: '躺在沙发上，感受身体的舒适和环境的安稳。', duration: '10分钟' },
      { title: '美食 savoring', description: '慢慢品尝喜欢的食物，感受每一口的味道。', duration: '15分钟' },
    ],
    alone: [
      { title: '成就回顾', description: '列出最近完成的3件小事，为自己鼓掌。', duration: '5分钟' },
      { title: '日记记录', description: '写下此刻满足的感受，留作未来的回忆。', duration: '5分钟' },
      { title: '自我肯定', description: '对着镜子说：「我做得很好，我值得这份满足。」', duration: '2分钟' },
    ],
    work: [
      { title: '完美时刻', description: '回顾今天工作中最顺利的一个瞬间，细细品味。', duration: '3分钟' },
      { title: '成果欣赏', description: '欣赏自己完成的工作成果，认可自己的努力。', duration: '3分钟' },
      { title: '休息享受', description: '放下工作，享受片刻的休息，感受满足。', duration: '5分钟' },
    ],
    commute: [
      { title: '当下觉察', description: '感受此刻身体的舒适、环境的安稳。', duration: '5分钟' },
      { title: '感恩练习', description: '在心里默默感谢3样让你满足的事物。', duration: '3分钟' },
      { title: '微笑保持', description: '保持微笑，让满足的感觉在脸上停留。', duration: '5分钟' },
    ],
    love: [
      { title: '爱意表达', description: '告诉伴侣「有你在身边，我很满足」。', duration: '2分钟' },
      { title: '拥抱感谢', description: '拥抱伴侣，感谢TA带给你的满足感。', duration: '3分钟' },
      { title: '共同回味', description: '和伴侣一起回味美好的时光，强化满足感。', duration: '10分钟' },
    ],
    social: [
      { title: '感谢当下', description: '对在场的朋友说「和你们在一起很开心」。', duration: '2分钟' },
      { title: '赞美他人', description: '真诚赞美朋友的某个优点或成就。', duration: '3分钟' },
      { title: '享受氛围', description: '不主动参与，只是享受当下的氛围和陪伴。', duration: '10分钟' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 怀疑 (Doubt)
  // ═══════════════════════════════════════════════════════════
  doubt: {
    home: [
      { title: '利弊清单', description: '拿出纸，列出做与不做的各3个理由。', duration: '10分钟' },
      { title: '信息收集', description: '上网搜索相关信息，减少不确定性。', duration: '15分钟' },
      { title: '咨询专家', description: '给专业人士发消息，寻求专业意见。', duration: '10分钟' },
    ],
    alone: [
      { title: '最坏想象', description: '想象最坏的结果是什么，你能承受吗？', duration: '5分钟' },
      { title: '直觉倾听', description: '闭眼，深呼吸，倾听内心的直觉声音。', duration: '5分钟' },
      { title: '过往回顾', description: '回顾过去类似情况，当时是怎么决定的？', duration: '5分钟' },
    ],
    work: [
      { title: '小步测试', description: '做一个最小规模的尝试，收集真实反馈。', duration: '15分钟' },
      { title: '同事讨论', description: '找信任的同事讨论，听取不同的观点。', duration: '10分钟' },
      { title: '数据支持', description: '收集相关数据，用数据减少不确定性。', duration: '15分钟' },
    ],
    commute: [
      { title: '咨询他人', description: '给朋友发消息，询问TA会怎么做。', duration: '5分钟' },
      { title: '正反辩论', description: '在心里进行正反方辩论，列出所有论点。', duration: '10分钟' },
      { title: '抛硬币测试', description: '抛硬币，看结果出来后自己是失望还是释然。', duration: '2分钟' },
    ],
    love: [
      { title: '坦诚询问', description: '向伴侣表达你的疑虑，询问TA的看法。', duration: '10分钟' },
      { title: '共同分析', description: '和伴侣一起分析利弊，共同做决定。', duration: '15分钟' },
      { title: '寻求支持', description: '告诉伴侣你的不确定，寻求情感支持。', duration: '5分钟' },
    ],
    social: [
      { title: '观察模仿', description: '观察他人如何处理类似情况，模仿你觉得有效的做法。', duration: '10分钟' },
      { title: '征求意见', description: '询问朋友的意见，收集不同的视角。', duration: '10分钟' },
      { title: '跟随多数', description: '如果大家都这么做，先跟着做，边做边学。', duration: '5分钟' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 压力 (Stress)
  // ═══════════════════════════════════════════════════════════
  stress: {
    home: [
      { title: '任务拆解', description: '将压力源拆解成3个可执行的小步骤，只关注第一步。', duration: '10分钟' },
      { title: '热水淋浴', description: '洗个热水澡，让水流冲走身体的紧张。', duration: '15分钟' },
      { title: '大声喊叫', description: '在房间里大声喊叫或唱歌，释放压力。', duration: '3分钟' },
    ],
    alone: [
      { title: '快速运动', description: '做20个开合跳或原地高抬腿，快速消耗压力激素。', duration: '3分钟' },
      { title: '击打枕头', description: '用力击打枕头或床垫，安全地释放攻击性。', duration: '3分钟' },
      { title: '冷水洗脸', description: '用冷水洗脸，刺激神经，快速清醒。', duration: '2分钟' },
    ],
    work: [
      { title: '番茄工作', description: '设定25分钟倒计时，专注做一件事。', duration: '25分钟' },
      { title: '优先级排序', description: '列出所有任务，按重要紧急排序，只做前3个。', duration: '5分钟' },
      { title: '短暂离开', description: '离开座位，去洗手间或茶水间，短暂脱离压力环境。', duration: '5分钟' },
    ],
    commute: [
      { title: '肩颈放松', description: '缓慢转动肩颈，配合深呼吸。', duration: '5分钟' },
      { title: '握拳放松', description: '用力握拳5秒，然后突然放松，重复5次。', duration: '3分钟' },
      { title: '音乐释放', description: '听一首节奏强烈的歌，跟着节奏点头或敲打。', duration: '5分钟' },
    ],
    love: [
      { title: '寻求支持', description: '告诉伴侣你的压力，请求一个拥抱或倾听。', duration: '10分钟' },
      { title: '共同分担', description: '请伴侣帮你做一件小事，分担压力。', duration: '10分钟' },
      { title: '按摩放松', description: '让伴侣帮你按摩肩颈，释放身体紧张。', duration: '10分钟' },
    ],
    social: [
      { title: '暂时退出', description: '礼貌地说「我需要出去透透气」，离开现场片刻。', duration: '5分钟' },
      { title: '简化参与', description: '不强迫自己活跃，只是安静地待在一旁。', duration: '10分钟' },
      { title: '寻找安静', description: '找到一个安静的角落，独自待一会儿。', duration: '5分钟' },
    ],
  },
};

// 生成完整的活动列表
export function generateFullActivityDatabase(): CustomActivity[] {
  const activities: CustomActivity[] = [];
  let idCounter = 1;

  moods.forEach((mood) => {
    scenes.forEach((scene) => {
      const sceneActivities = activityDatabase[mood.id]?.[scene] || [];
      sceneActivities.forEach((activity, index) => {
        activities.push({
          id: `${mood.id}-${scene}-${index + 1}`,
          title: activity.title,
          description: activity.description,
          duration: activity.duration,
          color: mood.color,
          bgGradient: mood.bg,
          moodIds: [mood.id],
          sceneIds: [scene],
          isDefault: true,
        });
      });
    });
  });

  return activities;
}

// 导出完整活动库
export const FULL_ACTIVITIES = generateFullActivityDatabase();
