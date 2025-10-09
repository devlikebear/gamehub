/**
 * 스프라이트 생성기 페이지
 */

'use client';

import { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { ParamSelect } from '@/components/tools/ParamSelect';
import { GenerateButton } from '@/components/tools/GenerateButton';
import { LoadingSpinner } from '@/components/tools/LoadingSpinner';
import { ErrorMessage } from '@/components/tools/ErrorMessage';
import { SpriteGenerator } from '@/lib/sprite/SpriteGenerator';
import { ApiKeyManager } from '@/lib/sprite/ApiKeyManager';
import { UsageTracker } from '@/lib/sprite/UsageTracker';
import type {
  SpriteParams,
  SpriteType,
  SpriteStyle,
  ColorPalette,
  SpriteSize,
} from '@/lib/sprite/types';

export default function SpriteGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  // 스프라이트 파라미터
  const [params, setParams] = useState<SpriteParams>({
    type: 'character',
    style: 'pixel-art',
    palette: 'neon-cyan',
    size: '64x64',
    description: '검을 든 기사',
    frames: 1,
  });

  /**
   * API 키 설정 확인
   */
  const checkApiKey = (): boolean => {
    if (!ApiKeyManager.hasApiKey()) {
      setShowApiKeyModal(true);
      return false;
    }
    return true;
  };

  /**
   * API 키 저장
   */
  const handleSaveApiKey = async () => {
    if (!apiKeyInput || apiKeyInput.trim().length === 0) {
      setError('API 키를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // API 키 유효성 검증
      const isValid = await ApiKeyManager.validateApiKey(apiKeyInput.trim());

      if (!isValid) {
        setError(
          'API 키가 유효하지 않습니다. https://aistudio.google.com/apikey 에서 올바른 키를 발급받아주세요.'
        );
        setLoading(false);
        return;
      }

      // API 키 저장
      ApiKeyManager.saveApiKey(apiKeyInput.trim());
      setShowApiKeyModal(false);
      setApiKeyInput('');
      setError(null);
    } catch {
      setError('API 키 검증에 실패했습니다. 네트워크 연결을 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 스프라이트 생성
   */
  const handleGenerate = async () => {
    // API 키 확인
    if (!checkApiKey()) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      // 스프라이트 생성
      const result = await SpriteGenerator.generate(params);

      if (!result.success || !result.imageUrl) {
        setError(result.error || '스프라이트 생성에 실패했습니다.');
        setLoading(false);
        return;
      }

      // 이미지 URL 설정
      setImageUrl(result.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 이미지 다운로드
   */
  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = SpriteGenerator.generateFileName(params);
    link.click();
  };

  /**
   * 사용량 정보 (클라이언트 사이드에서만)
   */
  const [usageInfo, setUsageInfo] = useState({ totalImages: 0, totalCost: 0 });
  const [monthlyUsage, setMonthlyUsage] = useState({
    totalImages: 0,
    totalCost: 0,
    cachedImages: 0,
    byOperation: {},
  });

  useEffect(() => {
    // 클라이언트 사이드에서만 사용량 정보 로드
    setUsageInfo(UsageTracker.getTodayUsage());
    setMonthlyUsage(UsageTracker.getMonthlyUsage());
  }, [imageUrl]); // 이미지 생성 후 업데이트

  return (
    <ToolLayout>
      {/* 헤더 */}
      <ToolHeader
        title="🎨 스프라이트 생성기"
        description="Gemini AI로 레트로 아케이드 스타일 스프라이트를 생성하세요"
      />

      {/* API 키 모달 */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="w-full max-w-md rounded-lg bg-gray-900 p-6 shadow-xl border border-cyan-500">
            <h2 className="mb-4 text-xl font-bold text-cyan-400">Gemini API 키 설정</h2>
            <p className="mb-4 text-sm text-gray-400">
              스프라이트를 생성하려면 Google AI Studio에서 API 키를 발급받아야 합니다.
            </p>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 block text-sm text-cyan-400 hover:underline"
            >
              → API 키 발급받기 (무료)
            </a>

            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="AIza..."
              className="mb-4 w-full rounded bg-gray-800 px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none"
            />

            {error && <ErrorMessage message={error} />}

            <div className="flex gap-2">
              <button
                onClick={handleSaveApiKey}
                disabled={loading}
                className="flex-1 rounded bg-cyan-500 px-4 py-2 font-bold text-black hover:bg-cyan-400 disabled:opacity-50"
              >
                {loading ? '검증 중...' : '저장'}
              </button>
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  setApiKeyInput('');
                  setError(null);
                }}
                className="rounded bg-gray-700 px-4 py-2 font-bold text-white hover:bg-gray-600"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 파라미터 패널 */}
        <div className="space-y-4">
          <div className="rounded-lg bg-black/40 p-6 border border-cyan-500/30">
            <h3 className="mb-4 text-lg font-bold text-cyan-400">기본 설정</h3>

            {/* 타입 */}
            <ParamSelect
              label="스프라이트 타입"
              value={params.type}
              onChange={(value) => setParams({ ...params, type: value as SpriteType })}
              options={[
                { value: 'character', label: '캐릭터' },
                { value: 'enemy', label: '적' },
                { value: 'item', label: '아이템' },
                { value: 'effect', label: '이펙트' },
                { value: 'ui', label: 'UI 요소' },
                { value: 'background', label: '배경' },
              ]}
            />

            {/* 스타일 */}
            <ParamSelect
              label="아트 스타일"
              value={params.style}
              onChange={(value) => setParams({ ...params, style: value as SpriteStyle })}
              options={[
                { value: 'pixel-art', label: '픽셀 아트 (8-bit)' },
                { value: 'neon', label: '네온 아케이드' },
                { value: 'retro', label: '레트로 2D' },
                { value: 'minimalist', label: '미니멀' },
                { value: 'cartoon', label: '카툰' },
              ]}
            />

            {/* 색상 팔레트 */}
            <ParamSelect
              label="색상 팔레트"
              value={params.palette}
              onChange={(value) => setParams({ ...params, palette: value as ColorPalette })}
              options={[
                { value: 'neon-cyan', label: '네온 시안' },
                { value: 'neon-pink', label: '네온 핑크' },
                { value: 'neon-purple', label: '네온 보라' },
                { value: 'neon-yellow', label: '네온 노랑' },
                { value: 'neon-green', label: '네온 초록' },
                { value: 'rainbow', label: '무지개' },
                { value: 'monochrome', label: '흑백' },
              ]}
            />

            {/* 크기 */}
            <ParamSelect
              label="크기"
              value={params.size}
              onChange={(value) => setParams({ ...params, size: value as SpriteSize })}
              options={[
                { value: '16x16', label: '16×16 (매우 작음)' },
                { value: '32x32', label: '32×32 (작음)' },
                { value: '64x64', label: '64×64 (중간)' },
                { value: '128x128', label: '128×128 (큼)' },
                { value: '256x256', label: '256×256 (매우 큼)' },
              ]}
            />

            {/* 설명 */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-gray-300">설명</label>
              <input
                type="text"
                value={params.description}
                onChange={(e) => setParams({ ...params, description: e.target.value })}
                placeholder="예: 검을 든 기사, 빨간 구슬, 폭발 이펙트"
                className="w-full rounded bg-gray-800 px-4 py-2 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* 애니메이션 프레임 */}
            <ParamSelect
              label="애니메이션 프레임 수"
              value={String(params.frames || 1)}
              onChange={(value) => {
                const frameCount = Number(value);
                setParams({
                  ...params,
                  frames: frameCount,
                  animation: frameCount > 1 ? params.animation || 'idle' : undefined,
                });
              }}
              options={[
                { value: '1', label: '1 (정적)' },
                { value: '2', label: '2 프레임' },
                { value: '4', label: '4 프레임' },
                { value: '8', label: '8 프레임' },
              ]}
            />

            {/* 애니메이션 타입 (프레임 > 1일 때만 표시) */}
            {params.frames && params.frames > 1 && (
              <ParamSelect
                label="애니메이션 타입"
                value={params.animation || 'idle'}
                onChange={(value) =>
                  setParams({ ...params, animation: value as 'idle' | 'walk' | 'run' | 'jump' | 'attack' | 'death' })
                }
                options={[
                  { value: 'idle', label: '대기 (Idle)' },
                  { value: 'walk', label: '걷기 (Walk)' },
                  { value: 'run', label: '달리기 (Run)' },
                  { value: 'jump', label: '점프 (Jump)' },
                  { value: 'attack', label: '공격 (Attack)' },
                  { value: 'death', label: '사망 (Death)' },
                ]}
              />
            )}

            {/* 생성 버튼 */}
            <GenerateButton onClick={handleGenerate} loading={loading} fullWidth>
              🎨 스프라이트 생성
            </GenerateButton>

            {error && <ErrorMessage message={error} />}
          </div>

          {/* 사용량 정보 */}
          <div className="rounded-lg bg-black/40 p-6 border border-purple-500/30">
            <h3 className="mb-4 text-lg font-bold text-purple-400">사용량</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>오늘 생성:</span>
                <span className="font-bold text-cyan-400">{usageInfo.totalImages}개</span>
              </div>
              <div className="flex justify-between">
                <span>오늘 예상 비용:</span>
                <span className="font-bold text-pink-400">${usageInfo.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>30일 생성:</span>
                <span className="font-bold text-cyan-400">{monthlyUsage.totalImages}개</span>
              </div>
              <div className="flex justify-between">
                <span>30일 예상 비용:</span>
                <span className="font-bold text-pink-400">${monthlyUsage.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-700 pt-2">
                <span>캐시 절약:</span>
                <span className="font-bold text-green-400">{monthlyUsage.cachedImages}개</span>
              </div>
            </div>

            <button
              onClick={() => setShowApiKeyModal(true)}
              className="mt-4 w-full rounded bg-purple-500/20 px-4 py-2 text-sm text-purple-400 hover:bg-purple-500/30 border border-purple-500/50"
            >
              API 키 설정
            </button>
          </div>
        </div>

        {/* 미리보기 패널 */}
        <div className="space-y-4">
          <div className="rounded-lg bg-black/40 p-6 border border-cyan-500/30">
            <h3 className="mb-4 text-lg font-bold text-cyan-400">미리보기</h3>

            {loading && (
              <div className="flex h-64 items-center justify-center">
                <LoadingSpinner message="스프라이트 생성 중..." />
              </div>
            )}

            {!loading && !imageUrl && (
              <div className="flex h-64 items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="mb-2 text-4xl">🎨</div>
                  <p>스프라이트를 생성하면 여기에 표시됩니다</p>
                </div>
              </div>
            )}

            {!loading && imageUrl && (
              <div className="space-y-4">
                {/* 이미지 */}
                <div className="flex justify-center rounded bg-gray-900/50 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Generated sprite"
                    className="pixelated max-h-96"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>

                {/* 다운로드 버튼 */}
                <button
                  onClick={handleDownload}
                  className="w-full rounded bg-cyan-500 px-4 py-3 font-bold text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                >
                  💾 PNG 다운로드
                </button>

                {/* 다시 생성 */}
                <button
                  onClick={handleGenerate}
                  className="w-full rounded bg-purple-500/20 px-4 py-2 text-purple-400 hover:bg-purple-500/30 border border-purple-500/50"
                >
                  🔄 다시 생성 (변형)
                </button>
              </div>
            )}
          </div>

          {/* 팁 */}
          <div className="rounded-lg bg-black/40 p-6 border border-yellow-500/30">
            <h3 className="mb-4 text-lg font-bold text-yellow-400">💡 팁</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• 구체적인 설명을 입력할수록 원하는 결과를 얻기 쉽습니다</li>
              <li>• 픽셀 아트는 작은 크기(32x32, 64x64)를 권장합니다</li>
              <li>• 네온 스타일은 어두운 배경에서 빛나는 효과가 있습니다</li>
              <li>• 같은 설정으로 여러 번 생성하면 다양한 변형을 얻을 수 있습니다</li>
              <li>• API 비용은 이미지당 약 $0.02입니다 (예상)</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
