'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CascadeBlocksGame } from '@/lib/games/cascade-blocks';

export default function CascadeBlocksPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<CascadeBlocksGame | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;

    // 캔버스 크기 설정
    canvas.width = 800 * dpr;
    canvas.height = 600 * dpr;
    canvas.style.width = '800px';
    canvas.style.height = '600px';

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // 게임 인스턴스 생성
    gameRef.current = new CascadeBlocksGame({
      canvas,
      width: 800,
      height: 600,
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.stop();
        gameRef.current = null;
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900 flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-pixel">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-cyan-900 py-16 px-4 md:py-20">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
            CASCADE BLOCKS
          </h1>
          <p className="text-cyan-400 text-sm md:text-base max-w-2xl mx-auto">
            다각형 에너지 모듈을 조합하여 가변 필드를 완성하세요
          </p>
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.3)] rounded-lg bg-black"
            />
          </div>
        </div>

        {/* Controls & Info */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {/* Controls */}
          <div className="bg-black/80 border-2 border-cyan-400/50 rounded-lg p-4 md:p-6 lg:p-8 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:bg-black/50 transition-colors">
            <h2 className="text-xl md:text-2xl font-pixel text-cyan-400 mb-4">
              조작법
            </h2>
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-center gap-3">
                <span className="text-pink-400 font-mono">←→</span>
                <span className="text-gray-300">좌우 이동</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-pink-400 font-mono">↑</span>
                <span className="text-gray-300">회전</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-pink-400 font-mono">↓</span>
                <span className="text-gray-300">빠른 낙하</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-pink-400 font-mono">SPACE</span>
                <span className="text-gray-300">즉시 낙하</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-pink-400 font-mono">ESC/P</span>
                <span className="text-gray-300">일시정지</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-pink-400 font-mono">R</span>
                <span className="text-gray-300">재시작</span>
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-black/80 border-2 border-pink-400/50 rounded-lg p-4 md:p-6 lg:p-8 shadow-[0_0_20px_rgba(255,16,240,0.2)] hover:bg-black/50 transition-colors">
            <h2 className="text-xl md:text-2xl font-pixel text-pink-400 mb-4">
              게임 정보
            </h2>
            <ul className="space-y-2 text-sm md:text-base text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>다양한 다각형 모듈을 조합하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>완전한 라인을 만들어 점수를 획득하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>레벨이 오를수록 보드 크기가 변화합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>고급 레벨에서는 5칸 블록이 등장합니다</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/games"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-pixel text-sm rounded-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all duration-300 shadow-neon-cyan hover:shadow-none"
          >
            게임 목록으로
          </Link>
        </div>
      </div>
    </div>
  );
}
