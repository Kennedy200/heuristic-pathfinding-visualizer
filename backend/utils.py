# utils.py
"""
Utility functions for maze generation and testing
"""

import random
from maze import Maze


def generate_random_maze(width, height, obstacle_probability=0.3):
    """
    Generate a random maze
    
    Args:
        width: maze width
        height: maze height
        obstacle_probability: probability of cell being a wall (0-1)
    
    Returns:
        Maze object
    """
    grid = [[0 for _ in range(width)] for _ in range(height)]
    
    # Add random obstacles
    for row in range(height):
        for col in range(width):
            if random.random() < obstacle_probability:
                grid[row][col] = 1
    
    # Ensure start and goal are clear
    start = (0, 0)
    goal = (height - 1, width - 1)
    
    grid[start[0]][start[1]] = 0
    grid[goal[0]][goal[1]] = 0
    
    return Maze(grid, start, goal)


def create_medium_maze():
    """Create a 10x10 medium difficulty maze"""
    grid = [
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0]
    ]
    return Maze(grid, start=(0, 0), goal=(9, 9))


def create_large_maze():
    """Create a 20x20 large maze"""
    return generate_random_maze(20, 20, obstacle_probability=0.25)


if __name__ == "__main__":
    from algorithms import a_star_search
    from heuristics import manhattan_distance, euclidean_distance, custom_heuristic
    
    # Test medium maze
    print("MEDIUM MAZE TEST")
    print("=" * 60)
    maze = create_medium_maze()
    print(maze)
    print()
    
    heuristics = [
        ('Manhattan', manhattan_distance),
        ('Euclidean', euclidean_distance),
        ('Custom', custom_heuristic)
    ]
    
    for name, hfunc in heuristics:
        result = a_star_search(maze, hfunc)
        print(f"{name:12} - Nodes: {result['nodes_explored']:3}, "
              f"Path: {result['path_length']:2}, "
              f"Time: {result['time_taken']:.6f}s")