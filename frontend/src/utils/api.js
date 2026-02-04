import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  generateMaze: async () => {
    const response = await axios.get(`${API_BASE_URL}/generate`);
    return response.data;
  },
  solveMaze: async (grid, start, goal, heuristic, allowDiagonal = false) => {
    const response = await axios.post(`${API_BASE_URL}/solve`, {
      grid, start, goal, heuristic, allow_diagonal: allowDiagonal
    });
    return response.data;
  },
  compareHeuristics: async (grid, start, goal, heuristics, allowDiagonal = false) => {
    const response = await axios.post(`${API_BASE_URL}/compare`, {
      grid, start, goal, heuristics, allow_diagonal: allowDiagonal
    });
    return response.data;
  }
};