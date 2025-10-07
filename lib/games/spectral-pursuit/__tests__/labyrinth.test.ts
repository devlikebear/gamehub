import { describe, expect, it } from 'vitest';

import {
  LabyrinthState,
  createLabyrinthState,
  getActivePortals,
  stepLabyrinth,
} from '../labyrinth';

describe('createLabyrinthState', () => {
  it('creates layered labyrinth with portal nodes per layer', () => {
    const state = createLabyrinthState({
      width: 28,
      height: 18,
      seed: 42,
      portalCount: 3,
    });

    expect(state.layers.length).toBeGreaterThanOrEqual(2);
    state.layers.forEach((layer) => {
      expect(layer.nodes.length).toBeGreaterThan(0);
      const portalNodes = layer.nodes.filter((node) => node.portal);
      expect(portalNodes.length).toBeGreaterThanOrEqual(1);
      const uniqueConnections = new Set(
        layer.nodes.flatMap((node) => node.connections)
      );
      expect(uniqueConnections.size).toBeGreaterThan(portalNodes.length);
    });
  });
});

describe('stepLabyrinth', () => {
  it('reconfigures portal nodes when enough time has elapsed', () => {
    const state: LabyrinthState = createLabyrinthState({
      width: 24,
      height: 16,
      seed: 7,
      portalCount: 2,
    });

    const portalsBefore = getActivePortals(state).map((portal) => portal.nodeId);
    const updated = stepLabyrinth(state, 6500, { reconfigure: true });
    const portalsAfter = getActivePortals(updated).map((portal) => portal.nodeId);

    expect(portalsAfter).not.toEqual(portalsBefore);
  });
});
