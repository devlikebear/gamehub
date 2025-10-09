/**
 * 오디오 생성기 페이지
 */

'use client';

import { useState, useRef } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ParamSlider } from '@/components/tools/ParamSlider';
import { ParamSelect } from '@/components/tools/ParamSelect';
import { GenerateButton } from '@/components/tools/GenerateButton';
import { PreviewPanel } from '@/components/tools/PreviewPanel';
import { LoadingSpinner } from '@/components/tools/LoadingSpinner';
import { ErrorMessage } from '@/components/tools/ErrorMessage';
import { BGMGenerator } from '@/lib/audio/BGMGenerator';
import { SFXGenerator } from '@/lib/audio/SFXGenerator';
import { assetCache } from '@/lib/storage/AssetCacheManager';
import type { BGMParams, SFXParams, Genre, Mood, SFXType } from '@/lib/audio/types';

type AudioType = 'bgm' | 'sfx';

export default function AudioGeneratorPage() {
  const [audioType, setAudioType] = useState<AudioType>('bgm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // BGM 파라미터
  const [bgmParams, setBgmParams] = useState<BGMParams>({
    genre: 'chiptune',
    tempo: 120,
    length: 30,
    mood: 'cheerful',
  });

  // SFX 파라미터
  const [sfxParams, setSfxParams] = useState<SFXParams>({
    type: 'ui',
    style: 'retro',
    duration: 0.5,
  });

  /**
   * 오디오 생성
   */
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    // 이전 오디오 URL 해제
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      let blob: Blob;
      const params = audioType === 'bgm' ? bgmParams : sfxParams;

      // 1. 캐시 확인
      console.log('🔍 캐시 확인 중...');
      const cached = await assetCache.get(params);

      if (cached) {
        console.log('✅ 캐시 히트!');
        blob = cached;
      } else {
        console.log('⚠️ 캐시 미스 - 새로 생성');

        // 2. 오디오 생성
        if (audioType === 'bgm') {
          const generator = new BGMGenerator();
          const result = await generator.generate(bgmParams);
          blob = result.blob;
          generator.close();
        } else {
          const generator = new SFXGenerator();
          const result = await generator.generate(sfxParams);
          blob = result.blob;
          generator.close();
        }

        // 3. 캐시에 저장
        await assetCache.save(
          params,
          blob,
          audioType === 'bgm' ? 'bgm' : 'sfx',
          {
            format: 'wav',
            duration: audioType === 'bgm' ? bgmParams.length : sfxParams.duration,
          }
        );

        // 4. 자동 정리
        await assetCache.cleanup(100);
      }

      // 5. 미리듣기 URL 생성
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // 자동 재생
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error('오디오 생성 실패:', err);
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 다운로드
   */
  const handleDownload = () => {
    if (!audioUrl) return;

    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${audioType}-${Date.now()}.wav`;
    a.click();
  };

  return (
    <ToolLayout
      sidebar={
        <div className="bg-black/80 border-2 border-cyan-500/30 rounded-lg p-6">
          <h3 className="text-cyan-400 font-bold text-lg mb-4 uppercase">
            설정
          </h3>

          {/* 오디오 타입 선택 */}
          <ParamSelect
            label="타입"
            value={audioType}
            options={[
              { value: 'bgm', label: 'BGM (배경음악)' },
              { value: 'sfx', label: 'SFX (효과음)' },
            ]}
            onChange={(value) => setAudioType(value as AudioType)}
            neonColor="cyan"
          />

          {/* BGM 설정 */}
          {audioType === 'bgm' && (
            <>
              <ParamSelect
                label="장르"
                value={bgmParams.genre}
                options={[
                  { value: 'chiptune', label: 'Chiptune' },
                  { value: 'synthwave', label: 'Synthwave' },
                  { value: 'arcade', label: 'Arcade Rock' },
                  { value: 'ambient', label: 'Ambient' },
                ]}
                onChange={(value) =>
                  setBgmParams({ ...bgmParams, genre: value as Genre })
                }
                neonColor="cyan"
              />

              <ParamSlider
                label="템포"
                value={bgmParams.tempo}
                min={60}
                max={180}
                step={10}
                unit="BPM"
                onChange={(value) => setBgmParams({ ...bgmParams, tempo: value })}
                neonColor="cyan"
              />

              <ParamSlider
                label="길이"
                value={bgmParams.length}
                min={10}
                max={60}
                step={10}
                unit="초"
                onChange={(value) => setBgmParams({ ...bgmParams, length: value })}
                neonColor="cyan"
              />

              <ParamSelect
                label="무드"
                value={bgmParams.mood}
                options={[
                  { value: 'tense', label: '긴장감' },
                  { value: 'cheerful', label: '경쾌함' },
                  { value: 'mysterious', label: '신비로움' },
                  { value: 'heroic', label: '영웅적' },
                ]}
                onChange={(value) =>
                  setBgmParams({ ...bgmParams, mood: value as Mood })
                }
                neonColor="cyan"
              />
            </>
          )}

          {/* SFX 설정 */}
          {audioType === 'sfx' && (
            <>
              <ParamSelect
                label="타입"
                value={sfxParams.type}
                options={[
                  { value: 'ui', label: 'UI (클릭, 호버)' },
                  { value: 'action', label: '액션 (점프, 공격)' },
                  { value: 'collect', label: '수집 (코인, 아이템)' },
                  { value: 'status', label: '상태 (파워업, 게임오버)' },
                ]}
                onChange={(value) =>
                  setSfxParams({ ...sfxParams, type: value as SFXType })
                }
                neonColor="cyan"
              />

              <ParamSelect
                label="스타일"
                value={sfxParams.style}
                options={[
                  { value: 'simple', label: '단조' },
                  { value: 'fancy', label: '화려' },
                  { value: 'retro', label: '레트로' },
                ]}
                onChange={(value) =>
                  setSfxParams({
                    ...sfxParams,
                    style: value as 'simple' | 'fancy' | 'retro',
                  })
                }
                neonColor="cyan"
              />

              <ParamSlider
                label="길이"
                value={sfxParams.duration}
                min={0.1}
                max={2}
                step={0.1}
                unit="초"
                onChange={(value) =>
                  setSfxParams({ ...sfxParams, duration: value })
                }
                neonColor="cyan"
              />
            </>
          )}

          {/* 생성 버튼 */}
          <GenerateButton
            onClick={handleGenerate}
            loading={loading}
            disabled={loading}
            neonColor="cyan"
            fullWidth
          >
            {loading ? '생성 중...' : '생성하기'}
          </GenerateButton>

          {/* 다운로드 버튼 */}
          {audioUrl && !loading && (
            <button
              onClick={handleDownload}
              className="
                w-full mt-4 px-4 py-3 bg-purple-500/20 border-2 border-purple-500/50
                text-purple-400 rounded-lg font-bold text-sm uppercase
                hover:bg-purple-500/30 hover:border-purple-500
                transition-all duration-200
              "
            >
              💾 다운로드 (WAV)
            </button>
          )}
        </div>
      }
    >
      <ToolHeader
        title="Audio Generator"
        description="레트로 아케이드 스타일 BGM 및 효과음 생성"
        icon="🎵"
        neonColor="cyan"
      />

      {/* 미리보기 패널 */}
      <PreviewPanel title="미리듣기" neonColor="cyan">
        {loading && <LoadingSpinner message="오디오 생성 중..." neonColor="cyan" />}

        {error && !loading && (
          <ErrorMessage message={error} onRetry={handleGenerate} />
        )}

        {audioUrl && !loading && !error && (
          <div className="w-full">
            <audio
              ref={audioRef}
              src={audioUrl}
              controls
              className="w-full"
              style={{
                filter: 'hue-rotate(180deg) saturate(2)',
              }}
            />
            <p className="text-gray-400 text-sm text-center mt-4">
              ✅ 생성 완료! 재생 버튼을 눌러 들어보세요.
            </p>
          </div>
        )}

        {!audioUrl && !loading && !error && (
          <div className="text-center text-gray-500">
            <p className="mb-2">👈 왼쪽에서 파라미터를 설정하고</p>
            <p>&quot;생성하기&quot; 버튼을 눌러주세요</p>
          </div>
        )}
      </PreviewPanel>

      {/* 사용 안내 */}
      <div className="mt-8 bg-black/50 border border-cyan-500/30 rounded-lg p-6">
        <h3 className="text-cyan-400 font-bold text-lg mb-4">💡 사용 방법</h3>
        <ul className="text-gray-300 space-y-2 text-sm">
          <li>1. 타입 선택: BGM(배경음악) 또는 SFX(효과음)</li>
          <li>2. 파라미터 조정: 장르, 템포, 길이 등</li>
          <li>3. 생성하기 버튼 클릭</li>
          <li>4. 미리듣기 후 다운로드</li>
        </ul>

        <div className="mt-4 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded">
          <p className="text-cyan-400 text-sm">
            <strong>💾 캐시 기능:</strong> 동일한 설정으로 재생성 시 즉시 로드됩니다
            (API 호출 없음)
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
