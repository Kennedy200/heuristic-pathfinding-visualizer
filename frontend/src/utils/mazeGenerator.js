// Recursive backtracker - carves proper corridors like a real maze
const carve = (grid, row, col, height, width) => {
  grid[row][col] = 0;
  const directions = [[0,2],[0,-2],[2,0],[-2,0]].sort(() => Math.random() - 0.5);
  for (const [dr, dc] of directions) {
    const nr = row + dr, nc = col + dc;
    if (nr > 0 && nr < height - 1 && nc > 0 && nc < width - 1 && grid[nr][nc] === 1) {
      grid[row + dr/2][col + dc/2] = 0;
      carve(grid, nr, nc, height, width);
    }
  }
};

export const generateRandomMaze = (size) => {
  // Must be odd for carving algo
  const dim = size % 2 === 0 ? size + 1 : size;
  const grid = Array(dim).fill(null).map(() => Array(dim).fill(1));
  carve(grid, 1, 1, dim, dim);

  // Collect all open cells
  const open = [];
  for (let r = 1; r < dim - 1; r++) {
    for (let c = 1; c < dim - 1; c++) {
      if (grid[r][c] === 0) open.push([r, c]);
    }
  }

  // Pick start randomly from top-ish area, goal from bottom-ish area for good distance
  const topCells = open.filter(([r]) => r < dim * 0.4);
  const bottomCells = open.filter(([r]) => r > dim * 0.6);
  const start = topCells[Math.floor(Math.random() * topCells.length)] || open[0];
  const goal = bottomCells[Math.floor(Math.random() * bottomCells.length)] || open[open.length - 1];

  return { grid, start, goal, height: dim, width: dim };
};