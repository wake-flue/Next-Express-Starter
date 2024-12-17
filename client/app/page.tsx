'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from 'components/ui/card';
import { PageLayout } from 'components/common/PageLayout';
import { InteractiveDemo } from 'components/features/InteractiveDemo';
import { Button } from 'components/ui/button';
import { Badge } from 'components/ui/badge';
import { ArrowRight, Github, Star, GitBranch, Users } from 'lucide-react';

export default function Home() {
  return (
    <PageLayout>
      {/* Hero 区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Badge variant="secondary" className="mb-4">
            v1.0.0 现已发布 🎉
          </Badge>
        </motion.div>
        <h1 className="text-5xl font-bold gradient-text mb-6 leading-tight">
          Next-Express Starter
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto text-balance">
          一个现代化的全栈开发脚手架，集成了最新的技术栈和最佳实践，
          帮助你快速启动新项目
        </p>
        <div className="flex gap-4 justify-center mb-12">
          <Button size="lg" className="hover-card">
            快速开始
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="hover-card">
            <Github className="mr-2 h-4 w-4" />
            查看源码
          </Button>
        </div>
        
        {/* 项目数据 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          <div className="glass-card rounded-lg p-6 hover-card">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              1.2k
            </div>
            <p className="text-gray-600 dark:text-gray-400">GitHub Stars</p>
          </div>
          <div className="glass-card rounded-lg p-6 hover-card">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <GitBranch className="h-5 w-5 text-blue-500" />
              150+
            </div>
            <p className="text-gray-600 dark:text-gray-400">Forks</p>
          </div>
          <div className="glass-card rounded-lg p-6 hover-card md:col-span-1 col-span-2">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <Users className="h-5 w-5 text-green-500" />
              500+
            </div>
            <p className="text-gray-600 dark:text-gray-400">Active Users</p>
          </div>
        </div>
      </motion.div>

      {/* 技术栈展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 px-4"
      >
        <TechCard 
          title="Next.js" 
          description="React 框架，支持SSR和静态生成" 
        />
        <TechCard 
          title="Express" 
          description="灵活的 Node.js Web 应用框架" 
        />
        <TechCard 
          title="TypeScript" 
          description="带有类型系统的 JavaScript 超集" 
        />
        <TechCard 
          title="Tailwind" 
          description="实用优先的 CSS 框架" 
        />
      </motion.div>

      {/* 特性展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid md:grid-cols-3 gap-8 mb-16 px-4"
      >
        <FeatureCard
          title="快速开发"
          description="预配置开发环境，支持热重载，让你专注于业务逻辑的开发"
        />
        <FeatureCard
          title="类型安全"
          description="TypeScript 支持，自动类型推断，减少运行时错误"
        />
        <FeatureCard
          title="现代化部署"
          description="支持 Docker 容器化部署，CI/CD 流程集成"
        />
      </motion.div>

      {/* 交互示例 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="px-4"
      >
        <h2 className="text-3xl font-bold text-center mb-8 gradient-text">交互演示</h2>
        <InteractiveDemo />
      </motion.div>
    </PageLayout>
  );
}

function TechCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="hover-card glass-card">
      <CardContent className="p-6 text-center">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="hover-card glass-card">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}
