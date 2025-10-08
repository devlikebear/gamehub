'use client';

interface RetroLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'pink' | 'yellow' | 'green' | 'purple';
}

export default function RetroLoader({ size = 'md', color = 'cyan' }: RetroLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const colorClasses = {
    cyan: 'border-bright-cyan',
    pink: 'border-bright-pink',
    yellow: 'border-bright-yellow',
    green: 'border-bright-green',
    purple: 'border-bright-purple',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-4 border-t-transparent rounded-full animate-spin`}
        style={{
          boxShadow: `0 0 10px currentColor, 0 0 20px currentColor`,
        }}
      />
    </div>
  );
}
