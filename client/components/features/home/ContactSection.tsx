import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Input } from 'components/ui/input';
import { Textarea } from 'components/ui/textarea';
import { motion } from 'framer-motion';
import { Github, Mail, MessageSquare, Twitter } from 'lucide-react';
import { useState } from 'react';

const socialLinks = [
  {
    icon: <Github className="w-5 h-5" />,
    name: 'GitHub',
    href: 'https://github.com/your-repo/next-express-starter',
    color: 'hover:text-gray-900 hover:bg-gray-50'
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    name: 'Twitter',
    href: 'https://twitter.com/your-handle',
    color: 'hover:text-blue-400 hover:bg-blue-50'
  },
  {
    icon: <Mail className="w-5 h-5" />,
    name: 'Email',
    href: 'mailto:contact@example.com',
    color: 'hover:text-red-500 hover:bg-red-50'
  }
];

const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg
      className="absolute bottom-0 w-full h-36 text-gray-50"
      viewBox="0 0 1440 320"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fillOpacity="1"
        d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  </div>
);

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <section className="relative py-12 bg-gradient-to-b from-white to-gray-50">
      <WaveBackground />
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
            联系我们
          </span>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            让我们开始对话
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            有任何问题或建议？请随时与我们联系，我们将尽快回复您
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* 联系表单 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <Card className="backdrop-blur-sm bg-white/90 shadow-lg">
              <CardHeader className="pb-4 space-y-1">
                <CardTitle className="text-xl">发送消息</CardTitle>
                <CardDescription className="text-sm">
                  填写下面的表单，我们会尽快与您联系
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div>
                    <Input 
                      placeholder="您的名字"
                      value={formState.name}
                      onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                    />
                  </div>
                  <div>
                    <Input 
                      type="email" 
                      placeholder="您的邮箱"
                      value={formState.email}
                      onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="请输入您的消息"
                      value={formState.message}
                      onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
                      className="min-h-[100px] transition-all duration-300 focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                    />
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        发送中...
                      </div>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        发送消息
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* 社交媒体和其他联系方式 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <Card className="backdrop-blur-sm bg-white/90 shadow-lg">
              <CardHeader className="pb-4 space-y-1">
                <CardTitle className="text-xl">其他联系方式</CardTitle>
                <CardDescription className="text-sm">
                  通过以下方式关注我们的最新动态
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center p-3 rounded-lg border transition-all duration-300 ${link.color} group`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white transition-colors duration-300">
                        {link.icon}
                      </div>
                      <span className="ml-3 font-medium text-sm">{link.name}</span>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/90 shadow-lg">
              <CardContent className="pt-4">
                <div className="text-center p-3 rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-blue-700 mb-2 text-sm">工作时间</h3>
                  <p className="text-blue-600 text-sm">周一至周五: 9:00 - 18:00</p>
                  <p className="text-blue-600 text-sm">周末: 10:00 - 16:00</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 