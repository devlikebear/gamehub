'use client';

import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { PhotonVanguardGame } from '@/lib/games/photon-vanguard';

export default function PhotonVanguardPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:py-20">
      <div className="container mx-auto max-w-6xl space-y-8 md:space-y-12">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-yellow uppercase tracking-wider">
            RADIAL DEFENSE SHOOTER
          </p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">
            PHOTON VANGUARD
          </h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            방사형 궤도로 진입하는 포톤 군단을 시간 왜곡으로 제압하세요!
            파동 공격으로 적을 격파하고 시간 왜곡으로 전장을 제어하세요.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-yellow rounded-xl shadow-neon-yellow p-4 md:p-6 lg:p-8">
          <GameCanvas GameClass={PhotonVanguardGame} width={840} height={600} pauseOnSpace={false} />
        </section>

        {/* 게임 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-black/40 border border-bright-green/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-green uppercase">
              Controls
            </h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>← → : 좌우 이동</li>
              <li>Space : 파동 발사 (충전 필요)</li>
              <li>Shift : 시간 왜곡 (쿨다운 5초)</li>
              <li>Esc / P : 일시정지</li>
              <li>Enter / R : 재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-pink/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-pink uppercase">
              How to Play
            </h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>적은 방사형 궤도를 따라 접근합니다</li>
              <li>파동 공격을 충전해 적을 격파하세요</li>
              <li>시간 왜곡으로 적의 속도를 늦추세요</li>
              <li>적과 충돌하면 게임 오버!</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-yellow/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-yellow uppercase">
              Scoring
            </h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>기본 적: 100점</li>
              <li>빠른 적: 150점</li>
              <li>중장갑 적: 300점</li>
              <li>엘리트 적: 500점</li>
              <li>10마리 처치마다 레벨업</li>
            </ul>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <section className="text-center pt-4">
          <Link
            href="/games"
            className="inline-block px-8 py-3 border-2 border-bright-yellow text-bright pixel-text text-xs rounded-lg hover:bg-bright-yellow hover:text-black transition-all duration-300 shadow-neon-yellow hover:shadow-none"
          >
            Back to Arcade List
          </Link>
        </section>
      </div>
    </main>
  );
}
