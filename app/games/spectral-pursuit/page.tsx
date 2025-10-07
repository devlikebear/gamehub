'use client';

import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { SpectralPursuitGame } from '@/lib/games/spectral-pursuit/SpectralPursuitGame';

export default function SpectralPursuitPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:py-20">
      <div className="container mx-auto max-w-6xl space-y-10 md:space-y-14">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-purple uppercase tracking-wider">
            PHASE 4 · STEALTH PURSUIT
          </p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">
            SPECTRAL PURSUIT
          </h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            다층 라비린스에서 추적자들을 피해 빛의 파편을 모으세요. Space로 위장을 유지하고,
            Shift로 미끼를 사용해 위협도를 낮추며 포탈이 재배치되기 전에 탈출 경로를 찾으세요.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-purple rounded-xl shadow-neon-purple p-4 md:p-6 lg:p-8">
          <GameCanvas GameClass={SpectralPursuitGame} width={880} height={620} pauseOnSpace={false} />
        </section>

        {/* 게임 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-black/40 border border-bright-cyan/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-cyan uppercase">Controls</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>← → ↑ ↓ / WASD : 이동</li>
              <li>Space : 위장 유지</li>
              <li>Shift : 미끼 투척</li>
              <li>Esc : 일시정지</li>
              <li>Enter / R : 재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-pink uppercase">Objectives</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>빛의 파편을 모아 탈출 포탈을 활성화</li>
              <li>위협도 게이지를 관리하며 추적자 감지 회피</li>
              <li>포탈 재배치 이전에 새로운 경로 확보</li>
              <li>미끼로 헌터의 인식도를 초기화</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-yellow uppercase">Field Notes</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>라비린스 포탈은 주기적으로 재배치됩니다.</li>
              <li>위장 상태에서는 이동 속도가 감소하지만 위협이 감소합니다.</li>
              <li>위협 게이지가 높아지면 헌터 경계가 상승합니다.</li>
              <li>헌터가 완전히 인식하면 즉시 추격이 시작됩니다.</li>
            </ul>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <section className="text-center pt-4">
          <Link
            href="/games"
            className="inline-block px-8 py-3 border-2 border-bright-purple text-bright-purple pixel-text text-xs rounded-lg hover:bg-bright-purple hover:text-black transition-all duration-300 shadow-neon-purple hover:shadow-none"
          >
            Back to Arcade List
          </Link>
        </section>
      </div>
    </main>
  );
}
