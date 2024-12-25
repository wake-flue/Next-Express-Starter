'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  ScrollText,
  ChevronRight,
  ArrowLeft,
  Settings,
  Bell
} from 'lucide-react';
import { Button } from 'components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';

const sidebarItems = [
  {
    path: '/dashboard',
    label: '概览',
    icon: LayoutDashboard,
    exact: true
  },
  {
    path: '/dashboard/todos',
    label: '待办事项',
    icon: CheckSquare
  },
  {
    path: '/dashboard/system-logs',
    label: '系统日志',
    icon: ScrollText
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (item: typeof sidebarItems[0]) => {
    if (item.exact) {
      return pathname === item.path;
    }
    return pathname?.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* 顶部导航 */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>返回首页</span>
                </Link>
              </Button>
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/01.png" alt="用户头像" />
                <AvatarFallback>用户</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* 侧边栏 */}
        <aside className="w-64 border-r bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">控制台</h2>
            <p className="text-sm text-gray-500">管理你的应用</p>
          </div>
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 relative group
                    ${active 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  <ChevronRight 
                    className={`
                      w-4 h-4 ml-auto opacity-0 group-hover:opacity-100
                      transition-opacity
                      ${active ? 'opacity-100 text-blue-600' : 'text-gray-400'}
                    `}
                  />
                  {active && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                      animate
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 