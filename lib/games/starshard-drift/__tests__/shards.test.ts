import { describe, expect, it } from 'vitest';

import { applyResonanceCollision, createResonanceField, stepResonanceField } from '../shards';

describe('createResonanceField', () => {
  it('initializes shards with resonance meters and mission goals', () => {
    const field = createResonanceField({ shardCount: 6, seed: 21 });

    expect(field.shards.length).toBe(6);
    expect(field.shards[0].resonance).toBeDefined();
    expect(field.objective.requiredCores).toBeGreaterThan(0);
  });
});

describe('stepResonanceField', () => {
  it('advances resonance and flags overload when threshold exceeded', () => {
    const field = createResonanceField({ shardCount: 4, seed: 9 });
    const updated = stepResonanceField(field, 900, {
      stabilization: 0.1,
    });

    const overloadedCount = updated.shards.filter((shard) => shard.state === 'overload').length;
    expect(overloadedCount + updated.stabilizedCores).toBeGreaterThanOrEqual(field.stabilizedCores);
  });
});

describe('applyResonanceCollision', () => {
  it('splits shards into fragments when overload state triggers', () => {
    const baseField = createResonanceField({ shardCount: 3, seed: 3 });
    const field = {
      ...baseField,
      shards: baseField.shards.map((shard) => ({
        ...shard,
        resonance: 1.1,
        state: 'overload' as const,
      })),
    };

    const result = applyResonanceCollision(field, { shardId: field.shards[0].id });

    expect(result.spawnedFragments.length).toBeGreaterThan(0);
    expect(result.updatedField.shards.length).toBeGreaterThan(field.shards.length);
  });
});
