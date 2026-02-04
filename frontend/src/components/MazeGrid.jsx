import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import styles from './MazeGrid.module.css';

const MazeGrid = ({
  grid,
  start,
  goal,
  path = [],
  exploredCells = [], 
  heuristicName = '',
  stats = null,
  animationSpeed = 0.25,
  isWinner = false,
  onAnimationComplete // <--- NEW PROP
}) => {
  const svgRef = useRef(null);
  const [animatedExplored, setAnimatedExplored] = useState([]);
  const [animatedPath, setAnimatedPath] = useState([]);
  const [goalReached, setGoalReached] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const instanceId = useMemo(() => Math.floor(Math.random() * 10000), []);
  const grassId = `grass-${instanceId}`;
  const wallId = `wall-${instanceId}`;
  const pathId = `path-${instanceId}`;

  const rows = grid ? grid.length : 0;
  const cols = grid && grid[0] ? grid[0].length : 0;
  const cellSize = Math.min(Math.floor(380 / (cols || 1)), Math.floor(380 / (rows || 1)), 30);

  const inArray = (arr, r, c) => {
    if (!arr || arr.length === 0) return false;
    return arr.some(item => item[0] === r && item[1] === c);
  };

  const pathDeps = JSON.stringify(path);
  const exploredDeps = JSON.stringify(exploredCells);

  useEffect(() => {
    const currentPath = JSON.parse(pathDeps);
    const currentExplored = JSON.parse(exploredDeps);

    if (!currentPath || currentPath.length === 0) {
      setAnimatedExplored([]);
      setAnimatedPath([]);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    setAnimatedExplored([]);
    setAnimatedPath([]);
    setGoalReached(false);

    const totalSteps = currentExplored.length + currentPath.length;
    const baseMs = 30; 
    const delay = baseMs / animationSpeed;

    let step = 0;
    const exploreTimer = setInterval(() => {
      if (step < currentExplored.length) {
        const chunkSize = animationSpeed > 1 ? 15 : 3;
        const chunk = currentExplored.slice(step, step + chunkSize);
        setAnimatedExplored(prev => [...prev, ...chunk]);
        step += chunkSize;
        setProgress(step / totalSteps);
      } else {
        clearInterval(exploreTimer);
        
        let pathStep = 0;
        const pathTimer = setInterval(() => {
          if (pathStep < currentPath.length) {
            const point = currentPath[pathStep];
            setAnimatedPath(prev => [...prev, point]);
            pathStep++;
            setProgress((currentExplored.length + pathStep) / totalSteps);
            
            if (goal && point[0] === goal[0] && point[1] === goal[1]) {
              setGoalReached(true);
            }
          } else {
            clearInterval(pathTimer);
            setIsAnimating(false);
            setGoalReached(true);
            // --- CRITICAL: Tell the parent we are done! ---
            if (onAnimationComplete) onAnimationComplete(); 
          }
        }, delay);
      }
    }, delay / 2);

    return () => clearInterval(exploreTimer);
  }, [pathDeps, exploredDeps, animationSpeed, goal]);

  useEffect(() => {
    if (!svgRef.current || !grid || !grid.length) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const W = cols * cellSize;
    const H = rows * cellSize;
    svg.attr('width', W).attr('height', H);
    const defs = svg.append('defs');

    defs.append('linearGradient').attr('id', grassId).attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1')
        .selectAll('stop').data([{o:'0%', c:'#86efac'}, {o:'100%', c:'#4ade80'}]).enter().append('stop')
        .attr('offset', d => d.o).attr('stop-color', d => d.c);

    defs.append('linearGradient').attr('id', wallId).attr('x1','0').attr('y1','0').attr('x2','0').attr('y2','1')
        .selectAll('stop').data([{o:'0%', c:'#166534'}, {o:'100%', c:'#14532d'}]).enter().append('stop')
        .attr('offset', d => d.o).attr('stop-color', d => d.c);

    defs.append('linearGradient').attr('id', pathId).attr('x1','0').attr('y1','0').attr('x2','1').attr('y2','1')
        .selectAll('stop').data([{o:'0%', c:'#f43f5e'}, {o:'100%', c:'#fb7185'}]).enter().append('stop')
        .attr('offset', d => d.o).attr('stop-color', d => d.c);

    svg.append('rect').attr('width', W).attr('height', H).attr('fill', 'none').attr('stroke', '#14532d').attr('stroke-width', 4).attr('rx', 4);
    const cellGroup = svg.append('g');

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isWall = grid[r][c] === 1;
        const isStart = start && r === start[0] && c === start[1];
        const isGoal = goal && r === goal[0] && c === goal[1];
        const isP = inArray(animatedPath, r, c);
        const isE = !isP && inArray(animatedExplored, r, c);
        const g = cellGroup.append('g').attr('transform', `translate(${c * cellSize},${r * cellSize})`);

        if (isWall) {
          g.append('rect').attr('width', cellSize).attr('height', cellSize).attr('fill', `url(#${wallId})`);
        } else {
          g.append('rect').attr('width', cellSize).attr('height', cellSize).attr('fill', `url(#${grassId})`);
          if (isE && !isStart && !isGoal) g.append('rect').attr('width', cellSize).attr('height', cellSize).attr('fill', '#a78bfa').attr('opacity', 0.6).attr('rx', 2);
          if (isP && !isStart && !isGoal) g.append('rect').attr('width', cellSize).attr('height', cellSize).attr('fill', `url(#${pathId})`).attr('rx', 3);
        }

        if (isStart) {
          g.append('rect').attr('width', cellSize-2).attr('height', cellSize-2).attr('x', 1).attr('y', 1).attr('fill', '#3b82f6').attr('rx', 4);
          g.append('text').attr('x', cellSize/2).attr('y', cellSize/2).attr('text-anchor', 'middle').attr('dy', '.35em').attr('fill', 'white').style('font-weight', 'bold').text('S');
        }
        if (isGoal) {
          const gCol = goalReached ? '#00e676' : '#ef4444';
          g.append('rect').attr('width', cellSize-2).attr('height', cellSize-2).attr('x', 1).attr('y', 1).attr('fill', gCol).attr('rx', 4);
          g.append('text').attr('x', cellSize/2).attr('y', cellSize/2).attr('text-anchor', 'middle').attr('dy', '.35em').attr('fill', 'white').style('font-weight', 'bold').text('E');
        }
      }
    }
  }, [animatedExplored.length, animatedPath.length, goalReached, grid, start, goal]);

  return (
    <div className={`${styles.card} ${isWinner ? styles.cardWinner : ''}`}>
      {isWinner && <div className={styles.winnerBanner}>🏆 WINNER</div>}
      <h3 className={styles.cardTitle}>{heuristicName.toUpperCase()}</h3>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress * 100}%` }}></div>
      </div>
      <div className={styles.mazeFrame}><svg ref={svgRef} /></div>
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statBox}><span className={styles.statLabel}>Nodes Explored</span><span className={`${styles.statVal} ${styles.statBlue}`}>{stats.nodes_explored}</span></div>
          <div className={styles.statBox}><span className={styles.statLabel}>Path Length</span><span className={`${styles.statVal} ${styles.statGreen}`}>{stats.path_length}</span></div>
          <div className={styles.statBox}><span className={styles.statLabel}>Time Taken</span><span className={`${styles.statVal} ${styles.statPurple}`}>{(stats.time_taken * 1000).toFixed(2)}ms</span></div>
        </div>
      )}
    </div>
  );
};

export default MazeGrid;