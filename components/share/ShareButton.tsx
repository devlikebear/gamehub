/**
 * Share Button Component
 *
 * SNS 공유 버튼
 */

'use client';

import { useState } from 'react';
import { ShareModal } from './ShareModal';
import type { ShareData } from '@/lib/share/templates';

export interface ShareButtonProps {
  shareData: ShareData;
  className?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
}

export function ShareButton({ shareData, className = '', variant = 'primary' }: ShareButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const baseStyles = 'flex items-center justify-center gap-2 rounded transition-all';

  const variantStyles = {
    primary: 'bg-bright-purple hover:bg-bright-purple/80 text-white px-6 py-3',
    secondary: 'bg-black/50 border-2 border-bright-purple hover:border-bright-pink text-bright-purple hover:text-bright-pink px-6 py-3',
    minimal: 'text-bright-purple hover:text-bright-pink px-3 py-2',
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        aria-label="점수 공유하기"
      >
        <span className="text-xl">🔗</span>
        <span className="pixel-text text-sm">공유</span>
      </button>

      <ShareModal
        shareData={shareData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
