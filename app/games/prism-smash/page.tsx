'use client';

import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { PrismSmashGame } from '@/lib/games/prism-smash/PrismSmashGame';

export default function PrismSmashPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl space-y-12">
        <section className="text-center space-y-4">
          <p className="pixel-text text-xs text-bright-cyan">NEON ARC-LABS · FIELD DECONSTRUCTION</p>
          <h1 className="pixel-text text-5xl md:text-6xl text-bright neon-text">PRISM SMASH</h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            모듈형 프리즘 벽체를 해체하며 네온 에너지를 회수하세요. Space 키로 전경/후경 필드를 즉시
            전환해 숨겨진 라우트를 드러내고, 커브샷과 스왑 타이밍을 조합해 콤보를 이어가며 고득점을 노리세요.
          </p>
        </section>

        <section className="bg-black/60 border-2 border-bright-cyan rounded-xl shadow-neon-cyan p-6 md:p-8">
          <GameCanvas GameClass={PrismSmashGame} width={900} height={560} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 border border-bright-green/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-green">CONTROLS</h2>
            <ul className="text-sm text-bright space-y-2">
              <li>←/→ : 패들 이동</li>
              <li>Shift : 이동 가속</li>
              <li>Space : 전경/후경 필드 스왑</li>
              <li>Enter : 라운드 시작/재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-pink">OBJECTIVES</h2>
            <ul className="text-sm text-bright space-y-2">
              <li>프리즘 블록을 파괴해 에너지 점수를 획득하세요.</li>
              <li>스왑 타이밍으로 숨겨진 구간을 열고 콤보를 유지하세요.</li>
              <li>프리즘 블록은 조각으로 분열되어 추가 콤보 기회를 제공합니다.</li>
              <li>모든 레이어를 정리하면 다음 스테이지로 진입합니다.</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-yellow">FIELD NOTES</h2>
            <ul className="text-sm text-bright space-y-2">
              <li>네온 필드의 속도 존은 공의 궤도를 증폭하거나 완화합니다.</li>
              <li>콤보가 높을수록 점수 배율이 상승하며 HUD에 표시됩니다.</li>
              <li>필드 스왑은 쿨다운이 있으니 타이밍을 계산하세요.</li>
              <li>라이프가 모두 소진되면 시스템이 리셋됩니다.</li>
            </ul>
          </div>
        </section>

        <section className="text-center">
          <Link
            href="/games"
            className="inline-block px-6 py-3 border-2 border-bright-cyan text-bright-cyan pixel-text text-xs rounded hover:bg-bright-cyan hover:text-black transition-all"
          >
            BACK TO ARCADE LIST
          </Link>
        </section>
      </div>
    </main>
  );
}
