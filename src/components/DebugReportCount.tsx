/**
 * 调试组件：查看和重置周报月报手动生成次数
 * 仅在开发环境显示
 */

import { useState, useEffect } from 'react';
import { getRemainingManualCount } from '@/services/reportService';

export function DebugReportCount() {
  // 只在开发环境显示
  if (import.meta.env.PROD) return null;

  const [weeklyRemaining, setWeeklyRemaining] = useState(0);
  const [monthlyRemaining, setMonthlyRemaining] = useState(0);

  const updateCounts = () => {
    setWeeklyRemaining(getRemainingManualCount('weekly'));
    setMonthlyRemaining(getRemainingManualCount('monthly'));
  };

  useEffect(() => {
    updateCounts();
  }, []);

  const resetWeekly = () => {
    const now = new Date();
    const year = now.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    const periodKey = `${year}-W${week.toString().padStart(2, '0')}`;
    const key = `moodflow_report_manual_count_weekly_${periodKey}`;
    
    localStorage.removeItem(key);
    alert(`已重置周报手动生成次数\n周期: ${periodKey}`);
    updateCounts();
  };

  const resetMonthly = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const periodKey = `${year}-M${month.toString().padStart(2, '0')}`;
    const key = `moodflow_report_manual_count_monthly_${periodKey}`;
    
    localStorage.removeItem(key);
    alert(`已重置月报手动生成次数\n周期: ${periodKey}`);
    updateCounts();
  };

  const clearAllReportData = () => {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('moodflow_report_')
    );
    
    keys.forEach(key => localStorage.removeItem(key));
    alert(`已清除所有报告相关数据 (${keys.length} 条)`);
    updateCounts();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-200 max-w-xs z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-700">📊 报告次数调试</h3>
        <span className="text-[10px] text-red-500">DEV ONLY</span>
      </div>
      
      <div className="space-y-3">
        {/* 周报 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">周报剩余次数</p>
            <p className="text-lg font-bold text-blue-600">
              {weeklyRemaining >= 999 ? '∞' : `${weeklyRemaining} / 2`}
            </p>
          </div>
          <button
            onClick={resetWeekly}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded text-[10px] text-white font-medium"
          >
            重置
          </button>
        </div>

        {/* 月报 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">月报剩余次数</p>
            <p className="text-lg font-bold text-purple-600">
              {monthlyRemaining >= 999 ? '∞' : `${monthlyRemaining} / 4`}
            </p>
          </div>
          <button
            onClick={resetMonthly}
            className="px-2 py-1 bg-purple-500 hover:bg-purple-600 rounded text-[10px] text-white font-medium"
          >
            重置
          </button>
        </div>

        {/* 清除所有 */}
        <button
          onClick={clearAllReportData}
          className="w-full px-2 py-1.5 bg-red-500 hover:bg-red-600 rounded text-xs text-white font-medium"
        >
          清除所有报告数据
        </button>
      </div>
    </div>
  );
}
