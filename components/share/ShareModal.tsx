/**
 * Share Modal Component
 *
 * SNS 공유 모달
 */

'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/provider';
import type { ShareData } from '@/lib/share/templates';
import {
  createShareMessageKo,
  createShareMessageEn,
  createShareTitleKo,
  createShareTitleEn,
  createHashtags,
} from '@/lib/share/templates';
import {
  createTwitterShareUrl,
  createFacebookShareUrl,
  shareToKakao,
  shareViaWebShareAPI,
  copyToClipboard,
  isWebShareSupported,
} from '@/lib/share/platforms';

export interface ShareModalProps {
  shareData: ShareData;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ shareData, isOpen, onClose }: ShareModalProps) {
  const { locale } = useI18n();
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  if (!isOpen) return null;

  const isKorean = locale === 'ko';
  const message = isKorean ? createShareMessageKo(shareData) : createShareMessageEn(shareData);
  const title = isKorean ? createShareTitleKo(shareData) : createShareTitleEn(shareData);
  const hashtags = createHashtags(shareData.gameId);

  const handleTwitterShare = () => {
    const url = createTwitterShareUrl({ url: shareData.url, title, text: message, hashtags });
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const url = createFacebookShareUrl({ url: shareData.url, title, text: message });
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleKakaoShare = () => {
    shareToKakao({
      url: shareData.url,
      title,
      text: message,
      gameId: shareData.gameId,
      score: shareData.score,
    });
  };

  const handleWebShare = async () => {
    const shared = await shareViaWebShareAPI({ url: shareData.url, title, text: message });
    if (shared) {
      onClose();
    }
  };

  const handleCopyLink = async () => {
    const fullMessage = `${message}\n\n${shareData.url}`;
    const success = await copyToClipboard(fullMessage);
    if (success) {
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-2 border-bright-cyan rounded-lg p-6 max-w-md w-full">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label={isKorean ? '닫기' : 'Close'}
        >
          <span className="text-2xl">×</span>
        </button>

        {/* 제목 */}
        <h2 className="pixel-text text-xl text-center mb-6 text-bright-cyan">
          {isKorean ? '🔗 점수 공유하기' : '🔗 Share Score'}
        </h2>

        {/* 점수 정보 */}
        <div className="bg-black/50 border border-bright-purple rounded p-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-bright-yellow mb-2">
              {shareData.score.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              {isKorean ? shareData.gameName : shareData.gameNameEn}
            </div>
          </div>
        </div>

        {/* Web Share API (모바일) */}
        {isWebShareSupported() && (
          <button
            onClick={handleWebShare}
            className="w-full bg-gradient-to-r from-bright-purple to-bright-pink text-white py-3 rounded mb-4 hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="text-xl">📤</span>
            <span className="pixel-text text-sm">{isKorean ? '공유하기' : 'Share'}</span>
          </button>
        )}

        {/* SNS 버튼 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Twitter */}
          <button
            onClick={handleTwitterShare}
            className="bg-[#1DA1F2] text-white py-3 rounded hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="text-xl">𝕏</span>
            <span className="text-sm font-medium">Twitter</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            className="bg-[#1877F2] text-white py-3 rounded hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="text-xl">f</span>
            <span className="text-sm font-medium">Facebook</span>
          </button>

          {/* 카카오톡 */}
          <button
            onClick={handleKakaoShare}
            className="bg-[#FEE500] text-black py-3 rounded hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="text-xl">💬</span>
            <span className="text-sm font-medium">{isKorean ? '카카오톡' : 'KakaoTalk'}</span>
          </button>

          {/* 링크 복사 */}
          <button
            onClick={handleCopyLink}
            className="bg-gray-700 text-white py-3 rounded hover:opacity-80 transition-opacity flex items-center justify-center gap-2 relative"
          >
            <span className="text-xl">📋</span>
            <span className="text-sm font-medium">{isKorean ? '복사' : 'Copy'}</span>
            {showCopySuccess && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded text-xs whitespace-nowrap">
                {isKorean ? '복사됨!' : 'Copied!'}
              </span>
            )}
          </button>
        </div>

        {/* 프리뷰 메시지 */}
        <div className="bg-black/30 border border-gray-700 rounded p-3 text-xs text-gray-400">
          <div className="whitespace-pre-wrap">{message}</div>
        </div>
      </div>
    </div>
  );
}
