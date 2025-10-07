import { GameCanvas } from '@/components/games/GameCanvas';
import { DemoGame } from '@/lib/games/demo/DemoGame';

export default function DemoPage() {
  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <section className="text-center mb-8">
          <h1 className="pixel-text text-4xl text-bright mb-4 neon-text">
            GAME ENGINE DEMO
          </h1>
          <p className="text-bright mb-2">60 FPS Game Loop Test</p>
          <p className="text-bright-yellow text-sm">Press SPACE to pause/resume</p>
        </section>

        <section className="mb-8">
          <GameCanvas GameClass={DemoGame} width={800} height={600} />
        </section>

        <section className="p-6 bg-black/50 border-2 border-bright-purple rounded-lg">
          <h2 className="pixel-text text-bright-purple text-sm mb-4">ENGINE FEATURES</h2>
          <ul className="text-bright text-sm space-y-2">
            <li>✅ requestAnimationFrame 기반 60 FPS</li>
            <li>✅ 델타 타임 계산으로 일정한 속도 유지</li>
            <li>✅ Pause/Resume 기능</li>
            <li>✅ FPS 카운터 (개발 모드)</li>
            <li>✅ 레티나 디스플레이 대응</li>
            <li>✅ Canvas 렌더링 최적화</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
