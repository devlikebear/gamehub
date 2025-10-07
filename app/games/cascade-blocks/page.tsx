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
            NEON FABRICATION GRID
          </p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">
            CASCADE BLOCKS
          </h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            비정형 에너지 모듈을 cascade 라인에 연결해 필드 안정도를 유지하세요. 라운드가 진행될수록 격자 스케일과
            모듈 구성이 동적으로 재구성되며, 연속 클리어로 네온 루프가 증폭됩니다.
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
              <li>↑ : 회전</li>
              <li>↓ : 빠른 낙하</li>
              <li>Space : 즉시 낙하</li>
              <li>Esc / P : 일시정지</li>
              <li>Enter / R : 재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-pink uppercase">
              Objectives
            </h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>불규칙 모듈을 맞춰 cascade 라인을 안정화하세요.</li>
              <li>연속 회수로 필드 안정도 게이지를 채우고 보너스를 확보하세요.</li>
              <li>레벨이 오를 때마다 격자 크기와 모듈 셋이 재편성됩니다.</li>
              <li>하이스코어를 갱신해 네온 패브릭을 기록하세요.</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-yellow uppercase">
              Field Notes
            </h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>격자 폭과 높이는 단계별로 확장되어 새로운 라우팅을 요구합니다.</li>
              <li>고급 라운드에서는 비대칭 6~7칸 모듈이 등장합니다.</li>
              <li>incoming cascade 패널로 다음 에너지 흐름을 파악하세요.</li>
              <li>필드 안정도 패널은 진행 상황과 모듈 투입량을 즉시 보여줍니다.</li>
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
