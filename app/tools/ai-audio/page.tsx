'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ParamSelect } from '@/components/tools/ParamSelect';
import { GenerateButton } from '@/components/tools/GenerateButton';
import { ErrorMessage } from '@/components/tools/ErrorMessage';
// TODO: 서버 구현 후 활성화
// import { MusicGenerator } from '@/lib/music/MusicGenerator';
// import { ApiKeyManager } from '@/lib/sprite/ApiKeyManager';
// import { UsageTracker } from '@/lib/sprite/UsageTracker';
import { SFX_PRESETS, getPromptPreview } from '@/lib/music/musicPrompts';
import type { MusicParams, MusicType, MusicGenre, MusicMood, MusicLength } from '@/lib/music/types';

export default function AIMusicGeneratorPage() {
  const [params, setParams] = useState<MusicParams>({
    type: 'bgm',
    genre: 'chiptune',
    mood: 'cheerful',
    length: 30,
    prompt: '',
  });

  const [_audioUrl, _setAudioUrl] = useState<string>(''); // TODO: 서버 구현 후 사용
  const [_loading, _setLoading] = useState(false); // TODO: 서버 구현 후 사용
  const [error, setError] = useState<string | null>(null);
  const [_showApiKeyModal, _setShowApiKeyModal] = useState(false); // TODO: 서버 구현 후 사용
  const [_apiKeyInput, _setApiKeyInput] = useState(''); // TODO: 서버 구현 후 사용
  const [_usageInfo, _setUsageInfo] = useState({ totalImages: 0, totalCost: 0 }); // TODO: 서버 구현 후 사용
  const [_monthlyUsage, _setMonthlyUsage] = useState({
    totalImages: 0,
    totalCost: 0,
    cachedImages: 0,
    byOperation: {},
  }); // TODO: 서버 구현 후 사용

  // 사용량 로드 (클라이언트 사이드) - TODO: 서버 구현 후 활성화
  // useEffect(() => {
  //   setUsageInfo(UsageTracker.getTodayUsage());
  //   setMonthlyUsage(UsageTracker.getMonthlyUsage());
  // }, [audioUrl]);

  /**
   * API 키 확인 - TODO: 서버 구현 후 사용
   */
  // const checkApiKey = (): boolean => {
  //   if (!ApiKeyManager.hasApiKey()) {
  //     setShowApiKeyModal(true);
  //     return false;
  //   }
  //   return true;
  // };

  /**
   * API 키 저장 - TODO: 서버 구현 후 사용
   */
  // const handleSaveApiKey = async () => {
  //   if (!apiKeyInput || apiKeyInput.trim().length === 0) {
  //     setError('API 키를 입력해주세요.');
  //     return;
  //   }
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const isValid = await ApiKeyManager.validateApiKey(apiKeyInput.trim());
  //     if (!isValid) {
  //       setError('API 키가 유효하지 않습니다. https://aistudio.google.com/apikey 에서 올바른 키를 발급받아주세요.');
  //       setLoading(false);
  //       return;
  //     }
  //     ApiKeyManager.saveApiKey(apiKeyInput.trim());
  //     setShowApiKeyModal(false);
  //     setApiKeyInput('');
  //     setError(null);
  //   } catch {
  //     setError('API 키 검증에 실패했습니다. 네트워크 연결을 확인해주세요.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /**
   * 음악 생성 (준비 중)
   */
  const handleGenerate = async () => {
    // Lyria RealTime API는 WebSocket 기반으로, 브라우저에서 직접 사용 불가
    // 서버 구현 필요 (Cloudflare Workers/Functions)
    setError(
      '🚧 AI 음악 생성 기능은 현재 준비 중입니다.\n\nGemini Lyria RealTime API는 WebSocket 기반 스트리밍으로, 서버 구현이 필요합니다.\n현재는 상단 메뉴의 "Web Audio 생성기"를 사용해주세요!'
    );
    return;

    // TODO: 서버 구현 후 아래 코드 활성화
    // if (!checkApiKey()) return;
    // setLoading(true);
    // setError(null);
    // setAudioUrl('');
    // try {
    //   const result = await MusicGenerator.generate(params);
    //   if (!result.success || !result.audioUrl) {
    //     setError(result.error || '음악 생성에 실패했습니다.');
    //     setLoading(false);
    //     return;
    //   }
    //   setAudioUrl(result.audioUrl);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    // } finally {
    //   setLoading(false);
    // }
  };

  /**
   * 음악 다운로드 - TODO: 서버 구현 후 사용
   */
  // const handleDownload = () => {
  //   if (!_audioUrl) return;
  //   const link = document.createElement('a');
  //   link.href = _audioUrl;
  //   const filename = `${params.type}_${Date.now()}.wav`;
  //   link.download = filename;
  //   link.click();
  // };

  /**
   * SFX 프리셋 선택
   */
  const handleSfxPresetSelect = (preset: string) => {
    const presetData = SFX_PRESETS.find((p) => p.value === preset);
    if (presetData) {
      setParams({ ...params, prompt: presetData.prompt });
    }
  };

  return (
    <ToolLayout>
      {/* 헤더 */}
      <ToolHeader
        title="🎵 AI 음악 생성기 (준비 중)"
        description="Gemini Lyria로 레트로 게임 음악과 효과음을 생성하세요 (서버 구현 필요)"
      />

      {/* 준비 중 안내 */}
      <div className="mb-6 p-6 bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg">
        <h3 className="text-lg font-bold text-yellow-400 mb-2">🚧 준비 중인 기능입니다</h3>
        <p className="text-sm text-gray-300 mb-3">
          Gemini Lyria RealTime API는 WebSocket 기반 실시간 스트리밍 방식으로 작동하여,
          브라우저에서 직접 호출할 수 없습니다. Cloudflare Workers 또는 Functions를 통한
          서버 구현이 필요합니다.
        </p>
        <p className="text-sm text-cyan-400">
          💡 현재는 상단 메뉴의 <strong>&quot;🎹 Web Audio 생성기&quot;</strong>를 사용해주세요!
          Web Audio API로 레트로 게임 음악과 효과음을 즉시 생성할 수 있습니다.
        </p>
      </div>

      {/* API 키 모달 - TODO: 서버 구현 후 활성화 */}
      {/* {showApiKeyModal && (...)} */}

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 파라미터 패널 */}
        <div className="space-y-4">
          <div className="rounded-lg bg-black/40 p-6 border border-cyan-500/30">
            <h3 className="mb-4 text-lg font-bold text-cyan-400">기본 설정</h3>

            {/* 음악 타입 */}
            <ParamSelect
              label="음악 타입"
              value={params.type}
              onChange={(value) =>
                setParams({ ...params, type: value as MusicType, prompt: '' })
              }
              options={[
                { value: 'bgm', label: '🎵 배경음악 (BGM)' },
                { value: 'sfx', label: '🔊 효과음 (SFX)' },
              ]}
            />

            {/* BGM 설정 */}
            {params.type === 'bgm' && (
              <>
                <ParamSelect
                  label="장르"
                  value={params.genre || 'chiptune'}
                  onChange={(value) => setParams({ ...params, genre: value as MusicGenre })}
                  options={[
                    { value: 'chiptune', label: '🕹️ 칩튠 (8-bit)' },
                    { value: 'synthwave', label: '🌆 신스웨이브' },
                    { value: 'arcade', label: '🎸 아케이드 록' },
                    { value: 'ambient', label: '🌌 앰비언트' },
                    { value: 'action', label: '⚔️ 액션' },
                  ]}
                />

                <ParamSelect
                  label="분위기"
                  value={params.mood || 'cheerful'}
                  onChange={(value) => setParams({ ...params, mood: value as MusicMood })}
                  options={[
                    { value: 'cheerful', label: '😊 경쾌함' },
                    { value: 'tense', label: '😰 긴장감' },
                    { value: 'mysterious', label: '🔮 미스테리' },
                    { value: 'heroic', label: '🦸 영웅적' },
                  ]}
                />

                <ParamSelect
                  label="길이"
                  value={String(params.length || 30)}
                  onChange={(value) => setParams({ ...params, length: Number(value) as MusicLength })}
                  options={[
                    { value: '30', label: '⏱️ 30초 (루프)' },
                    { value: '60', label: '⏱️ 60초 (일반)' },
                    { value: '120', label: '⏱️ 120초 (보스전)' },
                  ]}
                />
              </>
            )}

            {/* SFX 프리셋 */}
            {params.type === 'sfx' && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-300">
                  효과음 프리셋
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SFX_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handleSfxPresetSelect(preset.value)}
                      className="px-3 py-2 bg-black/50 border border-neon-pink/30 rounded hover:border-neon-pink transition-colors text-sm"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 커스텀 프롬프트 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-300">
                커스텀 프롬프트 (선택)
              </label>
              <textarea
                value={params.prompt}
                onChange={(e) => setParams({ ...params, prompt: e.target.value })}
                placeholder={
                  params.type === 'bgm'
                    ? '예: 8-bit chiptune with happy melody...'
                    : '예: retro laser sound effect...'
                }
                className="w-full rounded bg-gray-800 px-4 py-3 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none resize-none"
                rows={4}
              />
              <p className="mt-1 text-xs text-gray-500">
                비워두면 자동으로 프롬프트가 생성됩니다.
              </p>
            </div>

            {/* 프롬프트 미리보기 */}
            <div className="mb-4 p-4 bg-black/30 border border-purple-500/30 rounded">
              <p className="text-xs text-gray-400 mb-1">프롬프트 미리보기:</p>
              <p className="text-sm text-purple-400">
                {getPromptPreview(params.type, params.genre, params.mood, params.length)}
              </p>
            </div>

            {/* 생성 버튼 */}
            <GenerateButton onClick={handleGenerate} loading={false} fullWidth>
              🎵 음악 생성 (준비 중)
            </GenerateButton>

            {error && <ErrorMessage message={error} />}
          </div>

          {/* 사용량 정보 - TODO: 서버 구현 후 활성화 */}
          {/* <div>...</div> */}
        </div>

        {/* 미리보기 패널 */}
        <div className="space-y-4">
          <div className="rounded-lg bg-black/40 p-6 border border-cyan-500/30">
            <h3 className="mb-4 text-lg font-bold text-cyan-400">미리보기</h3>

            {/* 준비 중 상태 */}
            <div className="flex h-64 items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="mb-2 text-4xl">🚧</div>
                <p className="text-yellow-400">서버 구현 준비 중입니다</p>
              </div>
            </div>

            {/* TODO: 서버 구현 후 활성화 - 오디오 플레이어, 다운로드, 음악 정보 */}
          </div>

          {/* 팁 */}
          <div className="rounded-lg bg-black/40 p-6 border border-yellow-500/30">
            <h3 className="mb-4 text-lg font-bold text-yellow-400">💡 팁</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• BGM은 루프 재생에 최적화되어 있습니다</li>
              <li>• SFX는 짧고 강렬한 효과음을 생성합니다</li>
              <li>• 프리셋을 먼저 시도한 후 커스텀 프롬프트를 사용하세요</li>
              <li>• 같은 설정으로 여러 번 생성하면 다양한 변형을 얻을 수 있습니다</li>
              <li>• BGM: $0.05, SFX: $0.02 (예상 비용)</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
