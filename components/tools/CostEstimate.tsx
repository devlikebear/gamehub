/**
 * 예상 비용 표시 컴포넌트
 */

import React from 'react';

interface CostEstimateProps {
  imageCount?: number;
  pricePerImage?: number;
  showWarning?: boolean;
}

export function CostEstimate({
  imageCount = 1,
  pricePerImage = 0.02,
  showWarning = false,
}: CostEstimateProps) {
  const totalCost = imageCount * pricePerImage;

  return (
    <div
      className={`
      border-2 rounded-lg p-4
      ${
        showWarning
          ? 'bg-yellow-900/20 border-yellow-500/50'
          : 'bg-cyan-900/20 border-cyan-500/50'
      }
    `}
    >
      <div className="flex items-start gap-3">
        {/* 아이콘 */}
        <div className="flex-shrink-0">
          {showWarning ? (
            <svg
              className="w-5 h-5 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* 비용 정보 */}
        <div className="flex-1">
          <h4
            className={`font-bold text-sm mb-2 ${
              showWarning ? 'text-yellow-400' : 'text-cyan-400'
            }`}
          >
            예상 비용
          </h4>

          <div className="text-gray-300 text-sm space-y-1">
            <p>
              이미지 생성: {imageCount}개 × ${pricePerImage.toFixed(2)} = $
              {totalCost.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              * 실제 비용은 Gemini API 사용량에 따라 달라질 수 있습니다.
            </p>
          </div>

          {showWarning && (
            <p className="mt-2 text-yellow-400 text-xs">
              ⚠️ API 키가 설정되지 않았습니다. 먼저 API 키를 등록해주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
