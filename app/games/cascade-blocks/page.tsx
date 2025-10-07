'use client';

import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { CascadeBlocksGame } from '@/lib/games/cascade-blocks';

export default function CascadeBlocksPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:py-20">
      <div className="container mx-auto max-w-6xl space-y-8 md:space-y-12">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-cyan uppercase tracking-wider">
            COLOR MATCH PUZZLE
          </p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">
            COLOR MATCH CASCADE
          </h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            네온 컬러 블록을 연결해 3개 이상 매칭하세요! 연쇄 반응으로 콤보를 만들고
            폭발적인 점수를 획득하세요. 레벨이 올라갈수록 속도가 빨라집니다.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-cyan rounded-xl shadow-neon-cyan p-4 md:p-6 lg:p-8">
          <GameCanvas GameClass={CascadeBlocksGame} width={840} height={600} pauseOnSpace={false} />
        </section>

        {/* 게임 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-black/40 border border-bright-green/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-green uppercase">
              Controls
            </h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>← → : 좌우 이동</li>
              <li>↑ : 회전 (가로 ↔ 세로)</li>
              <li>↓ : 빠른 낙하</li>
              <li>Space : 즉시 낙하</li>
              <li>Esc / P : 일시정지</li>
              <li>Enter / R : 재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-pink uppercase">
              How to Play
            </h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>2개의 컬러 블록이 위에서 떨어집니다</li>
              <li>같은 색 3개 이상 연결하면 제거됩니다</li>
              <li>블록 제거 후 중력이 작용합니다</li>
              <li>연쇄 반응으로 콤보를 만들어 고득점!</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-yellow uppercase">
              Scoring
            </h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>점수 = 제거 블록 × 100 × 콤보</li>
              <li>연쇄 반응마다 콤보 배수 증가</li>
              <li>30블록 제거마다 레벨업</li>
              <li>레벨업 시 낙하 속도 증가</li>
            </ul>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <section className="text-center pt-4">
          <Link
            href="/games"
            className="inline-block px-8 py-3 border-2 border-bright-cyan text-bright pixel-text text-xs rounded-lg hover:bg-bright-cyan hover:text-black transition-all duration-300 shadow-neon-cyan hover:shadow-none"
          >
            Back to Arcade List
          </Link>
        </section>
      </div>
    </main>
  );
}
