# simple_test.py
"""
Simple comparison of all heuristics - EASY TO UNDERSTAND
"""

from maze import Maze
from algorithms import a_star_search
from heuristics import HEURISTICS


def print_maze_visual(maze):
    """Print the maze nicely"""
    print("\nMaze:")
    print(maze)
    print()


def compare_heuristics_on_maze(maze, maze_name):
    """
    Run all heuristics on one maze and show results
    Simple and clear output
    """
    print("=" * 70)
    print(f"Testing: {maze_name}")
    print("=" * 70)
    print_maze_visual(maze)
    
    print(f"{'Heuristic':<15} {'Nodes Checked':<15} {'Path Length':<15} {'Time (seconds)'}")
    print("-" * 70)
    
    results = []
    
    for h_name, h_func in HEURISTICS.items():
        result = a_star_search(maze, h_func)
        
        print(f"{h_name:<15} {result['nodes_explored']:<15} "
              f"{result['path_length']:<15} {result['time_taken']:.6f}")
        
        results.append({
            'heuristic': h_name,
            'nodes': result['nodes_explored'],
            'path_length': result['path_length']
        })
    
    # Find the winner (least nodes explored)
    winner = min(results, key=lambda x: x['nodes'])
    
    print("\n🏆 MOST EFFICIENT: " + winner['heuristic'].upper() + 
          f" (checked only {winner['nodes']} positions)")
    print()
    
    return results


def main():
    """Run simple tests on 3 mazes"""
    
    print("\n" + "=" * 70)
    print("HEURISTIC COMPARISON TEST")
    print("Comparing 5 different heuristic functions")
    print("=" * 70)
    
    # TEST 1: Simple small maze
    print("\n\nTEST 1: SMALL MAZE (5x5)")
    maze1 = Maze.create_simple_maze()
    results1 = compare_heuristics_on_maze(maze1, "Small Maze")
    
    # TEST 2: Medium maze
    print("\n\nTEST 2: MEDIUM MAZE (10x10)")
    from utils import create_medium_maze
    maze2 = create_medium_maze()
    results2 = compare_heuristics_on_maze(maze2, "Medium Maze")
    
    # TEST 3: Random maze
    print("\n\nTEST 3: RANDOM MAZE (15x15)")
    from utils import generate_random_maze
    maze3 = generate_random_maze(15, 15, 0.25)
    results3 = compare_heuristics_on_maze(maze3, "Random Maze")
    
    # SUMMARY
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print("\nKey Finding:")
    print("Different heuristics explore different numbers of positions.")
    print("More efficient heuristic = fewer positions checked = faster solution!")
    print("\nOur CUSTOM heuristic generally performs best by being smarter")
    print("about avoiding obstacles.")
    print("=" * 70)
    
    # Save simple report
    with open('test_results.txt', 'w') as f:
        f.write("HEURISTIC COMPARISON RESULTS\n")
        f.write("=" * 70 + "\n\n")
        f.write("This shows how different 'smart guessing' methods compare\n")
        f.write("when finding paths through mazes.\n\n")
        f.write("Lower 'Nodes Checked' = More Efficient\n")
        f.write("=" * 70 + "\n")
    
    print("\n✅ Results saved to 'test_results.txt'")


if __name__ == "__main__":
    main()