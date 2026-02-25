/**
 * 情绪科普知识视图
 * 展示9种情绪的科普内容
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb } from 'lucide-react';
import { getAllEmotionKnowledge, type EmotionKnowledge } from '@/data/emotionKnowledge';

export function KnowledgeView() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const knowledgeList = getAllEmotionKnowledge();

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">情绪科普</h2>
        </div>
        <p className="text-sm text-gray-500">
          了解9种基础情绪，学会与它们和谐相处
        </p>
      </div>

      {/* 情绪卡片列表 */}
      {knowledgeList.map((emotion) => (
        <EmotionCard
          key={emotion.id}
          emotion={emotion}
          isExpanded={expandedId === emotion.id}
          onToggle={() => toggleExpand(emotion.id)}
        />
      ))}
    </div>
  );
}

// 单个情绪卡片组件
interface EmotionCardProps {
  emotion: EmotionKnowledge;
  isExpanded: boolean;
  onToggle: () => void;
}

function EmotionCard({ emotion, isExpanded, onToggle }: EmotionCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${emotion.gradient} backdrop-blur-sm rounded-3xl shadow-lg border border-white/60 overflow-hidden transition-all duration-300`}
    >
      {/* 头部 - 始终可见 */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-white/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
            style={{ backgroundColor: `${emotion.color}20` }}
          >
            {emotion.icon}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-800">{emotion.name}</h3>
            <p className="text-xs text-gray-500">
              {isExpanded ? '点击收起' : '点击查看详情'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* 内容 - 展开时显示 */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 animate-fadeIn">
          {/* 这是什么情绪？ */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: emotion.color }}
              />
              <h4 className="text-sm font-bold text-gray-700">这是什么情绪？</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {emotion.definition}
            </p>
          </div>

          {/* 为什么会有这种情绪？ */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: emotion.color }}
              />
              <h4 className="text-sm font-bold text-gray-700">为什么会有这种情绪？</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {emotion.causes}
            </p>
          </div>

          {/* 这种情绪正常吗？ */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: emotion.color }}
              />
              <h4 className="text-sm font-bold text-gray-700">这种情绪正常吗？</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {emotion.isNormal}
            </p>
          </div>

          {/* 如何应对？ */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4" style={{ color: emotion.color }} />
              <h4 className="text-sm font-bold text-gray-700">如何应对？</h4>
            </div>
            <div className="space-y-2">
              {emotion.tips.map((tip, index) => (
                <div key={index} className="flex gap-2">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: emotion.color }}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
