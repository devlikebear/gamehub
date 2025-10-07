'use client';

import React from 'react';

interface GameOverlayProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  visible: boolean;
  accentColor?: string;
}

export function GameOverlay({ title, subtitle, actions, visible, accentColor = '#00f0ff' }: GameOverlayProps) {
  if (!visible) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20">
      <div className="text-center space-y-4 px-6">
        <h2 className="pixel-text text-3xl md:text-4xl" style={{ color: accentColor }}>
          {title}
        </h2>
        {subtitle ? (
          <p className="pixel-text text-sm md:text-base text-bright">
            {subtitle}
          </p>
        ) : null}
        {actions ? <div className="flex items-center justify-center gap-3 text-bright">{actions}</div> : null}
      </div>
    </div>
  );
}
