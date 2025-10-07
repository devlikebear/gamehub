'use client';

import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { PhotonVanguardGame } from '@/lib/games/photon-vanguard/PhotonVanguardGame';

export default function PhotonVanguardPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:py-20">
      <div className="container mx-auto max-w-6xl space-y-10 md:space-y-14">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-yellow uppercase tracking-wider">
            PHASE 4 · RADIANT DEFENSE
          </p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">
            PHOTON VANGUARD
          </h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            방사형 궤도로 진입하는 포톤 군단을 제압하세요. ←→으로 수호대를 회전시키고, Shift
            시간 왜곡으로 적의 돌진을 늦춘 뒤 Space 파동을 방출해 궤도를 정리하세요. 잔상
            장벽을 활용하면 추격자를 늦출 수 있습니다.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-yellow rounded-xl shadow-neon-yellow p-4 md:p-6 lg:p-8">
          <GameCanvas GameClass={PhotonVanguardGame} width={860} height={620} pauseOnSpace={false} />
        </section>

        {/* 게임 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-black/40 border border-bright-cyan/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-cyan uppercase">Controls</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>← → : 궤도 회전</li>
              <li>Shift : 시간 왜곡</li>
              <li>Space / X : 파동 발사</li>
              <li>Esc : 일시정지</li>
              <li>Enter / R : 재부팅</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-pink uppercase">Objectives</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>포톤 분열체와 돌격체를 파동으로 제거</li>
              <li>시간 왜곡 게이지를 관리하며 콤보 연장</li>
              <li>잔상 장벽으로 적의 침투를 지연</li>
              <li>코어 무결성을 3단계 이상 유지</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-yellow uppercase">Field Notes</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>라운드가 오를수록 궤도 수와 속도가 증가합니다.</li>
              <li>분열체는 파괴 시 조각으로 분리됩니다.</li>
              <li>시간 왜곡 중 파동은 범위가 넓어지지만 재충전이 느립니다.</li>
              <li>파동 진행 바는 화면 하단에서 확인할 수 있습니다.</li>
            </ul>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <section className="text-center pt-4">
          <Link
            href="/games"
            className="inline-block px-8 py-3 border-2 border-bright-yellow text-bright-yellow pixel-text text-xs rounded-lg hover:bg-bright-yellow hover:text-black transition-all duration-300 shadow-neon-yellow hover:shadow-none"
          >
            Back to Arcade List
          </Link>
        </section>
      </div>
    </main>
  );
}
