import { apiRequest } from './client';

export interface User {
  id: string;
  deviceId: string;
  phone: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// 生成设备ID作为用户名
export function generateDeviceId(): string {
  const stored = localStorage.getItem('moodflow_device_id');
  if (stored) return stored;
  
  const newId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('moodflow_device_id', newId);
  return newId;
}

// 默认密码（无感登录）
const DEFAULT_PASSWORD = '0000';

// 注册（使用默认密码）
export async function register(phone?: string): Promise<AuthResponse> {
  const deviceId = generateDeviceId();
  return apiRequest<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify({ 
      username: deviceId,
      password: DEFAULT_PASSWORD,
      nickname: phone || deviceId
    }),
  });
}

// 登录（使用默认密码，无感登录）
export async function autoLogin(): Promise<AuthResponse> {
  const deviceId = generateDeviceId();
  try {
    // 尝试登录
    const response = await apiRequest<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ 
        username: deviceId,
        password: DEFAULT_PASSWORD
      }),
    });
    
    localStorage.setItem('moodflow_token', response.token);
    localStorage.setItem('moodflow_user', JSON.stringify(response.user));
    return response;
  } catch (err: any) {
    // 如果用户不存在，自动注册
    if (err.message?.includes('错误') || err.message?.includes('Invalid')) {
      const regResponse = await register();
      localStorage.setItem('moodflow_token', regResponse.token);
      localStorage.setItem('moodflow_user', JSON.stringify(regResponse.user));
      return regResponse;
    }
    throw err;
  }
}

// 登出
export function logout(): void {
  localStorage.removeItem('moodflow_token');
  localStorage.removeItem('moodflow_user');
}

// 获取当前用户
export function getCurrentUser(): User | null {
  const stored = localStorage.getItem('moodflow_user');
  return stored ? JSON.parse(stored) : null;
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return !!localStorage.getItem('moodflow_token');
}
