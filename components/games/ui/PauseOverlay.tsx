'use client';

import React from 'react';
import { GameOverlay } from './GameOverlay';

interface PauseOverlayProps {
  visible: boolean;
  onResume?: () => void;
  onRestart?: () => void;
  onExit?: () => void;
}

export function PauseOverlay({ visible, onResume, onRestart, onExit }: PauseOverlayProps) {
  const actions = (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs pixel-text">
      {onResume ? (
        <button type="button" onClick={onResume} className="px-3 py-2 border-2 border-bright-green text-bright-green rounded hover:bg-bright-green hover:text-black transition">
          RESUME (ESC)
        </button>
      ) : null}
      {onRestart ? (
        <button type="button" onClick={onRestart} className="px-3 py-2 border-2 border-bright-cyan text-bright-cyan rounded hover:bg-bright-cyan hover:text-black transition">
          RESTART (R)
        </button>
      ) : null}
      {onExit ? (
        <button type="button" onClick={onExit} className="px-3 py-2 border-2 border-bright-pink text-bright-pink rounded hover:bg-bright-pink hover:text-black transition">
          EXIT
        </button>
      ) : null}
    </div>
  );

  return (
    <GameOverlay
      title="PAUSED"
      subtitle="ESC: RESUME · R: RESTART"
      accentColor="#ffb3ff"
      actions={actions}
      visible={visible}
    />
  );
}
