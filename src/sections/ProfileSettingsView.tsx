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
  AlertTriangle
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

      {/* 版本信息 */}
      <div className="text-center text-xs text-gray-400">
        <p>MoodFlow v1.0.0</p>
        <p className="mt-1">Made with ❤️ for better mental health</p>
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
