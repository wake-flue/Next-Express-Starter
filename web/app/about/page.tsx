'use client';

import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Github, Globe, Book, Code2, Laptop, Server, Wrench } from 'lucide-react';
import { Button } from 'components/ui/button';
import { PageLayout } from 'components/common/PageLayout';
import { motion } from 'framer-motion';

const features = [
  {
    title: '现代化技术栈',
    description: '使用 Next.js 13+ 和 Express.js 构建，采用最新的 Web 开发技术',
    icon: Code2,
    delay: 0.2
  },
  {
    title: '完整的文档',
    description: '提供详细的开发文档和API文档，帮助你快速上手',
    icon: Book,
    delay: 0.3
  },
  {
    title: '开源项目',
    description: '代码完全开源，欢迎贡献和提出建议',
    icon: Github,
    delay: 0.4
  },
  {
    title: '持续更新',
    description: '定期更新和维护，保持与最新技术同步',
    icon: Globe,
    delay: 0.5
  },
];

const techStack = [
  {
    category: '前端技术',
    icon: Laptop,
    items: [
      { name: 'Next.js', version: '13+', description: 'React 框架' },
      { name: 'React', version: '18.2.0', description: 'UI 库' },
      { name: 'TypeScript', version: '5.0.0', description: '类型系统' },
      { name: 'Tailwind CSS', version: '3.3.0', description: 'CSS 框架' },
      { name: 'Shadcn UI', version: '0.0.4', description: 'UI 组件库' },
    ],
  },
  {
    category: '后端技术',
    icon: Server,
    items: [
      { name: 'Node.js', version: '18.0.0', description: '运行时环境' },
      { name: 'Express', version: '4.18.0', description: 'Web 框架' },
      { name: 'MongoDB', version: '6.0.0', description: '数据库' },
      { name: 'Mongoose', version: '8.0.0', description: 'ODM 框架' },
    ],
  },
  {
    category: '开发工具',
    icon: Wrench,
    items: [
      { name: 'ESLint', version: '8.0.0', description: '代码检查' },
      { name: 'Prettier', version: '3.0.0', description: '代码格式化' },
      { name: 'Jest', version: '29.0.0', description: '测试框架' },
      { name: 'Docker', version: 'latest', description: '容器化部署' },
    ],
  },
];

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* 页面标题 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold gradient-text mb-4">关于项目</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              了解 Next-Express Starter 项目的详细信息
            </p>
          </motion.div>

          {/* 项目介绍 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="hover-card">
              <CardHeader>
                <CardTitle>项目概述</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Next-Express Starter 是一个现代化的全栈开发脚手架，旨在帮助开发者快速启动新项目。
                  它集成了当前最流行的技术栈和最佳实践，提供了一个可靠的开发基础。
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" size="lg" className="gap-2 hover-card" asChild>
                    <a
                      href="https://github.com/your-repo/next-express-starter"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2 hover-card" asChild>
                    <a
                      href="/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Book className="w-4 h-4" />
                      文档
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 特性列表 */}
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                >
                  <Card className="hover-card h-full">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* 技术栈 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="hover-card">
              <CardHeader>
                <CardTitle>技术栈</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {techStack.map((category, index) => {
                    const Icon = category.icon;
                    return (
                      <div key={index}>
                        <div className="flex items-center gap-2 mb-4">
                          <Icon className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-gray-900">
                            {category.category}
                          </h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          {category.items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className="p-4 rounded-lg border bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-gray-900">
                                  {item.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  v{item.version}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
} 