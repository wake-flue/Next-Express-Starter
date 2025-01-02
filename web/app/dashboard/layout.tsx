'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  ScrollText,
  ChevronRight,
  ArrowLeft,
  Settings,
  Bell,
  Search,
  Menu,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { Button } from 'components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Input } from 'components/ui/input';
import { cn } from '@/lib/utils';

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
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (item: typeof sidebarItems[0]) => {
    if (item.exact) {
      return pathname === item.path;
    }
    return pathname?.startsWith(item.path);
  };

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(item => isActive(item));
    return currentItem?.label || '控制台';
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* 固定顶部导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm h-14">
        <div className="h-full px-4 flex items-center justify-between gap-4">
          {/* 左侧区域 */}
          <div className="flex items-center gap-2">
            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-500 hover:text-gray-900 h-8 w-8"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            {/* 桌面端折叠按钮 */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-gray-500 hover:text-gray-900 h-8 w-8"
            >
              {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>

            <Link 
              href="/" 
              className="flex items-center gap-2 text-base font-semibold text-gray-900"
            >
              <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                N
              </div>
              <span className={cn(
                "transition-all duration-300",
                collapsed ? "lg:hidden" : ""
              )}>Next-Express</span>
            </Link>
          </div>

          {/* 中间区域 */}
          <div className="flex-1 max-w-4xl hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="search"
                placeholder="搜索..."
                className="w-full max-w-md pl-10 h-8 bg-gray-50/50 border-0 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900 h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-right">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">admin@example.com</div>
              </div>
              <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                <AvatarImage src="/avatars/01.png" alt="用户头像" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区 */}
      <div className="pt-14 flex">
        {/* 移动端遮罩 */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* 侧边栏 */}
        <aside className={cn(
          "fixed top-14 left-0 bottom-0 z-40",
          "bg-white/80 backdrop-blur-md shadow-sm",
          "transition-all duration-300 ease-in-out",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-16" : "lg:w-64",
          "w-64"
        )}>
          <nav className="p-2 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium",
                    "transition-all duration-200 relative group",
                    active 
                      ? "text-blue-600 bg-blue-50/80 hover:bg-blue-50" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  <span className={cn(
                    "truncate transition-all duration-200",
                    collapsed ? "lg:hidden" : "",
                    active ? "font-semibold" : ""
                  )}>
                    {item.label}
                  </span>
                  {!collapsed && (
                    <ChevronRight 
                      className={cn(
                        "w-4 h-4 ml-auto",
                        "transition-all duration-200",
                        "opacity-0 group-hover:opacity-100",
                        active ? "opacity-100 text-blue-600" : "text-gray-400"
                      )}
                    />
                  )}
                  {active && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* 主内容区域 - 带有左边距以避开侧边栏 */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "lg:ml-16" : "lg:ml-64",
          "ml-0"
        )}>
          {/* 页面标题区域 */}
          <div className="sticky top-14 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="px-4 sm:px-6 h-10 flex items-center justify-between">
              {/* 左侧标题 */}
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium text-gray-700">
                  {getCurrentPageTitle()}
                </h1>
                <div className="h-4 w-px bg-gray-200" />
                <span className="text-xs text-gray-400">
                  管理和查看您的{getCurrentPageTitle()}
                </span>
              </div>
            </div>
          </div>          
          {/* 内容区域 - 计算剩余高度 */}
          <div className="h-[calc(100vh-7rem)] overflow-hidden">
            <div className="p-4 sm:p-6 h-full overflow-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 