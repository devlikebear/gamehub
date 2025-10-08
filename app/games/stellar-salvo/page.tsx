'use client';

import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { StellarSalvoGame } from '@/lib/games/stellar-salvo/StellarSalvoGame';

export default function StellarSalvoPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:py-20">
      <div className="container mx-auto max-w-6xl space-y-10 md:space-y-14">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-cyan uppercase tracking-wider">
            PHASE 4 · VOID DEFENSE
          </p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">
            STELLAR SALVO
          </h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            공명의 문을 방어하는 네온 방어선이 되어, 원형 궤도를 따라 드리프트하며 VOID WRAITH의 파도를 막아내세요.
            Space로 플럭스 펄스를 방출하고 Shift로 회피 부스트를 발동해 에너지 게이트를 지켜내세요.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-cyan rounded-xl shadow-neon-cyan p-4 md:p-6 lg:p-8">
          <GameCanvas GameClass={StellarSalvoGame} width={880} height={620} pauseOnSpace={false} />
        </section>

        {/* 게임 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-yellow uppercase">Controls</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>← → / A D : 궤도 방향 회전</li>
              <li>↑ / W : 추진 · ↓ / S : 감속</li>
              <li>Space : 플럭스 펄스</li>
              <li>Shift : 드리프트 대시</li>
              <li>Esc : 일시정지 · Enter / R : 재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-pink uppercase">Objectives</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>VOID WRAITH 무리를 제거해 점수와 배율 확보</li>
              <li>플럭스 펄스로 근접 위협을 정리하고 에너지 회수</li>
              <li>에너지 게이지가 0이 되기 전에 코어를 사수</li>
              <li>웨이브가 진행될수록 위협 수치가 상승합니다</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-cyan/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-cyan uppercase">Field Notes</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>오리지널 아트 & 메커닉</li>
              <li>대시는 쿨다운이 있어 위기 상황에만 사용하세요</li>
              <li>펄스는 짧지만 강력한 부채꼴 범위를 가집니다</li>
              <li>멀티플라이어를 유지하면 보너스 점수가 급증합니다</li>
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
