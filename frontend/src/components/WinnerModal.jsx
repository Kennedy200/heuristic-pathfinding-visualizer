import React from 'react';
import styles from './WinnerModal.module.css';

const WinnerModal = ({ winner, onClose, onGoToAnalytics }) => {
  if (!winner) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.trophy}>🏆</div>
          <h2>Search Complete!</h2>
        </div>
        
        <div className={styles.content}>
          <p className={styles.subtitle}>The most efficient algorithm was:</p>
          <h1 className={styles.winnerName}>{winner.heuristic.toUpperCase()}</h1>
          
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.label}>Nodes Explored</span>
              <span className={styles.value}>{winner.nodes_explored}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.label}>Time Taken</span>
              <span className={styles.value}>{winner.time_taken.toFixed(5)}s</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.closeBtn}>
            Close
          </button>
          <button onClick={onGoToAnalytics} className={styles.analyticsBtn}>
            📊 View Full Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;