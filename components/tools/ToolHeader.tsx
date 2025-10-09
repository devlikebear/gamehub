/**
 * 도구 헤더 컴포넌트
 */

import React from 'react';

interface ToolHeaderProps {
  title: string;
  description: string;
  icon?: string;
  neonColor?: 'pink' | 'cyan' | 'purple' | 'yellow';
}

const neonColors = {
  pink: 'text-[#ff10f0] shadow-[0_0_20px_rgba(255,16,240,0.5)]',
  cyan: 'text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.5)]',
  purple: 'text-[#9d00ff] shadow-[0_0_20px_rgba(157,0,255,0.5)]',
  yellow: 'text-[#ffff00] shadow-[0_0_20px_rgba(255,255,0,0.5)]',
};

export function ToolHeader({
  title,
  description,
  icon = '🎨',
  neonColor = 'cyan',
}: ToolHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-6xl">{icon}</span>
        <div>
          <h1
            className={`text-4xl md:text-5xl font-bold ${neonColors[neonColor]}`}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              letterSpacing: '0.1em',
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      <p className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed">
        {description}
      </p>

      {/* CRT 스캔라인 효과 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(transparent 50%, rgba(0,0,0,0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
    </header>
  );
}
