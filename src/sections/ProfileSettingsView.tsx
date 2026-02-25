/**
 * 个人设置页面
 * 包含：账号绑定、通知设置、数据管理
 */

import { useState } from 'react';
import { 
  Smartphone, 
  MessageCircle, 
  Bell, 
  Download, 
  Trash2, 
  Shield, 
  ChevronRight,
  Check,
  AlertTriangle,
  BookOpen,
  FileText,
  Lock,
  Info,
  Mail,
  Heart,
  X
} from 'lucide-react';

interface ProfileSettingsViewProps {
  onExportCSV: () => string;
}

export function ProfileSettingsView({ onExportCSV }: ProfileSettingsViewProps) {
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: true,
    friendActivity: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // 弹窗状态
  const [activeModal, setActiveModal] = useState<'guide' | 'terms' | 'privacy' | 'about' | 'contact' | 'credits' | null>(null);

  // 处理数据导出
  const handleExport = () => {
    const csvContent = onExportCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `moodflow_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 处理数据清除
  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* 账号绑定 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <h3 className="font-bold text-gray-800 mb-4">账号绑定</h3>
        
        <div className="space-y-3">
          {/* 手机号绑定 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-800">手机号</p>
                <p className="text-xs text-gray-500">未绑定</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-full bg-rose-100 text-rose-600 text-sm font-medium hover:bg-rose-200 transition-colors">
              绑定
            </button>
          </div>

          {/* 微信绑定 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-500">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-800">微信</p>
                <p className="text-xs text-gray-500">未绑定</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-full bg-rose-100 text-rose-600 text-sm font-medium hover:bg-rose-200 transition-colors">
              绑定
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          💡 绑定账号后，数据可以在多设备同步，换手机也不怕丢失
        </p>
      </div>

      {/* 通知设置 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-rose-500" />
          <h3 className="font-bold text-gray-800">通知设置</h3>
        </div>

        <div className="space-y-3">
          <ToggleItem
            title="每日打卡提醒"
            description="每天晚上9点提醒你记录今日情绪"
            enabled={notifications.dailyReminder}
            onToggle={() => setNotifications(prev => ({ ...prev, dailyReminder: !prev.dailyReminder }))}
          />
          <ToggleItem
            title="每周情绪报告"
            description="每周一发送上周情绪分析报告"
            enabled={notifications.weeklyReport}
            onToggle={() => setNotifications(prev => ({ ...prev, weeklyReport: !prev.weeklyReport }))}
          />
          <ToggleItem
            title="好友动态"
            description="当好友打卡或邀请你时通知"
            enabled={notifications.friendActivity}
            onToggle={() => setNotifications(prev => ({ ...prev, friendActivity: !prev.friendActivity }))}
          />
        </div>
      </div>

      {/* 数据管理 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <h3 className="font-bold text-gray-800 mb-4">数据管理</h3>

        <div className="space-y-3">
          {/* 导出数据 */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-500">
                <Download className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">导出数据</p>
                <p className="text-xs text-gray-500">下载 CSV 格式的打卡记录</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* 清除数据 */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-500">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">清除所有数据</p>
                <p className="text-xs text-gray-500">删除所有打卡记录，不可恢复</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* 隐私与安全 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-gray-800">隐私与安全</h3>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>所有数据仅存储在本地，不上传服务器</span>
          </p>
          <p className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>你可以随时导出或删除自己的数据</span>
          </p>
          <p className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>我们不会收集任何个人身份信息</span>
          </p>
        </div>
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-800 mb-2">确认清除数据？</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              此操作将删除所有打卡记录和设置，数据无法恢复。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 帮助与支持 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <h3 className="font-bold text-gray-800 mb-4">帮助与支持</h3>
        
        <div className="space-y-2">
          <MenuItem 
            icon={<BookOpen className="w-5 h-5" />}
            title="使用指南"
            description="了解如何使用 MoodFlow"
            onClick={() => setActiveModal('guide')}
          />
          <MenuItem 
            icon={<FileText className="w-5 h-5" />}
            title="用户协议"
            description="服务条款与使用规范"
            onClick={() => setActiveModal('terms')}
          />
          <MenuItem 
            icon={<Lock className="w-5 h-5" />}
            title="隐私政策"
            description="我们如何保护您的数据"
            onClick={() => setActiveModal('privacy')}
          />
        </div>
      </div>

      {/* 关于 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/60">
        <h3 className="font-bold text-gray-800 mb-4">关于</h3>
        
        <div className="space-y-2">
          <MenuItem 
            icon={<Info className="w-5 h-5" />}
            title="关于 MoodFlow"
            description="项目介绍与愿景"
            onClick={() => setActiveModal('about')}
          />
          <MenuItem 
            icon={<Mail className="w-5 h-5" />}
            title="联系我们"
            description="反馈、建议与问题报告"
            onClick={() => setActiveModal('contact')}
          />
          <MenuItem 
            icon={<Heart className="w-5 h-5" />}
            title="致谢"
            description="开源项目与技术"
            onClick={() => setActiveModal('credits')}
          />
        </div>
      </div>

      {/* 版本信息 */}
      <div className="text-center text-xs text-gray-400">
        <p>MoodFlow v1.0.0</p>
        <p className="mt-1">Made with ❤️ for better mental health</p>
      </div>

      {/* 弹窗 */}
      {activeModal && (
        <InfoModal 
          type={activeModal} 
          onClose={() => setActiveModal(null)} 
        />
      )}
    </div>
  );
}

// 菜单项组件
interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function MenuItem({ icon, title, description, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
          {icon}
        </div>
        <div className="text-left">
          <p className="font-medium text-gray-800">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}

// 信息弹窗组件
interface InfoModalProps {
  type: 'guide' | 'terms' | 'privacy' | 'about' | 'contact' | 'credits';
  onClose: () => void;
}

function InfoModal({ type, onClose }: InfoModalProps) {
  const modalData = {
    guide: {
      title: '使用指南',
      icon: <BookOpen className="w-6 h-6" />,
      content: (
        <div className="space-y-4 text-gray-600">
          <section>
            <h4 className="font-bold text-gray-800 mb-2">1. 情绪打卡</h4>
            <p>点击首页的情绪图标，选择最符合你当前心情的情绪，记录当下的感受。每天最多可记录 8 次。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">2. 场景选择</h4>
            <p>选择你当前所处的场景（居家、工作、社交等），帮助我们为你提供更精准的建议。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">3. 每日心语</h4>
            <p>每次打卡后会为你推荐一句心语，你可以编辑或更换，让它更贴合你的心情。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">4. AI 建议</h4>
            <p>基于你的情绪记录，AI 会为你提供个性化的情绪调节建议，每天限 8 次。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">5. 情绪卡片</h4>
            <p>生成精美的情绪分享卡片，保存到相册，与朋友分享你的心情。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">6. 周报月报</h4>
            <p>查看你的情绪趋势分析，了解自己的情绪变化规律。</p>
          </section>
        </div>
      )
    },
    terms: {
      title: '用户协议',
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4 text-gray-600 text-sm">
          <section>
            <h4 className="font-bold text-gray-800 mb-2">1. 服务条款</h4>
            <p>欢迎使用 MoodFlow！使用本服务即表示你同意本协议。本应用旨在帮助用户记录和管理情绪，不提供医疗诊断或治疗建议。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">2. 用户责任</h4>
            <p>你对自己发布的内容负责。请勿发布违法、侵权或不当内容。我们保留删除违规内容的权利。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">3. 服务变更</h4>
            <p>我们可能会随时修改或中断服务，恕不另行通知。对于重大变更，我们会提前通知用户。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">4. 免责声明</h4>
            <p>本应用仅供参考，不构成医疗建议。如有严重情绪问题，请及时寻求专业帮助。</p>
          </section>
        </div>
      )
    },
    privacy: {
      title: '隐私政策',
      icon: <Lock className="w-6 h-6" />,
      content: (
        <div className="space-y-4 text-gray-600 text-sm">
          <section>
            <h4 className="font-bold text-gray-800 mb-2">1. 数据收集</h4>
            <p>我们仅收集必要的使用数据：情绪记录、打卡时间、使用偏好。所有数据仅存储在本地设备上。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">2. 数据存储</h4>
            <p>你的数据使用浏览器本地存储（localStorage），不会上传到我们的服务器。清除浏览器数据会导致记录丢失。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">3. 数据导出</h4>
            <p>你可以随时导出数据为 CSV 格式，用于备份或迁移。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">4. 第三方服务</h4>
            <p>我们使用 DeepSeek AI 提供情绪建议服务，仅传输必要的情绪数据，不包含个人身份信息。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">5. 你的权利</h4>
            <p>你可以随时清除所有数据，或联系我们咨询隐私相关问题。</p>
          </section>
        </div>
      )
    },
    about: {
      title: '关于 MoodFlow',
      icon: <Info className="w-6 h-6" />,
      content: (
        <div className="space-y-4 text-gray-600">
          <p className="text-center text-4xl mb-4">🌸</p>
          <p>MoodFlow 是一款专注于情绪记录与管理的应用。我们相信，记录情绪是自我关怀的第一步。</p>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">我们的愿景</h4>
            <p>帮助每个人更好地了解自己的情绪，建立健康的情绪管理习惯，提升心理健康水平。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">核心功能</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>简洁优雅的情绪打卡</li>
              <li>AI 驱动的个性化建议</li>
              <li>精美的情绪分享卡片</li>
              <li>智能的周报月报分析</li>
            </ul>
          </section>
          <p className="text-center text-sm text-gray-400 mt-6">Made with ❤️ for better mental health</p>
        </div>
      )
    },
    contact: {
      title: '联系我们',
      icon: <Mail className="w-6 h-6" />,
      content: (
        <div className="space-y-4 text-gray-600">
          <p>我们非常重视你的反馈！如有任何问题、建议或想法，欢迎联系我们。</p>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">反馈与建议</h4>
            <p>如果你有任何改进建议，或希望看到新功能，请告诉我们。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">问题报告</h4>
            <p>遇到 Bug 或使用问题？请描述问题发生的步骤，我们会尽快修复。</p>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">合作洽谈</h4>
            <p>商务合作、媒体采访或其他事宜，欢迎邮件联系。</p>
          </section>
          <div className="bg-rose-50 rounded-2xl p-4 text-center mt-6">
            <p className="text-sm text-gray-500 mb-1">联系邮箱</p>
            <p className="font-bold text-rose-500">hello@moodflow.app</p>
          </div>
        </div>
      )
    },
    credits: {
      title: '致谢',
      icon: <Heart className="w-6 h-6" />,
      content: (
        <div className="space-y-4 text-gray-600 text-sm">
          <p>MoodFlow 的开发离不开以下优秀的开源项目和技术：</p>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">核心技术</h4>
            <ul className="space-y-1">
              <li>• React - 用户界面库</li>
              <li>• TypeScript - 类型安全的 JavaScript</li>
              <li>• Tailwind CSS - 实用优先的 CSS 框架</li>
              <li>• Vite - 下一代前端构建工具</li>
            </ul>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">UI 组件</h4>
            <ul className="space-y-1">
              <li>• Lucide React - 精美的图标库</li>
              <li>• shadcn/ui - 高质量的 React 组件</li>
            </ul>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">功能库</h4>
            <ul className="space-y-1">
              <li>• html2canvas - 网页截图</li>
              <li>• qrcode - 二维码生成</li>
              <li>• date-fns - 日期处理</li>
            </ul>
          </section>
          <section>
            <h4 className="font-bold text-gray-800 mb-2">AI 服务</h4>
            <ul className="space-y-1">
              <li>• DeepSeek AI - 智能情绪建议</li>
            </ul>
          </section>
          <p className="text-center text-xs text-gray-400 mt-6">感谢所有开源贡献者！</p>
        </div>
      )
    }
  };

  const { title, icon, content: modalContent } = modalData[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {modalContent}
        </div>
      </div>
    </div>
  );
}

// 开关组件
interface ToggleItemProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleItem({ title, description, enabled, onToggle }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-colors relative ${
          enabled ? 'bg-rose-400' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-all ${
            enabled ? 'left-6.5' : 'left-0.5'
          }`}
          style={{ left: enabled ? '26px' : '2px' }}
        />
      </button>
    </div>
  );
}
