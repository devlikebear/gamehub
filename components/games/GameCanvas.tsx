'use client';

import { useEffect, useRef } from 'react';

interface GameCanvasProps {
  GameClass: new (config: {
    canvas: HTMLCanvasElement;
    width?: number;
    height?: number;
  }) => {
    start: () => void;
    stop: () => void;
    togglePause: () => void;
  };
  width?: number;
  height?: number;
}

export function GameCanvas({ GameClass, width = 800, height = 600 }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<ReturnType<typeof GameClass.prototype.constructor> | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 게임 인스턴스 생성
    const game = new GameClass({
      canvas: canvasRef.current,
      width,
      height,
    });

    gameRef.current = game;

    // 게임 시작
    game.start();

    // 키보드 이벤트 (Space로 일시정지)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        game.togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // 클린업
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      game.stop();
    };
  }, [GameClass, width, height]);

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
