/**
 * 파라미터 텍스트 입력 컴포넌트
 */

'use client';

import React from 'react';

interface ParamInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  neonColor?: 'pink' | 'cyan' | 'purple' | 'yellow';
}

const neonBorder = {
  pink: 'border-[#ff10f0]/50 focus:border-[#ff10f0] focus:shadow-[0_0_15px_rgba(255,16,240,0.5)]',
  cyan: 'border-[#00f0ff]/50 focus:border-[#00f0ff] focus:shadow-[0_0_15px_rgba(0,240,255,0.5)]',
  purple:
    'border-[#9d00ff]/50 focus:border-[#9d00ff] focus:shadow-[0_0_15px_rgba(157,0,255,0.5)]',
  yellow:
    'border-[#ffff00]/50 focus:border-[#ffff00] focus:shadow-[0_0_15px_rgba(255,255,0,0.5)]',
};

export function ParamInput({
  label,
  value,
  placeholder = '',
  onChange,
  multiline = false,
  rows = 3,
  maxLength,
  neonColor = 'cyan',
}: ParamInputProps) {
  const baseClasses = `
    w-full px-4 py-3 bg-black/70 text-white rounded-lg
    border-2 ${neonBorder[neonColor]}
    transition-all duration-200
    font-medium
    focus:outline-none
    placeholder:text-gray-500
  `;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-white font-medium text-sm uppercase tracking-wide">
          {label}
        </label>
        {maxLength && (
          <span className="text-xs text-gray-500">
            {value.length} / {maxLength}
          </span>
        )}
      </div>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={baseClasses}
        />
      )}
    </div>
  );
}
