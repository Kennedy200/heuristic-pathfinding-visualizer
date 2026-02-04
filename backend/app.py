from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from algorithms import a_star_search
from heuristics import get_heuristic
from utils import generate_random_maze
import csv
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- CSV SETUP ---
DATA_DIR = 'data'
CSV_FILE = os.path.join(DATA_DIR, 'experiments.csv')

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

def log_to_csv(results, maze_size):
    """Saves every comparison run to the CSV dataset."""
    file_exists = os.path.isfile(CSV_FILE)
    with open(CSV_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['Timestamp', 'Maze Size', 'Heuristic', 'Nodes Explored', 'Path Length', 'Time (s)'])
        
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        for res in results:
            writer.writerow([
                timestamp, 
                maze_size, 
                res['heuristic'], 
                res['nodes_explored'], 
                res['path_length'], 
                f"{res['time_taken']:.6f}"
            ])

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'Heuristic Pathfinding API running', 'version': '1.0'})

@app.route('/generate', methods=['GET'])
def generate():
    size = request.args.get('size', default=15, type=int)
    maze = generate_random_maze(size, size, 0.3)
    maze['start'] = list(maze['start'])
    maze['goal'] = list(maze['goal'])
    return jsonify(maze)

@app.route('/solve', methods=['POST'])
def solve():
    data = request.get_json()
    grid, start, goal = data.get('grid'), data.get('start'), data.get('goal')
    heuristic_name = data.get('heuristic', 'manhattan')
    
    if not grid or not start or not goal:
        return jsonify({'error': 'Missing data'}), 400

    result = a_star_search(grid, start, goal, get_heuristic(heuristic_name))
    result['heuristic'] = heuristic_name
    return jsonify(result)

@app.route('/compare', methods=['POST'])
def compare():
    data = request.get_json()
    grid, start, goal = data.get('grid'), data.get('start'), data.get('goal')
    heuristics = data.get('heuristics', ['manhattan'])

    if not grid or not start or not goal:
        return jsonify({'error': 'Missing data'}), 400

    results = []
    for name in heuristics:
        h_func = get_heuristic(name)
        if not h_func: continue
        result = a_star_search(grid, start, goal, h_func)
        result['heuristic'] = name
        results.append(result)

    # Save results to CSV
    log_to_csv(results, f"{len(grid)}x{len(grid[0])}")

    return jsonify({'results': results})

@app.route('/download-csv', methods=['GET'])
def download():
    if os.path.exists(CSV_FILE):
        return send_file(CSV_FILE, as_attachment=True)
    return jsonify({'error': 'No data found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)