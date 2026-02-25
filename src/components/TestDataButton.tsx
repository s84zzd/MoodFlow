/**
 * 测试数据按钮
 * 用于生成30天测试数据
 */

import { useState } from 'react';
import { Database, Trash2 } from 'lucide-react';
import { saveTestDataToStorage, clearTestData, hasTestData } from '@/data/generateTestData';

export function TestDataButton() {
  const [hasData, setHasData] = useState(hasTestData());
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenerate = () => {
    saveTestDataToStorage();
    setHasData(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    // 刷新页面以加载新数据
    window.location.reload();
  };

  const handleClear = () => {
    clearTestData();
    setHasData(false);
    window.location.reload();
  };

  // 只在开发环境显示
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2">
      {showSuccess && (
        <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
          测试数据已生成！
        </div>
      )}
      
      {hasData ? (
        <button
          onClick={handleClear}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          title="清除测试数据"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={handleGenerate}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2"
          title="生成30天测试数据"
        >
          <Database className="w-5 h-5" />
          <span className="text-sm font-medium pr-1">测试数据</span>
        </button>
      )}
    </div>
  );
}
