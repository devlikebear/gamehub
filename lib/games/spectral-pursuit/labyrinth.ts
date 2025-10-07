export interface CellCoordinate {
  x: number;
  y: number;
}

export interface LabyrinthNode {
  id: string;
  position: CellCoordinate;
  connections: string[];
  portal?: boolean;
}

export interface LabyrinthLayer {
  id: string;
  nodes: LabyrinthNode[];
  portalRotationMs: number;
  elapsed: number;
}

export interface PortalBinding {
  layerId: string;
  nodeId: string;
}

export interface LabyrinthState {
  width: number;
  height: number;
  layers: LabyrinthLayer[];
  portals: PortalBinding[];
  seed: number;
  randomState: number;
}

export interface LabyrinthConfig {
  width: number;
  height: number;
  seed: number;
  portalCount: number;
}

export interface StepOptions {
  reconfigure?: boolean;
}

const MODULUS = 2147483647;
const MULTIPLIER = 16807;

export function createLabyrinthState(config: LabyrinthConfig): LabyrinthState {
  const baseSeed = normalizeSeed(config.seed);
  let randomState = baseSeed;

  const layerCount = 3;
  const layers: LabyrinthLayer[] = [];
  const portals: PortalBinding[] = [];

  for (let layerIndex = 0; layerIndex < layerCount; layerIndex += 1) {
    const [jitter, nextState] = nextRandom(randomState);
    randomState = nextState;

    const nodeCount = 6 + layerIndex * 3;
    const radiusX = (config.width / 2) * (0.45 + layerIndex * 0.18);
    const radiusY = (config.height / 2) * (0.45 + layerIndex * 0.18);
    const portalRotationMs = 5400 + Math.floor(jitter * 2200);

    const nodes: LabyrinthNode[] = [];
    for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex += 1) {
      const baseAngle = (Math.PI * 2 * nodeIndex) / nodeCount;
      const [angleVariance, nextAngleState] = nextRandom(randomState);
      randomState = nextAngleState;
      const angle = baseAngle + (angleVariance - 0.5) * 0.35;

      const x = Math.round(config.width / 2 + Math.cos(angle) * radiusX);
      const y = Math.round(config.height / 2 + Math.sin(angle) * radiusY);

      nodes.push({
        id: `L${layerIndex}-N${nodeIndex}`,
        position: { x, y },
        connections: [],
        portal: false,
      });
    }

    for (let nodeIndex = 0; nodeIndex < nodeCount; nodeIndex += 1) {
      const current = nodes[nodeIndex];
      const nextIndex = (nodeIndex + 1) % nodeCount;
      const prevIndex = (nodeIndex + nodeCount - 1) % nodeCount;

      pushUnique(current.connections, nodes[nextIndex].id);
      pushUnique(current.connections, nodes[prevIndex].id);

      if (layerIndex > 0) {
        const innerLayer = layers[layerIndex - 1];
        const bridgeIndex = Math.round((innerLayer.nodes.length * nodeIndex) / nodeCount) % innerLayer.nodes.length;
        pushUnique(current.connections, innerLayer.nodes[bridgeIndex].id);
      }
    }

    const portalIds = pickPortals(nodes, config.portalCount, randomState);
    randomState = portalIds.nextState;
    portalIds.ids.forEach((nodeId) => {
      const node = nodes.find((candidate) => candidate.id === nodeId);
      if (node) {
        node.portal = true;
        portals.push({ layerId: `L${layerIndex}`, nodeId });
      }
    });

    layers.push({
      id: `L${layerIndex}`,
      nodes,
      portalRotationMs,
      elapsed: 0,
    });
  }

  return {
    width: config.width,
    height: config.height,
    layers,
    portals,
    seed: baseSeed,
    randomState,
  };
}

export function stepLabyrinth(
  state: LabyrinthState,
  deltaMs: number,
  options: StepOptions
): LabyrinthState {
  let randomState = state.randomState;
  const portals: PortalBinding[] = [];

  const layers = state.layers.map((layer) => {
    const elapsed = layer.elapsed + deltaMs;
    const shouldReconfigure = options.reconfigure || elapsed >= layer.portalRotationMs;

    if (!shouldReconfigure) {
      layer.nodes
        .filter((node) => node.portal)
        .forEach((node) => portals.push({ layerId: layer.id, nodeId: node.id }));

      return {
        ...layer,
        elapsed,
      };
    }

    const cleanNodes = layer.nodes.map((node) => ({ ...node, portal: false }));
    const portalIds = pickPortals(cleanNodes, Math.max(1, Math.round(cleanNodes.length * 0.2)), randomState, {
      previous: state.portals.filter((portal) => portal.layerId === layer.id).map((portal) => portal.nodeId),
    });
    randomState = portalIds.nextState;

    portalIds.ids.forEach((nodeId) => {
      const node = cleanNodes.find((candidate) => candidate.id === nodeId);
      if (node) {
        node.portal = true;
        portals.push({ layerId: layer.id, nodeId });
      }
    });

    return {
      ...layer,
      nodes: cleanNodes,
      elapsed: 0,
    };
  });

  return {
    ...state,
    layers,
    portals,
    randomState,
  };
}

export function getActivePortals(state: LabyrinthState): PortalBinding[] {
  return state.portals;
}

function pickPortals(
  nodes: LabyrinthNode[],
  requestedCount: number,
  randomState: number,
  options: { previous?: string[] } = {}
): { ids: string[]; nextState: number } {
  const eligible = nodes.map((node) => node.id);
  const ids = new Set<string>();
  let nextState = randomState;

  const count = Math.min(requestedCount, eligible.length);
  let safety = 0;
  while (ids.size < count && safety < eligible.length * 4) {
    const [value, updatedState] = nextRandom(nextState);
    nextState = updatedState;
    const index = Math.floor(value * eligible.length);
    ids.add(eligible[index]);
    safety += 1;
  }

  const previous = options.previous ?? [];
  if (arraysEqual(previous, Array.from(ids)) && eligible.length > count) {
    const alternative = eligible.find((candidate) => !ids.has(candidate) || !previous.includes(candidate));
    if (alternative) {
      const first = ids.values().next().value;
      if (first) {
        ids.delete(first);
      }
      ids.add(alternative);
    }
  }

  return { ids: Array.from(ids), nextState };
}

function pushUnique(collection: string[], value: string): void {
  if (!collection.includes(value)) {
    collection.push(value);
  }
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((value, index) => value === sortedB[index]);
}

function nextRandom(state: number): [number, number] {
  const normalized = state <= 0 ? 1 : state;
  const next = (normalized * MULTIPLIER) % MODULUS;
  return [next / MODULUS, next];
}

function normalizeSeed(seed: number): number {
  if (!Number.isFinite(seed)) return 1;
  const normalized = Math.abs(Math.floor(seed)) % MODULUS;
  return normalized === 0 ? 1 : normalized;
}
