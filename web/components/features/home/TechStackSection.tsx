import { motion } from 'framer-motion';
import Image from 'next/image';

const technologies = [
  {
    name: 'Next.js',
    icon: '/icons/nextjs.svg',
    description: '基于 React 的全栈框架'
  },
  {
    name: 'TypeScript',
    icon: '/icons/typescript.svg',
    description: '类型安全的 JavaScript 超集'
  },
  {
    name: 'Express',
    icon: '/icons/express.svg',
    description: '快速、灵活的 Node.js Web 框架'
  },
  {
    name: 'MongoDB',
    icon: '/icons/mongodb.svg',
    description: '高性能 NoSQL 数据库'
  },
  {
    name: 'Tailwind CSS',
    icon: '/icons/tailwind.svg',
    description: '实用优先的 CSS 框架'
  },
  {
    name: 'Docker',
    icon: '/icons/docker.svg',
    description: '容器化部署解决方案'
  }
];

export function TechStackSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">技术栈</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            采用现代化的技术栈，为您提供最佳的开发体验和应用性能
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 mb-4 relative transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-semibold mb-2">{tech.name}</h3>
              <p className="text-sm text-gray-600">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 