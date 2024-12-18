import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { motion } from 'framer-motion';
import { Code2, Database, Lock, Rocket, Sparkles, Zap } from 'lucide-react';

const features = [
  {
    icon: <Code2 className="w-8 h-8 text-blue-500" />,
    title: '类型安全',
    description: '使用 TypeScript 和 ESLint 确保代码质量和类型安全'
  },
  {
    icon: <Database className="w-8 h-8 text-green-500" />,
    title: '数据管理',
    description: '集成 MongoDB 数据库，提供完整的数据持久化解决方案'
  },
  {
    icon: <Lock className="w-8 h-8 text-purple-500" />,
    title: '安全防护',
    description: '内置安全中间件和认证机制，保护您的应用程序'
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    title: '高性能',
    description: '优化的构建配置和缓存策略，确保最佳性能'
  },
  {
    icon: <Sparkles className="w-8 h-8 text-pink-500" />,
    title: '现代UI',
    description: '基于 Tailwind CSS 和 shadcn/ui 的精美组件库'
  },
  {
    icon: <Rocket className="w-8 h-8 text-orange-500" />,
    title: '快速部署',
    description: '支持 Docker 容器化和自动化 CI/CD 部署流程'
  }
];

export function FeatureSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">特色功能</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            我们提供一套完整的开发工具和功能，帮助您快速构建现代化的 Web 应用
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 