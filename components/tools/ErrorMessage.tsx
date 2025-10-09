/**
 * 에러 메시지 컴포넌트
 */

import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  title = '오류 발생',
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="bg-red-900/20 border-2 border-red-500/50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        {/* 에러 아이콘 */}
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* 에러 내용 */}
        <div className="flex-1">
          <h3 className="text-red-400 font-bold text-lg mb-2">{title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {message}
          </p>

          {/* 재시도 버튼 */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="
                mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50
                text-red-400 rounded-lg font-medium text-sm
                hover:bg-red-500/30 hover:border-red-500
                transition-all duration-200
              "
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
