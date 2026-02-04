# experiments.py
"""
Automated experiment system for comparing heuristics
"""

import time
import csv
import json
from datetime import datetime
from maze import Maze
from algorithms import a_star_search
from heuristics import HEURISTICS
from utils import generate_random_maze, create_medium_maze


def run_single_experiment(maze, heuristic_name, heuristic_func, allow_diagonal=False):
    """
    Run A* on a maze with a specific heuristic
    
    Returns:
        dict: experiment results
    """
    result = a_star_search(maze, heuristic_func, allow_diagonal)
    
    return {
        'heuristic': heuristic_name,
        'maze_size': f"{maze.height}x{maze.width}",
        'nodes_explored': result['nodes_explored'],
        'path_length': result['path_length'],
        'time_taken': result['time_taken'],
        'success': result['success']
    }


def run_experiment_suite(num_mazes=10, maze_size=(10, 10), obstacle_prob=0.3):
    """
    Run comprehensive experiments comparing all heuristics
    
    Args:
        num_mazes: number of random mazes to test
        maze_size: tuple (height, width)
        obstacle_prob: probability of obstacles
    
    Returns:
        list: all experiment results
    """
    results = []
    
    print(f"\n🧪 Running {num_mazes} experiments on {maze_size[0]}x{maze_size[1]} mazes")
    print("=" * 70)
    
    for maze_num in range(num_mazes):
        print(f"\nMaze {maze_num + 1}/{num_mazes}:")
        
        # Generate random maze
        maze = generate_random_maze(maze_size[1], maze_size[0], obstacle_prob)
        
        # Test each heuristic
        for h_name, h_func in HEURISTICS.items():
            result = run_single_experiment(maze, h_name, h_func)
            result['maze_id'] = maze_num
            results.append(result)
            
            print(f"  {h_name:12} - Nodes: {result['nodes_explored']:4}, "
                  f"Path: {result['path_length']:3}, "
                  f"Time: {result['time_taken']:.6f}s, "
                  f"Success: {result['success']}")
    
    return results


def save_results_to_csv(results, filename='data/experiment_results.csv'):
    """Save experiment results to CSV file"""
    if not results:
        print("No results to save!")
        return
    
    import os
    os.makedirs('data', exist_ok=True)
    
    # Write CSV
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = results[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        for result in results:
            writer.writerow(result)
    
    print(f"\n✅ Results saved to {filename}")


def analyze_results(results):
    """
    Analyze and summarize experiment results
    
    Args:
        results: list of experiment results
    """
    print("\n" + "=" * 70)
    print("📊 EXPERIMENT SUMMARY")
    print("=" * 70)
    
    by_heuristic = {}
    for result in results:
        h_name = result['heuristic']
        if h_name not in by_heuristic:
            by_heuristic[h_name] = []
        by_heuristic[h_name].append(result)
    
    print(f"\n{'Heuristic':<15} {'Avg Nodes':<12} {'Avg Time':<12} {'Success Rate'}")
    print("-" * 70)
    
    for h_name, h_results in sorted(by_heuristic.items()):
        successful = [r for r in h_results if r['success']]
        
        if successful:
            avg_nodes = sum(r['nodes_explored'] for r in successful) / len(successful)
            avg_time = sum(r['time_taken'] for r in successful) / len(successful)
            success_rate = len(successful) / len(h_results) * 100
            
            print(f"{h_name:<15} {avg_nodes:<12.1f} {avg_time:<12.6f} {success_rate:.1f}%")
    
    # Find winner (lowest average nodes explored)
    winner = min(by_heuristic.items(), 
                 key=lambda x: sum(r['nodes_explored'] for r in x[1] if r['success']) / 
                               len([r for r in x[1] if r['success']]))
    
    print(f"\n🏆 WINNER: {winner[0].upper()} (most efficient)")
    print("=" * 70)


def run_difficulty_comparison():
    """Compare heuristics across different difficulty levels"""
    print("\n" + "=" * 70)
    print("🎯 DIFFICULTY LEVEL COMPARISON")
    print("=" * 70)
    
    difficulties = [
        ("Easy", 5, 5, 0.2),
        ("Medium", 10, 10, 0.3),
        ("Hard", 20, 20, 0.35),
    ]
    
    all_results = []
    
    for diff_name, height, width, obstacle_prob in difficulties:
        print(f"\n\n{diff_name.upper()} DIFFICULTY ({height}x{width}, {obstacle_prob*100}% obstacles)")
        print("-" * 70)
        
        results = run_experiment_suite(
            num_mazes=5,  # 5 mazes per difficulty
            maze_size=(height, width),
            obstacle_prob=obstacle_prob
        )
        
        # Add difficulty label
        for r in results:
            r['difficulty'] = diff_name
        
        all_results.extend(results)
    
    return all_results


def quick_test():
    """Quick test on medium maze"""
    print("\n🧪 QUICK TEST - Medium Maze")
    print("=" * 70)
    
    maze = create_medium_maze()
    print(maze)
    print()
    
    results = []
    for h_name, h_func in HEURISTICS.items():
        result = run_single_experiment(maze, h_name, h_func)
        results.append(result)
        
        print(f"{h_name:12} - Nodes: {result['nodes_explored']:4}, "
              f"Path: {result['path_length']:3}, "
              f"Time: {result['time_taken']:.6f}s")
    
    return results


if __name__ == "__main__":
    import sys
    
    print("\n" + "=" * 70)
    print("🔬 HEURISTIC PATHFINDING EXPERIMENTS")
    print("=" * 70)
    
    if len(sys.argv) > 1 and sys.argv[1] == 'full':
        print("\nRunning FULL experiment suite...")
        results = run_difficulty_comparison()
        save_results_to_csv(results)
        analyze_results(results)
    
    elif len(sys.argv) > 1 and sys.argv[1] == 'medium':
        print("\nRunning MEDIUM scale experiments...")
        results = run_experiment_suite(num_mazes=20, maze_size=(15, 15))
        save_results_to_csv(results)
        analyze_results(results)
    
    else:
        results = quick_test()
        print("\n💡 Tip: Run 'python experiments.py full' for comprehensive experiments")