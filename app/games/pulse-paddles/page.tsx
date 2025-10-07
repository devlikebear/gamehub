'use client';

import Link from 'next/link';
import { GameCanvas } from '@/components/games/GameCanvas';
import { PulsePaddlesGame } from '@/lib/games/pulse-paddles/PulsePaddlesGame';

export default function PulsePaddlesPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:py-20">
      <div className="container mx-auto max-w-6xl space-y-8 md:space-y-12">
        {/* 헤더 */}
        <section className="text-center space-y-3 md:space-y-4">
          <p className="pixel-text text-xs text-bright-pink uppercase tracking-wider">NEON ARC-LABS · ARENA DUEL</p>
          <h1 className="pixel-text text-4xl md:text-5xl lg:text-6xl text-bright neon-text">PULSE PADDLES</h1>
          <p className="text-bright text-sm md:text-base max-w-3xl mx-auto leading-relaxed px-4">
            에너지 볼의 궤도를 조작해 네온 골존을 공략하세요. Space/Shift로 곡선을 충전하고, 득점할 때마다
            재구성되는 필드 패턴을 읽어 우위를 확보하세요. 1 키로 AI 모드, 2 키로 로컬 2P를 전환할 수 있습니다.
          </p>
        </section>

        {/* 게임 캔버스 */}
        <section className="bg-black/60 border-2 border-bright-pink rounded-xl shadow-neon-pink p-4 md:p-6 lg:p-8">
          <GameCanvas GameClass={PulsePaddlesGame} width={900} height={560} />
        </section>

        {/* 게임 정보 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-black/40 border border-bright-green/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-green uppercase">Controls</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>←/→ 방향키: 패들 이동</li>
              <li>Space 또는 Shift: 커브샷/스핀 충전</li>
              <li>W/S + F: 2P 모드에서 오른쪽 패들</li>
              <li>1: AI 모드 · 2: 로컬 2P · Enter: 재시작</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-cyan/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-cyan uppercase">Objectives</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>커브샷으로 에너지 볼 궤도를 제어하세요.</li>
              <li>네온 존에서 속도가 바뀌니 타이밍을 조정하세요.</li>
              <li>득점마다 필드 패턴이 바뀌어 새로운 각도를 제공합니다.</li>
              <li>7점 선취로 매치를 승리하세요.</li>
            </ul>
          </div>

          <div className="bg-black/40 border border-bright-purple/60 rounded-lg p-4 md:p-5 space-y-3 hover:bg-black/50 transition-colors">
            <h2 className="pixel-text text-xs md:text-sm text-bright-purple uppercase">Arena Notes</h2>
            <ul className="text-xs md:text-sm text-bright space-y-1.5 md:space-y-2">
              <li>펄스 존은 공 속도를 가속하거나 감속시킵니다.</li>
              <li>콤보 글로우가 강할수록 스코어가 뜨겁습니다.</li>
              <li>AI 난이도는 점수 차이에 따라 적응합니다.</li>
              <li>네온 HUD에서 필드 시프트 메시지를 확인하세요.</li>
            </ul>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <section className="text-center pt-4">
          <Link
            href="/games"
            className="inline-block px-8 py-3 border-2 border-bright-pink text-bright-pink pixel-text text-xs rounded-lg hover:bg-bright-pink hover:text-black transition-all duration-300 shadow-neon-pink hover:shadow-none"
          >
            Back to Arcade List
          </Link>
        </section>
      </div>
    </main>
  );
}
