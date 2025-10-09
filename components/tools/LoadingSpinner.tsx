/**
 * 로딩 스피너 컴포넌트 (레트로 스타일)
 */

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  neonColor?: 'pink' | 'cyan' | 'purple' | 'yellow';
}

const neonColors = {
  pink: '#ff10f0',
  cyan: '#00f0ff',
  purple: '#9d00ff',
  yellow: '#ffff00',
};

export function LoadingSpinner({
  message = '생성 중...',
  neonColor = 'cyan',
}: LoadingSpinnerProps) {
  const color = neonColors[neonColor];

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      {/* 레트로 스타일 스피너 */}
      <div className="relative w-16 h-16">
        <div
          className="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin"
          style={{
            borderColor: `${color} transparent transparent transparent`,
            boxShadow: `0 0 20px ${color}80`,
          }}
        />
        <div
          className="absolute inset-2 border-4 border-b-transparent rounded-full animate-spin"
          style={{
            borderColor: `transparent transparent ${color} transparent`,
            boxShadow: `0 0 15px ${color}60`,
            animationDirection: 'reverse',
            animationDuration: '0.8s',
          }}
        />
      </div>

      {/* 로딩 메시지 */}
      <p
        className="text-lg font-bold uppercase tracking-wide animate-pulse"
        style={{ color, textShadow: `0 0 10px ${color}80` }}
      >
        {message}
      </p>

      {/* 픽셀 도트 애니메이션 */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
