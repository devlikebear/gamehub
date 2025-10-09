/**
 * 파라미터 슬라이더 컴포넌트
 */

'use client';

import React from 'react';

interface ParamSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  neonColor?: 'pink' | 'cyan' | 'purple' | 'yellow';
}

const neonColors = {
  pink: 'accent-[#ff10f0]',
  cyan: 'accent-[#00f0ff]',
  purple: 'accent-[#9d00ff]',
  yellow: 'accent-[#ffff00]',
};

const neonGlow = {
  pink: 'shadow-[0_0_10px_rgba(255,16,240,0.5)]',
  cyan: 'shadow-[0_0_10px_rgba(0,240,255,0.5)]',
  purple: 'shadow-[0_0_10px_rgba(157,0,255,0.5)]',
  yellow: 'shadow-[0_0_10px_rgba(255,255,0,0.5)]',
};

export function ParamSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  neonColor = 'cyan',
}: ParamSliderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-white font-medium text-sm uppercase tracking-wide">
          {label}
        </label>
        <span className={`text-lg font-bold text-${neonColor} ${neonGlow[neonColor]}`}>
          {value}
          {unit}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`
          w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer
          ${neonColors[neonColor]}
          hover:${neonGlow[neonColor]}
          transition-shadow duration-200
        `}
        style={{
          background: `linear-gradient(to right,
            rgba(0, 240, 255, 0.3) 0%,
            rgba(0, 240, 255, 0.3) ${((value - min) / (max - min)) * 100}%,
            rgba(0, 0, 0, 0.5) ${((value - min) / (max - min)) * 100}%,
            rgba(0, 0, 0, 0.5) 100%)`,
        }}
      />

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
