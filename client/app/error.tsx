'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="text-destructive mb-4">
        <AlertCircle className="h-16 w-16" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">出错了</h2>
      <p className="text-muted-foreground mb-4">抱歉，处理您的请求时发生了错误</p>
      <Button
        variant="outline"
        onClick={() => reset()}
      >
        重试
      </Button>
    </div>
  )
} 