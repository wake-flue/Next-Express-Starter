import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from 'lib/utils';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'default',
  fullScreen = false,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const Wrapper = fullScreen ? 'div' : React.Fragment;
  const wrapperProps = fullScreen
    ? { className: 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm' }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <div
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size])} />
      </div>
    </Wrapper>
  );
};

export default Loading; 