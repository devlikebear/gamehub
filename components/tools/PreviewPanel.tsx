/**
 * 미리보기 패널 컴포넌트
 */

'use client';

import React from 'react';

interface PreviewPanelProps {
  title?: string;
  children: React.ReactNode;
  neonColor?: 'pink' | 'cyan' | 'purple' | 'yellow';
}

const neonBorder = {
  pink: 'border-[#ff10f0]/30 shadow-[0_0_20px_rgba(255,16,240,0.3)]',
  cyan: 'border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  purple: 'border-[#9d00ff]/30 shadow-[0_0_20px_rgba(157,0,255,0.3)]',
  yellow: 'border-[#ffff00]/30 shadow-[0_0_20px_rgba(255,255,0,0.3)]',
};

const neonText = {
  pink: 'text-[#ff10f0]',
  cyan: 'text-[#00f0ff]',
  purple: 'text-[#9d00ff]',
  yellow: 'text-[#ffff00]',
};

export function PreviewPanel({
  title = '미리보기',
  children,
  neonColor = 'cyan',
}: PreviewPanelProps) {
  return (
    <div
      className={`
      bg-black/80 border-2 rounded-lg p-6
      ${neonBorder[neonColor]}
      backdrop-blur-sm
    `}
    >
      {title && (
        <h3
          className={`
          text-lg font-bold uppercase tracking-wide mb-4
          ${neonText[neonColor]}
        `}
        >
          {title}
        </h3>
      )}

      <div className="min-h-[200px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
