'use client';

import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { NeonSerpentGame } from '@/lib/games/neon-serpent/NeonSerpentGame';

export default function NeonSerpentPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-5xl space-y-12">
        <section className="text-center space-y-4">
          <p className="pixel-text text-xs text-bright-pink">NEON ARCADE ORIGINAL</p>
          <h1 className="pixel-text text-5xl md:text-6xl text-bright neon-text">NEON SERPENT</h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto">
            절차적으로 재구성되는 에너지 필드에서 네온 서펀트를 조종하세요. 에너지 오브를 모아 게이지를 충전하고,
            Shift 대시로 추적자보다 빠르게 움직이며 EMP 위험 구역을 피해 콤보를 이어가세요.
          </p>
        </section>

        <section className="bg-black/60 border-2 border-bright-cyan rounded-xl shadow-neon-cyan p-6 md:p-8">
          <GameCanvas GameClass={NeonSerpentGame} width={840} height={560} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 border border-bright-green/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-green">CONTROLS</h2>
            <ul className="text-sm text-bright space-y-2">
              <li>← → ↑ ↓ : 이동</li>
              <li>Shift : 에너지 대시</li>
              <li>Space : 일시정지</li>
              <li>R : 시스템 재부팅</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-pink">OBJECTIVES</h2>
            <ul className="text-sm text-bright space-y-2">
              <li>에너지 오브 수집으로 네온 게이지 충전</li>
              <li>콤보를 유지해 점수 배수를 확보</li>
              <li>EMP 위험 구역은 속도 저하 및 꼬리 손실</li>
              <li>게이지가 가득 차면 과부하를 관리</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-5 space-y-3">
            <h2 className="pixel-text text-sm text-bright-yellow">FIELD NOTES</h2>
            <ul className="text-sm text-bright space-y-2">
              <li>필드 레이아웃은 주기적으로 재구성됩니다.</li>
              <li>대시는 에너지를 소모하지만 속도를 증가시킵니다.</li>
              <li>과부하 상태에서는 속도가 느려지니 주의하세요.</li>
              <li>60 FPS 캔버스 엔진 기반으로 동작합니다.</li>
            </ul>
          </div>
        </section>

        <section className="text-center">
          <Link
            href="/games"
            className="inline-block px-6 py-3 border-2 border-bright-cyan text-bright pixel-text text-xs rounded hover:bg-bright-cyan hover:text-black transition-all"
          >
            BACK TO ARCADE LIST
          </Link>
        </section>
      </div>
    </main>
  );
}
