'use client';

import { useState, useEffect } from 'react';
import type { GameTutorialContent, TutorialTab } from '@/lib/tutorial/types';
import { markTutorialSeen } from '@/lib/tutorial/storage';

interface GameTutorialProps {
  content: GameTutorialContent;
  isOpen: boolean;
  onClose: () => void;
  language?: 'ko' | 'en';
}

export function GameTutorial({ content, isOpen, onClose, language = 'ko' }: GameTutorialProps) {
  const [activeTab, setActiveTab] = useState<TutorialTab>('overview');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (dontShowAgain) {
      markTutorialSeen(content.gameId, true);
    } else {
      markTutorialSeen(content.gameId, false);
    }
    onClose();
  };

  if (!isOpen) return null;

  const tabs: Array<{ id: TutorialTab; label: string; labelKo: string }> = [
    { id: 'overview', label: 'Overview', labelKo: '개요' },
    { id: 'controls', label: 'Controls', labelKo: '조작법' },
    { id: 'rules', label: 'Rules', labelKo: '규칙' },
    { id: 'tips', label: 'Tips', labelKo: '팁' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="relative w-full max-w-3xl max-h-[80vh] mx-4 bg-black/95 border-2 border-neon-cyan rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.5)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neon-cyan/30">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-bright hover:text-neon-cyan transition-colors"
            aria-label="Close"
          >
            <span className="text-2xl">✕</span>
          </button>
          <h2 className="pixel-text text-2xl text-neon-cyan mb-1">
            {language === 'ko' ? content.titleKo : content.title}
          </h2>
          <p className="text-sm text-bright/70">{language === 'ko' ? '튜토리얼' : 'Tutorial'}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/20 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm pixel-text transition-colors ${
                activeTab === tab.id
                  ? 'text-neon-cyan border-b-2 border-neon-cyan'
                  : 'text-bright/60 hover:text-bright'
              }`}
            >
              {language === 'ko' ? tab.labelKo : tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-neon-green mb-2">{language === 'ko' ? '게임 소개' : 'About'}</h3>
                <p className="text-bright/90">{language === 'ko' ? content.overviewKo : content.overview}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-neon-yellow mb-2">{language === 'ko' ? '목표' : 'Objective'}</h3>
                <p className="text-bright/90">{language === 'ko' ? content.objectiveKo : content.objective}</p>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-neon-cyan mb-3">⌨️ {language === 'ko' ? '키보드' : 'Keyboard'}</h3>
                <div className="space-y-2">
                  {content.keyboardControls.map((control, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-2 bg-white/5 rounded">
                      <span className="pixel-text text-neon-pink text-sm w-20">{control.key}</span>
                      <span className="text-bright/90 text-sm">{language === 'ko' ? control.actionKo : control.action}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-neon-purple mb-3">📱 {language === 'ko' ? '터치' : 'Touch'}</h3>
                <div className="space-y-2">
                  {content.touchControls.map((control, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-2 bg-white/5 rounded">
                      <span className="text-2xl w-20">{control.key}</span>
                      <span className="text-bright/90 text-sm">{language === 'ko' ? control.actionKo : control.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div>
              <h3 className="text-lg font-bold text-neon-yellow mb-3">📋 {language === 'ko' ? '게임 규칙' : 'Game Rules'}</h3>
              <ul className="space-y-2">
                {(language === 'ko' ? content.rulesKo : content.rules).map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-2">
                    <span className="text-neon-cyan mt-1">•</span>
                    <span className="text-bright/90 text-sm flex-1">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'tips' && (
            <div>
              <h3 className="text-lg font-bold text-neon-green mb-3">💡 {language === 'ko' ? '팁 & 전략' : 'Tips & Strategy'}</h3>
              <ul className="space-y-2">
                {(language === 'ko' ? content.tipsKo : content.tips).map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-2">
                    <span className="text-neon-yellow mt-1">★</span>
                    <span className="text-bright/90 text-sm flex-1">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-bright/70 hover:text-bright transition-colors">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4"
            />
            <span>{language === 'ko' ? '다시 보지 않기' : "Don't show again"}</span>
          </label>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan pixel-text text-sm hover:bg-neon-cyan/30 transition-colors rounded"
          >
            {language === 'ko' ? '확인' : 'Got it!'}
          </button>
        </div>
      </div>
    </div>
  );
}
