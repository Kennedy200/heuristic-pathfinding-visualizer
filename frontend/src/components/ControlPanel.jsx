import React from 'react';
import styles from './ControlPanel.module.css';

const ControlPanel = ({
  onGenerateMaze,
  onSolve,
  selectedHeuristics,
  onHeuristicChange,
  mazeSize,
  onMazeSizeChange,
  obstacleDensity,
  onObstacleDensityChange,
  animationSpeed,
  onAnimationSpeedChange,
  isLoading,
  hasMaze
}) => {
  const heuristics = [
    { id: 'manhattan', name: 'Manhattan', icon: '📐' },
    { id: 'euclidean', name: 'Euclidean', icon: '📏' },
    { id: 'chebyshev', name: 'Chebyshev', icon: '🔲' },
    { id: 'octile', name: 'Octile', icon: '⬡' },
    { id: 'custom', name: 'Custom ⭐', icon: '🧠' },
  ];

  const mazeSizes = [
    { value: 11, label: 'Small (11×11)' },
    { value: 15, label: 'Medium (15×15)' },
    { value: 21, label: 'Large (21×21)' },
    { value: 25, label: 'XL (25×25)' }
  ];

  const speeds = [
    { value: 0.1, label: '0.1× Slowest' },
    { value: 0.25, label: '0.25× Slow' },
    { value: 0.5, label: '0.5× Normal' },
    { value: 1, label: '1× Fast' },
    { value: 2, label: '2× Instant' }
  ];

  const densities = [
    { value: 0.2, label: 'Light' },
    { value: 0.3, label: 'Medium' },
    { value: 0.35, label: 'Heavy' }
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.topRow}>
        <div className={styles.settingsBlock}>
          <label className={styles.label}>Maze Size</label>
          <select value={mazeSize} onChange={e => onMazeSizeChange(Number(e.target.value))} className={styles.select} disabled={isLoading}>
            {mazeSizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className={styles.settingsBlock}>
          <label className={styles.label}>Animation Speed</label>
          <select value={animationSpeed} onChange={e => onAnimationSpeedChange(Number(e.target.value))} className={styles.select} disabled={isLoading}>
            {speeds.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className={styles.settingsBlock} style={{ justifyContent: 'flex-end' }}>
          <button onClick={onGenerateMaze} disabled={isLoading} className={styles.generateBtn}>
            🎲 Generate Maze
          </button>
        </div>
      </div>

      <div className={styles.heuristicsRow}>
        <span className={styles.heuristicsLabel}>Choose heuristics:</span>
        <div className={styles.heuristicsGrid}>
          {heuristics.map(h => (
            <label
              key={h.id}
              className={`${styles.hChip} ${selectedHeuristics.includes(h.id) ? styles.hChipActive : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedHeuristics.includes(h.id)}
                onChange={() => onHeuristicChange(h.id)}
                className={styles.hiddenCheck}
                disabled={isLoading}
              />
              <span className={styles.hIcon}>{h.icon}</span>
              <span className={styles.hName}>{h.name}</span>
            </label>
          ))}
        </div>
      </div>

      {selectedHeuristics.length === 0 && (
        <p className={styles.warningRed}>⚠️ Select at least one heuristic</p>
      )}
      {selectedHeuristics.length > 4 && (
        <p className={styles.warningYellow}>⚠️ Max 4 heuristics for best results</p>
      )}

      <div className={styles.solveRow}>
        <button
          onClick={onSolve}
          disabled={isLoading || !hasMaze || selectedHeuristics.length === 0 || selectedHeuristics.length > 4}
          className={styles.solveBtn}
        >
          {isLoading ? (
            <><span className={styles.spinner}></span> Solving...</>
          ) : (
            '🚀 SOLVE & COMPARE'
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;