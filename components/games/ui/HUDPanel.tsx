'use client';

import React from 'react';

interface HUDPanelProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export function HUDPanel({ left, center, right }: HUDPanelProps) {
  return (
    <div className="absolute top-4 left-0 right-0 px-6 flex items-start justify-between pointer-events-none z-10">
      <div className="pixel-text text-sm text-bright" style={{ minWidth: '140px' }}>
        {left}
      </div>
      <div className="pixel-text text-sm text-bright text-center" style={{ minWidth: '140px' }}>
        {center}
      </div>
      <div className="pixel-text text-sm text-bright text-right" style={{ minWidth: '140px' }}>
        {right}
      </div>
    </div>
  );
}
