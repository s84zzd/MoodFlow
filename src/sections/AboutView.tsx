/**
 * 关于页面
 * 项目介绍和相关信息
 */

import { Heart, Sparkles, Shield } from 'lucide-react';

export function AboutView() {
  return (
    <div className="space-y-4">
      {/* Project Info */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">MoodFlow</h2>
          <p className="text-gray-500">情绪追踪与自我关怀</p>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <p className="leading-relaxed">
            MoodFlow 是一个温暖的情绪记录应用，帮助你觉察情绪变化，获得个性化的疗愈建议。
            我们相信，每一种情绪都值得被温柔对待。
          </p>

          <div className="bg-rose-50 rounded-2xl p-4">
            <h3 className="font-medium text-rose-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              核心功能
            </h3>
            <ul className="space-y-2 text-rose-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5" />
                <span>9种情绪状态记录</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5" />
                <span>场景化活动推荐</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5" />
                <span>情绪数据统计分析</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5" />
                <span>本地数据隐私保护</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-300 to-teal-400 flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">隐私保护</h3>
            <p className="text-xs text-gray-500">你的数据只属于你</p>
          </div>
        </div>

        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
            <span>所有数据仅存储在浏览器本地</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
            <span>不涉及任何服务器通信</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
            <span>无用户追踪或数据分析</span>
          </li>
        </ul>
      </div>

      {/* Tech Stack */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <h3 className="font-bold text-gray-800 mb-4">技术栈</h3>
        <div className="flex flex-wrap gap-2">
          {['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Radix UI', 'Recharts'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Version */}
      <div className="text-center text-xs text-gray-400">
        <p>Version 1.0.0</p>
        <p className="mt-1">Made with ❤️ for better mental health</p>
      </div>
    </div>
  );
}
