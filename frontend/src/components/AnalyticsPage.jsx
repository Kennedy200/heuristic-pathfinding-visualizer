import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import styles from '../App.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalyticsPage = ({ results, onBack }) => {
  const [showToast, setShowToast] = useState(false);

  const sortedResults = [...results].sort((a, b) => a.nodes_explored - b.nodes_explored);
  const labels = sortedResults.map(r => r.heuristic.toUpperCase());
  
  // Consistent color palette for both charts
  const heuristicColors = [
    '#6366f1', // CUSTOM (Indigo)
    '#f43f5e', // MANHATTAN (Rose)
    '#10b981', // EUCLIDEAN (Emerald)
    '#fbbf24', // CHEBYSHEV (Amber)
  ];

  const handleDownload = () => {
    // Replace with your actual Render backend URL
    window.location.href = 'https://pathfinding-backend-1wat.onrender.com/download-csv';
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const pieData = {
    labels: labels,
    datasets: [{
      data: sortedResults.map(r => r.nodes_explored),
      backgroundColor: heuristicColors,
      hoverOffset: 20,
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: labels,
    datasets: [{
      label: 'Efficiency %',
      data: sortedResults.map(r => (r.path.length / r.nodes_explored * 100).toFixed(1)),
      // Each bar now gets its own color from the palette
      backgroundColor: heuristicColors.map(color => `${color}CC`), // Adds slight transparency
      borderColor: heuristicColors,
      borderWidth: 2,
      borderRadius: 8,
      hoverBackgroundColor: heuristicColors,
    }],
  };

  const winner = sortedResults[0];

  return (
    <div className={styles.app} style={{ height: 'auto', minHeight: '100vh', position: 'relative' }}>
      
      {showToast && (
        <div className={styles.toast}>
          <span>✅</span> Dataset Downloaded!
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.resultsHeader}>
          <button onClick={onBack} className={styles.backBtn}>← Back</button>
          <button onClick={handleDownload} className={styles.downloadBtn}>📥 Data</button>
        </div>

        <h1 className={styles.analyticsTitle}>📊 Analytics</h1>

        <div className={styles.analyticsContent}>
          {/* Summary Section */}
          <div className={styles.summaryBox}>
            <h2 className={styles.summaryTitle}>🏆 Performance Winner</h2>
            <p className={styles.summaryText}>
              The <strong>{winner.heuristic.toUpperCase()}</strong> heuristic was most efficient, 
              scanning only <strong>{winner.nodes_explored}</strong> nodes with a 
              path efficiency of <strong>{((winner.path.length / winner.nodes_explored) * 100).toFixed(1)}%</strong>.
            </p>
          </div>

          {/* Charts Grid */}
          <div className={styles.chartsGrid}>
            <div className={styles.chartWrapper}>
              <h3>Node Distribution</h3>
              <div className={styles.chartContainer}>
                <Pie 
                  data={pieData} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' }
                    }
                  }} 
                />
              </div>
            </div>

            <div className={styles.chartWrapper}>
              <h3>Efficiency Ratio (%)</h3>
              <div className={styles.chartContainer}>
                <Bar 
                  data={barData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false } // Hide legend as colors match labels
                    },
                    scales: { 
                      y: { 
                        beginAtZero: true, 
                        max: 100,
                        grid: { color: '#f1f5f9' }
                      },
                      x: {
                        grid: { display: false }
                      }
                    } 
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <h3 className={styles.tableHeading}>Detailed Metrics</h3>
          <div className={styles.tableContainer}>
            <table className={styles.analyticsTable}>
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Nodes</th>
                  <th>Path</th>
                  <th>Time</th>
                  <th>Eff.</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((r, idx) => (
                  <tr key={r.heuristic} className={idx === 0 ? styles.winnerRow : ''}>
                    <td className={styles.bold} style={{ color: heuristicColors[idx] }}>
                      {r.heuristic.toUpperCase()}
                    </td>
                    <td>{r.nodes_explored}</td>
                    <td>{r.path.length}</td>
                    <td>{(r.time_taken * 1000).toFixed(1)}ms</td>
                    <td className={styles.effCell}>{((r.path.length / r.nodes_explored) * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;