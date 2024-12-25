import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">加载中...</p>
    </div>
  )
} 