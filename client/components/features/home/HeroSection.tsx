import { motion } from 'framer-motion';
import { Badge } from 'components/ui/badge';
import { Button } from 'components/ui/button';
import { ArrowRight, Github, Sparkles, Star, GitBranch, Code2, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function HeroSection() {
  useEffect(() => {
    const duration = 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

    const shootConfetti = () => {
      const timeLeft = animationEnd - Date.now();
      
      // 左下角喷射
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 1 },
        colors: colors,
        ticks: 100,
        gravity: 0.8,
        scalar: 1.2,
        drift: -0.8,
        startVelocity: 80,
        decay: 0.9,
      });
      
      // 右下角喷射
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 1 },
        colors: colors,
        ticks: 100,
        gravity: 0.8,
        scalar: 1.2,
        drift: 0.8,
        startVelocity: 80,
        decay: 0.9,
      });

      if (timeLeft > 0) {
        requestAnimationFrame(shootConfetti);
      }
    };

    shootConfetti();
  }, []);

  return (
    <div className="hero-gradient min-h-screen flex flex-col justify-between relative -mt-16">
      {/* 背景装饰 */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* 渐变光晕 */}
        <div className="absolute top-1/4 -left-24 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" />
        <div className="absolute top-1/3 -right-24 w-[600px] h-[600px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute -bottom-48 left-1/3 w-[600px] h-[600px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: '-4s' }} />
        
        {/* 装饰性网格 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        {/* 渐变叠加 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="relative z-10 flex-1 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-12 md:space-y-16 py-12 md:py-20"
          >
            {/* 版本标签 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center"
            >
              <Badge variant="secondary" className="px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                <Sparkles className="w-4 h-4 mr-2 inline-block animate-pulse" />
                v1.0.0 现已发布
              </Badge>
            </motion.div>

            {/* 标题区域 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold gradient-text tracking-tight max-w-4xl mx-auto">
                Next-Express Starter
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-balance leading-relaxed">
                一个现代化的全栈开发脚手架，集成了最新的技术栈和最佳实践，
                <br className="hidden md:block" />
                帮助你快速启动新项目
              </p>
            </motion.div>

            {/* 按钮组 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center"
            >
              <Button 
                size="lg" 
                className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg hover-card w-full md:w-auto min-w-[200px]" 
                asChild
              >
                <Link href="/docs">
                  快速开始
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg hover-card w-full md:w-auto min-w-[200px]" 
                asChild
              >
                <a
                  href="https://github.com/your-repo/next-express-starter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-5 w-5" />
                  查看源码
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 统计数据和特性 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="relative z-10 w-full bg-white/50 backdrop-blur-sm border-t border-gray-200/50 dark:bg-gray-900/50 dark:border-gray-800/50"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {/* 统计数据 */}
            <div className="flex items-center gap-3 justify-center">
              <Star className="w-5 h-5 text-yellow-500" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">1.2k</div>
                <div className="text-sm text-gray-600">GitHub Stars</div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <GitBranch className="w-5 h-5 text-blue-500" />
              <div className="text-left">
                <div className="text-2xl font-bold text-gray-900">150+</div>
                <div className="text-sm text-gray-600">Forks</div>
              </div>
            </div>
            {/* 主要特性 */}
            <div className="flex items-center gap-3 justify-center">
              <Code2 className="w-5 h-5 text-green-500" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">类型安全</div>
                <div className="text-xs text-gray-600">TypeScript & ESLint</div>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Rocket className="w-5 h-5 text-purple-500" />
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">现代部署</div>
                <div className="text-xs text-gray-600">Docker & CI/CD</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 