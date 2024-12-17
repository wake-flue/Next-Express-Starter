'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'components/ui/card';
import { PageLayout } from 'components/common/PageLayout';
import { Info, Star, Rocket } from 'lucide-react';

export default function About() {
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
          关于项目
        </h1>
        <p className="text-xl text-gray-600">
          了解 Next-Express Starter 项目的详细信息
        </p>
      </motion.div>

      {/* 内容卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Info className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle>项目介绍</CardTitle>
              <CardDescription>项目概述和主要特点</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="prose lg:prose-lg">
            <p className="text-gray-600">
              Next-Express Starter 是一个现代化的全栈开发脚手架，旨在帮助开发者快速启动新项目。
              它集成了当前最流行的技术栈，并遵循最佳实践。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <CardTitle>主要特点</CardTitle>
              <CardDescription>技术栈和功能特性</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                基于 Next.js 13+ 的现代化前端框架
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Express.js 后端提供强大的 API 支持
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                TypeScript 确保类型安全
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Tailwind CSS 实现灵活的样式管理
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                开箱即用的开发环境配置
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                完整的项目结构和最佳实践
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Rocket className="w-8 h-8 text-green-500" />
            <div>
              <CardTitle>开始使用</CardTitle>
              <CardDescription>快速上手指南</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              克隆仓库并按照 README.md 中的说明进行设置。如果您有任何问题，
              请查看我们的文档或提交 issue。
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </PageLayout>
  );
}
