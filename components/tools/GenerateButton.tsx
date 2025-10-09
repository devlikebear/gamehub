/**
 * 생성 버튼 컴포넌트 (네온 효과)
 */

'use client';

import React from 'react';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  neonColor?: 'pink' | 'cyan' | 'purple' | 'yellow';
  fullWidth?: boolean;
}

const neonStyles = {
  pink: {
    base: 'bg-[#ff10f0] text-white border-[#ff10f0]',
    hover: 'hover:bg-[#ff10f0]/80 hover:shadow-[0_0_30px_rgba(255,16,240,0.8)]',
    glow: 'shadow-[0_0_20px_rgba(255,16,240,0.5)]',
  },
  cyan: {
    base: 'bg-[#00f0ff] text-black border-[#00f0ff]',
    hover: 'hover:bg-[#00f0ff]/80 hover:shadow-[0_0_30px_rgba(0,240,255,0.8)]',
    glow: 'shadow-[0_0_20px_rgba(0,240,255,0.5)]',
  },
  purple: {
    base: 'bg-[#9d00ff] text-white border-[#9d00ff]',
    hover: 'hover:bg-[#9d00ff]/80 hover:shadow-[0_0_30px_rgba(157,0,255,0.8)]',
    glow: 'shadow-[0_0_20px_rgba(157,0,255,0.5)]',
  },
  yellow: {
    base: 'bg-[#ffff00] text-black border-[#ffff00]',
    hover: 'hover:bg-[#ffff00]/80 hover:shadow-[0_0_30px_rgba(255,255,0,0.8)]',
    glow: 'shadow-[0_0_20px_rgba(255,255,0,0.5)]',
  },
};

export function GenerateButton({
  onClick,
  disabled = false,
  loading = false,
  children,
  neonColor = 'cyan',
  fullWidth = false,
}: GenerateButtonProps) {
  const styles = neonStyles[neonColor];

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${fullWidth ? 'w-full' : 'px-8'}
        py-4 rounded-lg font-bold text-lg uppercase tracking-wide
        border-2
        ${styles.base}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : styles.hover}
        ${!disabled && !loading ? styles.glow : ''}
        transition-all duration-200
        transform active:scale-95
        flex items-center justify-center gap-3
      `}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
