# maze.py
"""
Maze representation and utility functions
"""

class Maze:
    def __init__(self, grid, start, goal):
        """
        Initialize a maze
        
        Args:
            grid: 2D list where 0=walkable, 1=wall
            start: tuple (row, col) for start position
            goal: tuple (row, col) for goal position
        """
        self.grid = grid
        self.height = len(grid)
        self.width = len(grid[0]) if self.height > 0 else 0
        self.start = start
        self.goal = goal
    
    def is_valid(self, position):
        """
        Check if a position is valid and walkable
        
        Args:
            position: tuple (row, col)
        
        Returns:
            bool: True if position is valid and walkable
        """
        row, col = position
        
        if row < 0 or row >= self.height:
            return False
        if col < 0 or col >= self.width:
            return False
        
        # Check if not a wall
        if self.grid[row][col] == 1:
            return False
        
        return True
    
    def get_neighbors(self, position, allow_diagonal=False):
        """
        Get all valid neighboring positions
        
        Args:
            position: tuple (row, col)
            allow_diagonal: bool, if True allows 8-direction movement
        
        Returns:
            list of tuples: valid neighboring positions
        """
        row, col = position
        neighbors = []
        
        directions = [
            (-1, 0),  # up
            (1, 0),   # down
            (0, -1),  # left
            (0, 1),   # right
        ]
        
        # Add diagonal directions if allowed
        if allow_diagonal:
            directions += [
                (-1, -1),  # up-left
                (-1, 1),   # up-right
                (1, -1),   # down-left
                (1, 1),    # down-right
            ]
        
        # Check each direction
        for d_row, d_col in directions:
            new_row = row + d_row
            new_col = col + d_col
            new_pos = (new_row, new_col)
            
            if self.is_valid(new_pos):
                neighbors.append(new_pos)
        
        return neighbors
    
    def is_goal(self, position):
        """Check if position is the goal"""
        return position == self.goal
    
    @staticmethod
    def create_empty_maze(width, height):
        """
        Create an empty maze (all walkable)
        
        Args:
            width: int
            height: int
        
        Returns:
            2D list of zeros
        """
        return [[0 for _ in range(width)] for _ in range(height)]
    
    @staticmethod
    def create_simple_maze():
        """
        Create a simple test maze
        
        Returns:
            Maze object
        """
        grid = [
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0]
        ]
        start = (0, 0)
        goal = (4, 4)
        return Maze(grid, start, goal)
    
    def __str__(self):
        """String representation of maze for debugging"""
        result = []
        for row_idx, row in enumerate(self.grid):
            row_str = []
            for col_idx, cell in enumerate(row):
                pos = (row_idx, col_idx)
                if pos == self.start:
                    row_str.append('S')
                elif pos == self.goal:
                    row_str.append('E')
                elif cell == 1:
                    row_str.append('#')
                else:
                    row_str.append('.')
            result.append(' '.join(row_str))
        return '\n'.join(result)


# Test the Maze class
if __name__ == "__main__":
    # Create a simple maze
    maze = Maze.create_simple_maze()
    
    print("Maze:")
    print(maze)
    print(f"\nStart: {maze.start}")
    print(f"Goal: {maze.goal}")
    print(f"Dimensions: {maze.height}x{maze.width}")
    
    # Test neighbors
    print(f"\nNeighbors of start {maze.start}:")
    print(maze.get_neighbors(maze.start))
    
    # Test with diagonal
    print(f"\nNeighbors of start (with diagonal):")
    print(maze.get_neighbors(maze.start, allow_diagonal=True))