import { describe, expect, it } from 'vitest';

import { generateNickname, sanitizeNickname } from '../nickname';

describe('nickname generator', () => {
  it('generates deterministic nickname when seed provided', () => {
    const first = generateNickname(42);
    const second = generateNickname(42);
    expect(first).toBe(second);
  });

  it('sanitizes disallowed characters and enforces length', () => {
    const sanitized = sanitizeNickname('@@Quantum#Pilot!!!');
    expect(sanitized).toBe('QuantumPilot');
    expect(sanitized.length).toBeLessThanOrEqual(18);
  });
});
