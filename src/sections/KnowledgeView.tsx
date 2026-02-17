/**
 * 知识科普视图
 * 情绪相关的基础科普内容
 */

import { useState } from 'react';
import { BookOpen, ChevronRight, Heart, Brain, Lightbulb } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  icon: React.ReactNode;
  content: string;
}

const articles: Article[] = [
  {
    id: 'emotions-101',
    title: '情绪的9种颜色',
    summary: '了解MoodFlow中的9种基础情绪及其特征',
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    content: `情绪是人类心理活动的重要组成部分。在MoodFlow中，我们将情绪分为9种基础类型：

🟡 快乐 - 心情愉悦，充满活力
🔵 忧郁 - 淡淡的忧伤笼罩
🟢 平静 - 内心安宁，波澜不惊
🟠 期待 - 对未来充满憧憬
🔴 焦虑 - 内心不安，需要平静
🟣 懊悔 - 为过去的事感到遗憾
🟤 满足 - 知足常乐的状态
⚫ 怀疑 - 不确定，需要验证
⚪ 压力 - 感到紧张和压迫

每种情绪都有其存在的意义，学会识别和接纳它们是情绪管理的第一步。`,
  },
  {
    id: 'emotion-anxiety',
    title: '🌸 焦虑：不确定的紧张感',
    summary: '了解焦虑的本质，学会与它共处',
    icon: <span className="text-2xl">🌸</span>,
    content: `**① 定义**

一种来自不确定性的紧张感。常见于「事情还没发生，但我已经开始担心了」。焦虑不是软弱，而是大脑在提醒你：「我需要更多安全感。」

**② 身体感受**

• 心跳变快、胸口紧
• 呼吸变浅
• 肩颈僵硬、下颌紧绷
• 手脚冰凉或出汗
• 脑子停不下来、像有一团雾
• 想逃避、坐立不安

（这些身体反应都很常见，不代表你有问题。）

**③ 常见触发**

• 学业：考试、论文、成绩、deadline
• 人际：消息变慢、关系不确定、害怕被冷落
• 社交：担心说错话、担心别人不喜欢自己
• 身体：生理期前后、睡不好、激素波动
• 未来：就业、职业发展、人生方向
• 自我：觉得自己不够好、怕让别人失望

**④ 温柔提醒**

• 你不是在崩溃，你只是在需要一点安全感。
• 你已经很努力了，不需要再逼自己。
• 你现在的紧张，是身体在提醒你：慢一点也没关系。
• 你不需要马上解决所有事，只需要先照顾好自己。
• 焦虑不是失败，它只是告诉你：你在乎。`,
  },
  {
    id: 'emotion-melancholy',
    title: '🌙 忧郁：低能量的灰色',
    summary: '忧郁不是脆弱，是身体在保护你',
    icon: <span className="text-2xl">🌙</span>,
    content: `**① 定义**

一种低能量、灰蒙蒙的情绪状态。不是大哭，而是那种「说不上来，但就是提不起劲」的感觉。忧郁常常悄悄出现，让人觉得世界有点暗、自己有点沉。

它不是「矫情」，也不是「想太多」，而是身体和情绪在告诉你：「我累了，我需要一点温柔。」

**② 身体感受**

• 身体沉重、像被按了慢放键
• 想躺着、不想动
• 眼睛酸、想发呆
• 心口空空的、闷闷的
• 对平常喜欢的事也提不起兴趣
• 想独处，但又不想完全一个人

**③ 常见触发**

• 生理期前后、激素波动
• 睡眠不足、天气阴沉
• 关系疲惫、长期压抑
• 学习或生活的持续消耗
• 长时间没有被理解、被看见
• 期待落空后的小小余波
• 社交后空虚、情绪回落

**④ 温柔提醒**

• 你现在的慢，是身体在保护你。
• 你不需要马上变好，只需要先停一下。
• 忧郁不是失败，它只是告诉你：你累了。
• 你值得被温柔对待，尤其是现在。
• 允许自己不那么有精神，也是一种勇气。`,
  },
  {
    id: 'emotion-stress',
    title: '🌼 压力：负荷感的信号',
    summary: '压力不是软弱，是你承担得太多',
    icon: <span className="text-2xl">🌼</span>,
    content: `**① 定义**

压力是一种来自外界要求或自我要求的负荷感。不是坏情绪，而是当你觉得「我必须撑住」「我不能掉链子」时，大脑启动的紧绷模式。

压力不是你不够好，而是你承担得太多。

**② 身体感受**

• 肩颈僵硬、头紧、太阳穴跳
• 呼吸变浅、胸口发紧
• 睡不踏实、容易惊醒
• 胃不舒服、食欲变化
• 脑子像被塞满、难以集中
• 一点小事就会被放大

这些都是身体在提醒你：需要休息了。

**③ 常见触发**

• 学习任务堆积、deadline
• 老师或家长的期待
• 考试压力、成绩焦虑
• 自我要求过高、完美主义
• 人际关系中的情绪劳动
• 长期缺乏休息
• 生理周期前后

压力往往不是一件事，而是很多事叠加。

**④ 温柔提醒**

• 你已经很努力了，不需要再逼自己。
• 你不是机器，你值得休息。
• 压力不是失败，而是你在认真生活。
• 你可以慢一点，世界不会因此崩塌。
• 你不需要完美，只需要真实的自己。`,
  },
  {
    id: 'emotion-anticipation',
    title: '🌸 期待：向未来伸手',
    summary: '期待让生活有光，是一种珍贵的情绪',
    icon: <span className="text-2xl">🌸</span>,
    content: `**① 定义**

期待是一种向未来伸手的情绪。它带着希望、兴奋、想象，也带着一点点紧张。

期待让生活有光，是一种非常珍贵的情绪。

**② 身体感受**

• 心里暖暖的、轻轻跳动
• 有动力、想行动
• 想提前准备、想分享
• 对未来画面有想象
• 有一点点紧张，但更多是兴奋

**③ 常见触发**

• 约会、见喜欢的人
• 旅行、节日、生日
• 新学期、新计划、新开始
• 朋友聚会、社团活动
• 期待被看见、被认可
• 期待生活变得更好

**④ 温柔提醒**

• 你值得拥有让你心动的未来。
• 期待本身，就是一种能量。
• 你可以允许自己开心，不需要理由。
• 期待不是幻想，而是你在向生活靠近。`,
  },
  {
    id: 'emotion-doubt',
    title: '🌤 怀疑：寻找安全感',
    summary: '怀疑不是不自信，是你在保护自己',
    icon: <span className="text-2xl">🌤</span>,
    content: `**① 定义**

怀疑是一种不确定感。可能是怀疑自己、怀疑关系、怀疑别人是否在乎你。

怀疑不是不自信，而是你在寻找安全感。

**② 身体感受**

• 心里不踏实
• 想确认、想问、想验证
• 情绪容易波动
• 对细节特别敏感
• 容易脑补、容易想太多

**③ 常见触发**

• 对方回复变慢
• 学习中被质疑或被忽略
• 社交中的微表情、语气变化
• 自己状态不好时
• 生理期前后
• 过去的经历触发了不安全感

**④ 温柔提醒**

• 你不是在胡思乱想，你只是在寻找安全感。
• 你值得被清晰、被回应、被在乎。
• 你不需要压抑怀疑，可以温柔地看见它。
• 怀疑不是弱点，而是你在认真对待关系。`,
  },
  {
    id: 'emotion-regret',
    title: '🌙 懊悔：对过去放不下',
    summary: '懊悔不是自责，而是你在乎',
    icon: <span className="text-2xl">🌙</span>,
    content: `**① 定义**

懊悔是一种对过去放不下的情绪。事情已经发生，但心里仍在 replay、仍在想「如果当时……」。

懊悔不是自责，而是你在乎。

**② 身体感受**

• 心里堵堵的、沉沉的
• 睡前特别容易想起
• 脑子停不下来
• 想解释、想补救
• 对当下的事提不起劲

**③ 常见触发**

• 关系中的一句话、一次争吵
• 没说出口的需求或拒绝
• 考试或比赛中的表现不佳
• 社交中的尴尬瞬间
• 错过的机会、错过的人

**④ 温柔提醒**

• 你之所以放不下，是因为你在乎。
• 当时的你已经尽力了。
• 你可以选择现在温柔地放过自己。
• 释怀不需要立刻，慢慢来就好。`,
  },
  {
    id: 'emotion-happy',
    title: '🌈 快乐：轻盈明亮',
    summary: '快乐不需要理由，它值得被记录',
    icon: <span className="text-2xl">🌈</span>,
    content: `**① 定义**

快乐是一种轻盈、明亮的情绪。可能来自小事，也可能来自被爱、被理解、被看见。

快乐不需要理由，它值得被记录。

**② 身体感受**

• 身体轻松、呼吸顺畅
• 想笑、想分享
• 心里暖暖的、有能量
• 想做点什么、想拥抱世界

**③ 常见触发**

• 好天气、好吃的、好朋友
• 被夸、被理解、被支持
• 完成任务、达成目标
• 关系中的甜蜜瞬间
• 生活中的小确幸

**④ 温柔提醒**

• 你值得拥有这些轻盈的时刻。
• 快乐不需要很大，小小的也很好。
• 你可以放心地享受当下。`,
  },
  {
    id: 'emotion-calm',
    title: '🌿 平静：稳定松弛',
    summary: '平静不是冷漠，是恢复力的一部分',
    icon: <span className="text-2xl">🌿</span>,
    content: `**① 定义**

平静是一种稳定、松弛、心安的状态。不是没有情绪，而是情绪不再压着你。

平静是恢复力的一部分。

**② 身体感受**

• 呼吸顺畅、身体放松
• 心里安稳、不急不躁
• 头脑清晰、能专注
• 想独处、想慢下来

**③ 常见触发**

• 独处、散步、自然
• 完成任务后的轻松
• 关系稳定、被理解
• 身体状态良好
• 远离压力源

**④ 温柔提醒**

• 你值得拥有这样的安稳。
• 平静不是退缩，而是你在照顾自己。
• 你可以继续保持这种节奏。`,
  },
  {
    id: 'emotion-content',
    title: '🌸 满足：被填满的感觉',
    summary: '满足是自我价值的养分',
    icon: <span className="text-2xl">🌸</span>,
    content: `**① 定义**

满足是一种被填满、被看见、被认可的情绪。来自「我做得很好」「我被在乎」「我照顾好了自己」。

满足是自我价值的养分。

**② 身体感受**

• 心里暖暖的、柔软的
• 身体轻松、有力量
• 想微笑、想拥抱
• 对生活有掌控感

**③ 常见触发**

• 完成任务、达成目标
• 被认可、被夸、被理解
• 关系稳定、被爱
• 做了对自己好的事
• 生活井井有条

**④ 温柔提醒**

• 你值得被肯定，也值得肯定自己。
• 满足是你努力的回响。
• 你可以放心地享受这份踏实。`,
  },
  {
    id: 'emotion-management',
    title: '情绪调节小技巧',
    summary: '简单实用的日常情绪调节方法',
    icon: <Brain className="w-5 h-5 text-blue-500" />,
    content: `1. **深呼吸法**
当感到焦虑或压力时，尝试4-7-8呼吸法：吸气4秒，屏息7秒，呼气8秒。

2. **情绪日记**
每天花5分钟记录当下的感受，不用修饰，让情绪自然流淌。

3. **五感 grounding**
说出5样能看到、4样能听到、3样能摸到、2样能闻到、1样能尝到的，帮助自己回到当下。

4. **身体舒展**
简单的拉伸运动可以释放身体的紧张感，改善情绪状态。

5. **感恩练习**
每天写下3件值得感恩的事，培养积极心态。`,
  },
  {
    id: 'emotion-science',
    title: '情绪与大脑的科学',
    summary: '了解情绪产生的生理机制',
    icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
    content: `情绪不仅仅是一种心理体验，它有着深刻的生理基础：

**杏仁核** - 情绪的"警报器"
负责处理恐惧、焦虑等情绪，当我们感到威胁时会迅速激活。

**前额叶皮层** - 情绪的"调节器"
帮助我们理性分析情绪，做出适当的反应。

**多巴胺** - 快乐物质
当我们感到快乐、满足时，大脑会分泌多巴胺。

**血清素** - 稳定情绪
影响我们的情绪稳定性和整体幸福感。

了解这些科学知识，可以帮助我们更好地理解和管理自己的情绪。`,
  },
];

export function KnowledgeView() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-300 to-cyan-400 flex items-center justify-center text-white">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">情绪知识库</h3>
            <p className="text-xs text-gray-500">了解情绪，认识自己</p>
          </div>
        </div>

        <div className="space-y-3">
          {articles.map((article) => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                {article.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 group-hover:text-rose-600 transition-colors">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{article.summary}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 文章详情组件
interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-rose-500 transition-colors mb-4"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span className="text-sm">返回列表</span>
      </button>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
          {article.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{article.title}</h3>
      </div>

      <div className="prose prose-sm max-w-none">
        {article.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="text-gray-600 leading-relaxed mb-4 whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
