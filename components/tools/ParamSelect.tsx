/**
 * 파라미터 선택 드롭다운 컴포넌트
 */

'use client';

import React from 'react';

interface ParamSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
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

export function ParamSelect({
  label,
  value,
  options,
  onChange,
  neonColor = 'cyan',
}: ParamSelectProps) {
  return (
    <div className="mb-6">
      <label className="block text-white font-medium text-sm uppercase tracking-wide mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full px-4 py-3 bg-black/70 text-white rounded-lg
          border-2 ${neonBorder[neonColor]}
          transition-all duration-200
          cursor-pointer
          appearance-none
          font-medium
          focus:outline-none
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300f0ff' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
