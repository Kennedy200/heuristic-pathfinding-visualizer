# algorithms.py
import heapq
import time

class Node:
    def __init__(self, position, g_score=0, h_score=0, parent=None):
        self.position = position
        self.g_score = g_score
        self.h_score = h_score
        self.f_score = g_score + h_score
        self.parent = parent

    def __lt__(self, other):
        return self.f_score < other.f_score

def reconstruct_path(node):
    path = []
    current = node
    while current is not None:
        path.append(list(current.position))
        current = current.parent
    return path[::-1]

def a_star_search(grid, start, goal, heuristic_func, allow_diagonal=False):
    start_time = time.time()
    rows = len(grid)
    cols = len(grid[0])
    
    start_tuple = tuple(start)
    goal_tuple = tuple(goal)
    
    start_node = Node(start_tuple, 0, heuristic_func(start_tuple, goal_tuple))
    open_list = [start_node]
    heapq.heapify(open_list)
    
    closed_set = set()
    explored_order = [] 
    
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    if allow_diagonal:
        directions += [(-1, -1), (-1, 1), (1, -1), (1, 1)]
        
    g_scores = {start_tuple: 0}

    while open_list:
        current = heapq.heappop(open_list)
        current_pos = current.position
        
        if current_pos in closed_set:
            continue
            
        closed_set.add(current_pos)
        explored_order.append(list(current_pos)) 
        
        if current_pos == goal_tuple:
            path = reconstruct_path(current)
            elapsed = time.time() - start_time
            return {
                'success': True,
                'path': path,
                'explored': explored_order,
                'nodes_explored': len(explored_order),
                'path_length': len(path),
                'time_taken': elapsed
            }
            
        for dr, dc in directions:
            nr, nc = current_pos[0] + dr, current_pos[1] + dc
            neighbor_pos = (nr, nc)
            
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 0:
                if neighbor_pos in closed_set:
                    continue
                    
                move_cost = 1.414 if (dr != 0 and dc != 0) else 1
                tentative_g = current.g_score + move_cost
                
                if neighbor_pos not in g_scores or tentative_g < g_scores[neighbor_pos]:
                    g_scores[neighbor_pos] = tentative_g
                    
                    if heuristic_func.__name__ == 'custom_heuristic':
                         h = heuristic_func(neighbor_pos, goal_tuple, None) 
                    else:
                        h = heuristic_func(neighbor_pos, goal_tuple)
                        
                    neighbor = Node(neighbor_pos, tentative_g, h, current)
                    heapq.heappush(open_list, neighbor)
                    
    elapsed = time.time() - start_time
    return {
        'success': False,
        'path': [],
        'explored': explored_order,
        'nodes_explored': len(explored_order),
        'path_length': 0,
        'time_taken': elapsed
    }