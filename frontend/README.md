🧠 Heuristic Pathfinding Visualizer

An Interactive Analysis of Optimal Problem Solving using A Search*
1. Project Overview

This application is a comprehensive research tool designed to visualize, compare, and analyze the efficiency of different heuristic functions in the A* (A-Star) search algorithm. It allows users to generate complex maze environments and race different mathematical estimation strategies against each other in real-time.

Core Objective: To demonstrate how different heuristic functions (Manhattan, Euclidean, and Novel Custom Heuristics) impact the computational cost and speed of finding optimal paths.
2. Technical Architecture
Backend (The Intelligence Engine)

    Language: Python 3.9+

    Framework: Flask (REST API)

    Key Libraries: numpy (math), heapq (priority queues for A*)

    Role: Handles the heavy lifting. It generates the maze structure, runs the pathfinding algorithms, calculates the heuristics, and computes performance metrics (time, nodes explored).

Frontend (The Visualization Interface)

    Framework: React.js (Vite)

    Styling: Tailwind CSS (Modern, responsive design)

    Visualization: D3.js (Data-Driven Documents) for rendering the grid and animating the search path.

    Role: Provides an interactive dashboard for users to configure experiments, view real-time animations of the search process, and analyze comparative data.

3. Heuristic Functions Implemented

    Manhattan Distance (

            
    L1L1​

          

    Norm):

        Logic: Calculates distance assuming movement is restricted to a grid (up, down, left, right).

        Best For: Grid-based maps where diagonal movement is not allowed.

    Euclidean Distance (

            
    L2L2​

          

    Norm):

        Logic: Calculates the straight-line distance "as the crow flies" using the Pythagorean theorem.

        Best For: Open terrain or when diagonal movement is allowed.

    Custom Heuristic (The Novel Contribution):

        Logic: A hybrid approach that combines Manhattan distance with an "Obstacle Lookahead." It checks the direct line of sight to the goal and adds a penalty score if walls are detected in that path.

        Goal: To make the AI "smarter" by avoiding dead-ends before entering them.

4. Installation & Setup Guide
Prerequisites

    Python 3.x

    Node.js & npm

Step 1: Start the Backend
code Bash

cd backend
python3 -m venv venv
source venv/bin/activate  # (On Windows: venv\Scripts\activate)
pip install -r requirements.txt
python app.py

The server will start at http://localhost:5000
Step 2: Start the Frontend
code Bash

cd frontend
npm install
npm run dev

The application will launch at http://localhost:5173
5. How to Use the Application

    Configure Environment: Use the Control Panel to select Maze Size (10x10 to 25x25) and Obstacle Density.

    Generate Maze: Click "Generate Maze" to create a new random problem instance.

    Select Algorithms: Check the boxes for the heuristics you wish to compare (e.g., Manhattan vs. Custom).

    Set Speed: Adjust the animation speed (0.25x for detailed viewing, 2x for fast results).

    Run Experiment: Click "SOLVE & COMPARE."

    Analyze Results: Watch the animations to see how the algorithms explore. Review the Dashboard below to see the winner based on "Nodes Explored" (Efficiency).

6. Experiment Results & Evaluation

The system tracks three key metrics:

    Nodes Explored: The total number of grid cells the algorithm had to visit. (Lower is Better). This is the primary measure of heuristic efficiency.

    Path Length: The number of steps in the final solution. Since A* is optimal, admissible heuristics should find the same (shortest) path length.

    Time Taken: The raw computational time in seconds.