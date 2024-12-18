'use client';

import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { 
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// 示例数据
const stats = [
  {
    title: '活跃用户',
    value: '2,420',
    change: '+12%',
    trend: 'up',
    icon: Users,
  },
  {
    title: '系统状态',
    value: '99.9%',
    change: '正常',
    trend: 'up',
    icon: Activity,
  },
  {
    title: 'API请求',
    value: '45.5k',
    change: '+8%',
    trend: 'up',
    icon: BarChart3,
  }
];

const recentActivities = [
  {
    icon: CheckCircle2,
    color: 'text-green-500',
    bg: 'bg-green-50',
    title: '系统更新完成',
    description: '成功部署新版本 v1.2.0',
    time: '10分钟前'
  },
  {
    icon: XCircle,
    color: 'text-red-500',
    bg: 'bg-red-50',
    title: '检测到异常',
    description: '数据库连接超时，已自动恢复',
    time: '1小时前'
  },
  {
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    title: '定时任务执行',
    description: '完成数据备份任务',
    time: '2小时前'
  }
];

const quickActions = [
  {
    title: '待办事项',
    description: '管理你的任务清单',
    path: '/dashboard/todos',
    stats: '8 个待处理'
  },
  {
    title: '系统日志',
    description: '查看系统运行状态',
    path: '/dashboard/system-logs',
    stats: '289 条记录'
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-500 mt-2">
          查看系统运行状态和关键指标
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-gray-50">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  {stat.trend === 'up' ? (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      {stat.change}
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 text-sm font-medium">
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 快捷操作 */}
      <div className="grid gap-6 md:grid-cols-2">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <Link href={action.path}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{action.stats}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${activity.bg}`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
