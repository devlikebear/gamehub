'use client';

import { useState } from 'react';
import { loadAllSounds, playSound, playBGM, stopBGM, SOUNDS } from '@/lib/audio/sounds';
import type { SoundKey } from '@/lib/audio/sounds';

export default function DemoPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBGMPlaying, setIsBGMPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSounds = async () => {
    setLoading(true);
    try {
      await loadAllSounds();
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load sounds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySound = (key: SoundKey) => {
    if (!isLoaded) return;
    playSound(key);
  };

  const handleToggleBGM = () => {
    if (!isLoaded) return;

    if (isBGMPlaying) {
      stopBGM();
      setIsBGMPlaying(false);
    } else {
      playBGM(SOUNDS.BGM_GAME);
      setIsBGMPlaying(true);
    }
  };

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <section className="text-center mb-8">
          <h1 className="pixel-text text-4xl text-bright-cyan mb-4 neon-text-cyan">
            AUDIO SYSTEM DEMO
          </h1>
          <p className="text-bright mb-4">레트로 아케이드 사운드 테스트</p>

          {!isLoaded ? (
            <button
              onClick={loadSounds}
              disabled={loading}
              className="pixel-text px-6 py-3 bg-bright-cyan text-black rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load Sounds & Start'}
            </button>
          ) : (
            <p className="text-bright-green">✅ All sounds loaded!</p>
          )}
        </section>

        {isLoaded && (
          <>
            {/* BGM Control */}
            <section className="mb-8 p-6 bg-black/50 border-2 border-bright-purple rounded-lg">
              <h2 className="pixel-text text-bright-purple text-sm mb-4">🎵 BACKGROUND MUSIC</h2>
              <button
                onClick={handleToggleBGM}
                className={`pixel-text px-6 py-3 rounded-lg transition-colors ${
                  isBGMPlaying
                    ? 'bg-bright-pink text-black hover:bg-white'
                    : 'bg-bright-green text-black hover:bg-white'
                }`}
              >
                {isBGMPlaying ? '⏸ Stop BGM' : '▶ Play BGM'}
              </button>
              <p className="text-bright text-xs mt-2">
                Simple retro-style background music loop
              </p>
            </section>

            {/* UI Sounds */}
            <section className="mb-8 p-6 bg-black/50 border-2 border-bright-cyan rounded-lg">
              <h2 className="pixel-text text-bright-cyan text-sm mb-4">🔊 UI SOUNDS</h2>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handlePlaySound(SOUNDS.CLICK)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-cyan text-bright-cyan rounded hover:bg-bright-cyan hover:text-black transition-colors"
                >
                  Click
                </button>
                <button
                  onClick={() => handlePlaySound(SOUNDS.BEEP)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-cyan text-bright-cyan rounded hover:bg-bright-cyan hover:text-black transition-colors"
                >
                  Beep
                </button>
                <button
                  onClick={() => handlePlaySound(SOUNDS.SELECT)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-cyan text-bright-cyan rounded hover:bg-bright-cyan hover:text-black transition-colors"
                >
                  Select
                </button>
              </div>
            </section>

            {/* Game Sounds */}
            <section className="mb-8 p-6 bg-black/50 border-2 border-bright-yellow rounded-lg">
              <h2 className="pixel-text text-bright-yellow text-sm mb-4">🎮 GAME SOUNDS</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handlePlaySound(SOUNDS.JUMP)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-yellow text-bright-yellow rounded hover:bg-bright-yellow hover:text-black transition-colors"
                >
                  Jump
                </button>
                <button
                  onClick={() => handlePlaySound(SOUNDS.COIN)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-yellow text-bright-yellow rounded hover:bg-bright-yellow hover:text-black transition-colors"
                >
                  Coin
                </button>
                <button
                  onClick={() => handlePlaySound(SOUNDS.LASER)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-yellow text-bright-yellow rounded hover:bg-bright-yellow hover:text-black transition-colors"
                >
                  Laser
                </button>
                <button
                  onClick={() => handlePlaySound(SOUNDS.EXPLOSION)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-yellow text-bright-yellow rounded hover:bg-bright-yellow hover:text-black transition-colors"
                >
                  Explosion
                </button>
                <button
                  onClick={() => handlePlaySound(SOUNDS.POWER_UP)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-yellow text-bright-yellow rounded hover:bg-bright-yellow hover:text-black transition-colors"
                >
                  Power Up
                </button>
                <button
                  onClick={() => handlePlaySound(SOUNDS.VICTORY)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-green text-bright-green rounded hover:bg-bright-green hover:text-black transition-colors"
                >
                  Victory
                </button>
              </div>
            </section>

            {/* Special Sounds */}
            <section className="p-6 bg-black/50 border-2 border-bright-pink rounded-lg">
              <h2 className="pixel-text text-bright-pink text-sm mb-4">⚡ SPECIAL SOUNDS</h2>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handlePlaySound(SOUNDS.GAME_OVER)}
                  className="pixel-text text-xs px-4 py-3 bg-gray-800 border-2 border-bright-pink text-bright-pink rounded hover:bg-bright-pink hover:text-black transition-colors"
                >
                  Game Over
                </button>
              </div>
              <p className="text-bright text-xs mt-4">
                💡 모든 사운드는 Web Audio API로 프로그래매틱하게 생성됩니다. 별도의 오디오 파일이 필요 없습니다!
              </p>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
