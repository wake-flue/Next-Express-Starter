'use client';

import React from 'react';
import { Navbar } from 'components/common/Navbar';
import { TodoList } from 'components/features/TodoList';

export default function TodoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              待办事项管理
            </h1>
            <p className="text-xl text-gray-600">
              使用 React Query 和 Express 构建的全栈待办事项应用
            </p>
          </div>

          {/* Todo列表 */}
          <TodoList />
        </div>
      </div>
    </div>
  );
} 