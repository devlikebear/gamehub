'use client';

import { useState, useEffect } from 'react';
import type { DifficultyLevel, DifficultyConfig } from '@/lib/difficulty/types';
import { getAllDifficultyConfigs } from '@/lib/difficulty/data';
import { loadDifficulty, saveDifficulty } from '@/lib/difficulty/storage';

interface DifficultySelectorProps {
  gameId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (difficulty: DifficultyLevel) => void;
  language?: 'ko' | 'en';
}

export function DifficultySelector({ gameId, isOpen, onClose, onSelect, language = 'ko' }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('normal');
  const difficulties = getAllDifficultyConfigs();

  useEffect(() => {
    // Load saved difficulty on mount
    const savedDifficulty = loadDifficulty(gameId);
    setSelectedDifficulty(savedDifficulty);
  }, [gameId]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
    saveDifficulty(gameId, difficulty);
    onSelect(difficulty);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl mx-4 bg-black/90 border-2 border-neon-cyan rounded-lg p-8 shadow-[0_0_30px_rgba(0,240,255,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-bright-cyan transition-colors"
          aria-label="Close"
        >
          <span className="text-2xl">✕</span>
        </button>

        {/* Title */}
        <h2 className="pixel-text text-3xl text-center text-bright-cyan mb-2">
          {language === 'ko' ? '난이도 선택' : 'SELECT DIFFICULTY'}
        </h2>
        <p className="text-center text-white/90 text-sm mb-8">
          {language === 'ko' ? '게임 난이도를 선택하세요' : 'Choose your challenge level'}
        </p>

        {/* Difficulty cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficulties.map((difficulty) => (
            <DifficultyCard
              key={difficulty.level}
              difficulty={difficulty}
              isSelected={selectedDifficulty === difficulty.level}
              onSelect={() => handleSelect(difficulty.level)}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface DifficultyCardProps {
  difficulty: DifficultyConfig;
  isSelected: boolean;
  onSelect: () => void;
  language: 'ko' | 'en';
}

function DifficultyCard({ difficulty, isSelected, onSelect, language }: DifficultyCardProps) {
  const borderColor = {
    green: 'border-neon-green',
    cyan: 'border-neon-cyan',
    pink: 'border-neon-pink',
  }[difficulty.color];

  const glowColor = {
    green: 'shadow-[0_0_20px_rgba(0,255,0,0.5)]',
    cyan: 'shadow-[0_0_20px_rgba(0,240,255,0.5)]',
    pink: 'shadow-[0_0_20px_rgba(255,16,240,0.5)]',
  }[difficulty.color];

  const textColor = {
    green: 'text-neon-green',
    cyan: 'text-neon-cyan',
    pink: 'text-neon-pink',
  }[difficulty.color];

  return (
    <button
      onClick={onSelect}
      className={`
        relative p-6 bg-black/50 border-2 rounded-lg transition-all duration-300
        hover:scale-105 hover:${glowColor}
        ${isSelected ? `${borderColor} ${glowColor}` : 'border-white/30'}
      `}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className={`absolute top-2 right-2 ${textColor}`}>
          <span className="text-xl">✓</span>
        </div>
      )}

      {/* Icon */}
      <div className="text-6xl mb-4 text-center">{difficulty.icon}</div>

      {/* Title */}
      <h3 className={`pixel-text text-xl mb-3 ${textColor}`}>{language === 'ko' ? difficulty.nameKo : difficulty.name}</h3>

      {/* Description */}
      <p className="text-white/80 text-sm mb-3">
        {language === 'ko' ? difficulty.descriptionKo : difficulty.description}
      </p>

      {/* Recommended for */}
      <p className="text-white/60 text-xs">{language === 'ko' ? difficulty.recommendedKo : difficulty.recommended}</p>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-white/20 space-y-1">
        <div className="flex justify-between text-xs text-white/70">
          <span>{language === 'ko' ? '속도' : 'Speed'}:</span>
          <span>{Math.round(difficulty.speedMultiplier * 100)}%</span>
        </div>
        <div className="flex justify-between text-xs text-white/70">
          <span>{language === 'ko' ? '점수 배율' : 'Score'}:</span>
          <span>{Math.round(difficulty.scoreMultiplier * 100)}%</span>
        </div>
      </div>
    </button>
  );
}
