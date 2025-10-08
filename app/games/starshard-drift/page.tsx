'use client';

import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { StarshardDriftGame } from '@/lib/games/starshard-drift/StarshardDriftGame';

export default function StarshardDriftPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:py-20">
      <div className="container mx-auto max-w-6xl space-y-10 md:space-y-14">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-cyan uppercase tracking-wider">
            PHASE 4 · GRAVITY DRIFT
          </p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">
            STARSHARD DRIFT
          </h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            중력 파동이 휘몰아치는 구역에서 드리프트 부스트와 중력 펄스를 활용해 크리스털 공명을 안정화하세요.
            차징되는 파편을 제어해 에너지 코어를 회수하고 폭발을 방지해야 합니다.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-cyan rounded-xl shadow-neon-cyan p-4 md:p-6 lg:p-8">
          <GameCanvas GameClass={StarshardDriftGame} width={900} height={620} pauseOnSpace={false} />
        </section>

        {/* 게임 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-yellow uppercase">Controls</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>← → / A D : 선체 회전</li>
              <li>↑ / W : 추진, ↓ / S : 감속</li>
              <li>Space : 중력 펄스</li>
              <li>Shift : 드리프트 부스트</li>
              <li>Esc : 일시정지, Enter / R : 재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-pink uppercase">Objectives</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>공명 상태가 된 파편을 안정화하여 코어 확보</li>
              <li>중력 파동 방향을 읽고 드리프트로 회피</li>
              <li>중력 펄스를 사용해 과열 파편의 폭발 차단</li>
              <li>제한 시간 내 목표 코어를 회수</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-cyan/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-cyan uppercase">Field Notes</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>중력 파동 방향은 주기적으로 변하며 조작에 영향</li>
              <li>부스트는 쿨다운이 있으니 벌어진 틈에 활용</li>
              <li>펄스는 에너지를 소모하지만 공명도를 낮춥니다</li>
              <li>에너지 게이지가 바닥나면 선체가 붕괴됩니다</li>
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
