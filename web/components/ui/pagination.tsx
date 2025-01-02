import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>上一页</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span>下一页</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">更多页面</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}

// 高级分页组件
interface AdvancedPaginationProps extends React.ComponentProps<"nav"> {
  page: number
  pageSize: number
  total?: number
  siblingsCount?: number
  onChange?: (page: number) => void
}

const range = (start: number, end: number) => {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export function AdvancedPagination({
  page,
  pageSize,
  total = 0,
  siblingsCount = 1,
  onChange,
  className,
  ...props
}: AdvancedPaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onChange?.(newPage)
    }
  }

  // 生成页码数组
  const generatePagination = () => {
    // 如果总页数小于7，显示所有页码
    if (totalPages <= 7) {
      return range(1, totalPages)
    }

    // 计算左右兄弟页码
    const leftSiblingIndex = Math.max(page - siblingsCount, 1)
    const rightSiblingIndex = Math.min(page + siblingsCount, totalPages)

    // 是否显示左右省略号
    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    // 只显示右省略号
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingsCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, 'dots', totalPages]
    }

    // 只显示左省略号
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingsCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)
      return [1, 'dots', ...rightRange]
    }

    // 显示两个省略号
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)
      return [1, 'dots', ...middleRange, 'dots', totalPages]
    }

    return []
  }

  const pages = generatePagination()

  if (!total || totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm text-gray-500 whitespace-nowrap">共 {total} 条</div>
      <Pagination className={className} {...props}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(page - 1)}
              className={cn(page <= 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
          
          {pages.map((pageNumber, i) => (
            <PaginationItem key={i}>
              {pageNumber === 'dots' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(pageNumber as number)}
                  isActive={pageNumber === page}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(page + 1)}
              className={cn(page >= totalPages && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
