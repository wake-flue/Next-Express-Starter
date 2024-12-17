import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { Paintbrush, Move, Plus, Minus, RotateCcw } from 'lucide-react';

export function InteractiveDemo() {
  const [count, setCount] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [rotation, setRotation] = useState(0);

  const colors = [
    { value: '#3B82F6', label: '蓝色' },
    { value: '#10B981', label: '绿色' },
    { value: '#F59E0B', label: '黄色' },
    { value: '#EF4444', label: '红色' },
  ];

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>交互示例</CardTitle>
          <CardDescription>探索一些有趣的交互效果</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左侧：计数器和动画 */}
        <div className="space-y-6">
          {/* 计数器 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">计数器示例</CardTitle>
                <CardDescription>简单的状态管理演示</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCount(count - 1)}
                    className="w-12 h-12 rounded-full"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="text-4xl font-bold text-gray-900 w-16 text-center">
                    {count}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCount(count + 1)}
                    className="w-12 h-12 rounded-full"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 动画卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Move className="w-4 h-4" />
                  动画效果
                </CardTitle>
                <CardDescription>Framer Motion 动画演示</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCardVisible(!isCardVisible)}
                    >
                      {isCardVisible ? '隐藏' : '显示'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRotation(rotation + 90)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      旋转
                    </Button>
                  </div>
                  <AnimatePresence mode="wait">
                    {isCardVisible && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: rotation,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20
                        }}
                        className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 右侧：颜色选择器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Paintbrush className="w-4 h-4" />
                颜色选择器
              </CardTitle>
              <CardDescription>动态样式变化演示</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className="h-40 rounded-lg transition-colors"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="flex gap-3 justify-center">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                        selectedColor === color.value ? 'ring-2 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 