export const CELL_COLORS = {
  WALL: '#2d5a27',
  WALL_TOP: '#3a7a32',
  WALL_SIDE: '#1e3d18',
  PATH: '#c8e6c0',
  PATH_SHADOW: '#b0d4a8',
  START: '#3b82f6',
  GOAL: '#10b981',
  GOAL_REACHED: '#00e676',
  EXPLORING: '#fbbf24',
  EXPLORED: '#a78bfa',
  SOLUTION: '#f43f5e',
  BORDER: '#a3c9a0'
};

export const getCellColor = (cellState) => {
  switch (cellState) {
    case 'wall': return CELL_COLORS.WALL;
    case 'start': return CELL_COLORS.START;
    case 'goal': return CELL_COLORS.GOAL;
    case 'goalReached': return CELL_COLORS.GOAL_REACHED;
    case 'exploring': return CELL_COLORS.EXPLORING;
    case 'explored': return CELL_COLORS.EXPLORED;
    case 'solution': return CELL_COLORS.SOLUTION;
    case 'path':
    default: return CELL_COLORS.PATH;
  }
};

export const HEURISTIC_COLORS = {
  manhattan: '#3b82f6',
  euclidean: '#10b981',
  chebyshev: '#f59e0b',
  octile: '#8b5cf6',
  custom: '#ef4444'
};