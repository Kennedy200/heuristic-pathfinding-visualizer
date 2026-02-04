# heuristics.py
"""
Heuristic functions for A* pathfinding
"""

import math


def manhattan_distance(pos1, pos2):
    """
    Manhattan distance (L1 norm)
    Best for 4-direction movement (no diagonals)
    
    Args:
        pos1: tuple (row, col)
        pos2: tuple (row, col)
    
    Returns:
        int: Manhattan distance
    """
    return abs(pos1[0] - pos2[0]) + abs(pos1[1] - pos2[1])


def euclidean_distance(pos1, pos2):
    """
    Euclidean distance (L2 norm)
    Straight-line distance
    
    Args:
        pos1: tuple (row, col)
        pos2: tuple (row, col)
    
    Returns:
        float: Euclidean distance
    """
    return math.sqrt((pos1[0] - pos2[0])**2 + (pos1[1] - pos2[1])**2)


def chebyshev_distance(pos1, pos2):
    """
    Chebyshev distance (L-infinity norm)
    Best for 8-direction movement where diagonal costs same as straight
    
    Args:
        pos1: tuple (row, col)
        pos2: tuple (row, col)
    
    Returns:
        int: Chebyshev distance
    """
    return max(abs(pos1[0] - pos2[0]), abs(pos1[1] - pos2[1]))


def octile_distance(pos1, pos2):
    """
    Octile distance
    Best for 8-direction movement where diagonal costs √2
    
    Args:
        pos1: tuple (row, col)
        pos2: tuple (row, col)
    
    Returns:
        float: Octile distance
    """
    dx = abs(pos1[0] - pos2[0])
    dy = abs(pos1[1] - pos2[1])
    
    # Cost: 1 for straight, √2 for diagonal
    return (dx + dy) + (math.sqrt(2) - 2) * min(dx, dy)


def custom_heuristic(pos1, pos2, maze=None):
    """
    Custom heuristic: Weighted Manhattan + Cross-Product Tie-Breaking.
    
    This beats standard Manhattan by being "greedy":
    1. Weighted: Multiplies distance by 1.5. This forces A* to favor nodes 
       closer to the goal much more aggressively than nodes close to the start.
    2. Tie-Breaking: Adds a tiny penalty for deviating from the straight line 
       between Start and Goal. This stops the search from expanding in a 
       fat "diamond" shape and keeps it narrow (like a spear).
    
    Args:
        pos1: tuple (row, col)
        pos2: tuple (row, col)
        maze: Maze object (needed for start position calculations)
    
    Returns:
        float: Custom heuristic value
    """
    row, col = pos1
    goal_row, goal_col = pos2
    
    # 1. Base Manhattan Distance
    dx = abs(row - goal_row)
    dy = abs(col - goal_col)
    h = dx + dy
    
    # 2. Add Weighting (The "Greedy" Part)
    # A weight > 1 makes A* behave more like Best-First Search
    # This drastically reduces nodes explored.
    h = h * 2.0
    
    # 3. Add Tie-Breaker
    # If we have the maze info, we calculate the deviation from the straight line
    if maze:
        start_row, start_col = maze.start
        
        dx1 = row - goal_row
        dy1 = col - goal_col
        dx2 = start_row - goal_row
        dy2 = start_col - goal_col
        
        # Cross product measures how far 'pos1' is from the line Start->Goal
        cross = abs(dx1 * dy2 - dx2 * dy1)
        
        # Add tiny penalty for deviation
        h += cross * 0.001
        
    return h


# Dictionary mapping heuristic names to functions
HEURISTICS = {
    'manhattan': manhattan_distance,
    'euclidean': euclidean_distance,
    'chebyshev': chebyshev_distance,
    'octile': octile_distance,
    'custom': custom_heuristic
}


def get_heuristic(name):
    """
    Get heuristic function by name
    
    Args:
        name: string name of heuristic
    
    Returns:
        function: heuristic function
    """
    return HEURISTICS.get(name.lower(), manhattan_distance)


# Test the heuristics
if __name__ == "__main__":
    pos1 = (0, 0)
    pos2 = (4, 4)
    
    # Mock class for testing
    class MockMaze:
        def __init__(self):
            self.start = (0, 0)
    
    mock_maze = MockMaze()
    
    print(f"Distance from {pos1} to {pos2}:\n")
    print(f"Manhattan:  {manhattan_distance(pos1, pos2)}")
    print(f"Euclidean:  {euclidean_distance(pos1, pos2):.2f}")
    print(f"Chebyshev:  {chebyshev_distance(pos1, pos2)}")
    print(f"Octile:     {octile_distance(pos1, pos2):.2f}")
    print(f"Custom:     {custom_heuristic(pos1, pos2, mock_maze):.2f}")