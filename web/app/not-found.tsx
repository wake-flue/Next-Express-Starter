import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="text-muted-foreground mb-4">
        <FileQuestion className="h-16 w-16" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">页面未找到</h2>
      <p className="text-muted-foreground mb-4">抱歉，您访问的页面不存在</p>
      <Button asChild>
        <Link href="/">
          返回首页
        </Link>
      </Button>
    </div>
  )
} 