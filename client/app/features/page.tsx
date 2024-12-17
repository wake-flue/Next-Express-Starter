'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from 'components/ui/card';
import { PageLayout } from 'components/common/PageLayout';
import { Code2, Server, FileJson, Palette } from 'lucide-react';

export default function Features() {
  return (
    <PageLayout>
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          功能特性
        </h1>
        <p className="text-xl text-gray-600">
          探索 Next-Express Starter 提供的强大功能
        </p>
      </motion.div>

      {/* 功能卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <FeatureCard
          title="Next.js 13+ App Router"
          description="使用最新的 Next.js App Router 特性，支持服务端组件和客户端组件的混合使用"
          icon={Code2}
        />
        <FeatureCard
          title="Express 后端"
          description="使用 Express.js 构建可靠的后端 API，支持 REST 和 WebSocket"
          icon={Server}
        />
        <FeatureCard
          title="TypeScript"
          description="全栈 TypeScript 支持，提供完整的类型安全"
          icon={FileJson}
        />
        <FeatureCard
          title="Tailwind CSS"
          description="使用 Tailwind CSS 构建现代化的用户界面"
          icon={Palette}
        />
      </motion.div>
    </PageLayout>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h2>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
