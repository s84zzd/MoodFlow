import { useState } from 'react';
import { X, Loader2, RefreshCw, User } from 'lucide-react';
import { autoLogin, register, generateDeviceId } from '@/services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState('');

  if (!isOpen) return null;

  const handleAutoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await autoLogin();
      onLogin();
      onClose();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAccount = async () => {
    setLoading(true);
    setError('');
    try {
      // 清除当前设备
      localStorage.removeItem('moodflow_device_id');
      localStorage.removeItem('moodflow_token');
      localStorage.removeItem('moodflow_user');
      
      // 生成新设备ID
      const newDeviceId = generateDeviceId();
      setDeviceId(newDeviceId);
      console.log('New device ID:', newDeviceId);
      
      // 自动注册新账号
      const result = await register();
      console.log('Register result:', result);
      onLogin();
      onClose();
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || '注册失败: ' + JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            欢迎使用 MoodFlow
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            本设备自动识别，无需记忆账号密码
          </p>

          {deviceId && (
            <p className="text-xs text-gray-400 text-center break-all">
              设备ID: {deviceId}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded-lg text-center text-xs break-all">
              {error}
            </p>
          )}

          <button
            onClick={handleAutoLogin}
            disabled={loading}
            className="w-full py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                自动登录 / 注册
              </>
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">或</span>
            </div>
          </div>

          <button
            onClick={handleNewAccount}
            disabled={loading}
            className="w-full py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            创建新账号
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400 text-center">
          每个设备对应一个独立账号，数据自动云端同步
        </p>
      </div>
    </div>
  );
}
