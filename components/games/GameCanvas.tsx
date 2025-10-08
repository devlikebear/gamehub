'use client';

import { useEffect, useRef } from 'react';
import type { GameCompletionPayload } from '@/lib/games/engine/types';

interface GameCanvasProps {
  GameClass: new (config: {
    canvas: HTMLCanvasElement;
    width?: number;
    height?: number;
    onGameComplete?: (payload: GameCompletionPayload) => void;
  }) => {
    start: () => void;
    stop: () => void;
    togglePause: () => void;
  };
  width?: number;
  height?: number;
  pauseOnSpace?: boolean;
  onGameComplete?: (payload: GameCompletionPayload) => void;
}

export function GameCanvas({
  GameClass,
  width = 800,
  height = 600,
  pauseOnSpace = true,
  onGameComplete,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<ReturnType<typeof GameClass.prototype.constructor> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 게임 인스턴스 생성
    const config = {
      canvas: canvasRef.current,
      width,
      height,
    } as {
      canvas: HTMLCanvasElement;
      width?: number;
      height?: number;
      onGameComplete?: (payload: GameCompletionPayload) => void;
    };

    if (onGameComplete) {
      config.onGameComplete = onGameComplete;
    }

    const game = new GameClass(config);

    gameRef.current = game;

    // 게임 시작
    game.start();

    // 키보드 이벤트 (Space로 일시정지)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pauseOnSpace && e.code === 'Space') {
        e.preventDefault();
        game.togglePause();
      }
    };

    if (pauseOnSpace) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // 클린업
    return () => {
      if (pauseOnSpace) {
        window.removeEventListener('keydown', handleKeyDown);
      }
      game.stop();
    };
  }, [GameClass, width, height, pauseOnSpace, onGameComplete]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="border-2 border-bright-cyan rounded-lg"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
