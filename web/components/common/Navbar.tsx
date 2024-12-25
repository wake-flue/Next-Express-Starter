'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, LayoutDashboard } from 'lucide-react';
import { Button } from 'components/ui/button';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    // 对于dashboard下的子路由，当前路径以path开头就认为是激活状态
    if (path.startsWith('/dashboard')) {
      return pathname?.startsWith(path);
    }
    // 其他路由保持完全匹配
    return pathname === path;
  };

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/about', label: '关于' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold">
                N
              </div>
              Next-Express
            </Link>

            {/* Navigation Links */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:text-gray-600"
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
                      animate
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* GitHub */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-gray-900"
              asChild
            >
              <a
                href="https://github.com/your-repo/next-express-starter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </Button>

            {/* Dashboard Button */}
            <Button
              variant={isActive('/dashboard') ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2 shadow-sm"
              asChild
            >
              <Link href="/dashboard">
                <LayoutDashboard className="w-4 h-4" />
                <span>控制台</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 