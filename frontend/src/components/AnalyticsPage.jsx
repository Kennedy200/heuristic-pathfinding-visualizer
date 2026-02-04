import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import styles from '../App.module.css'; // Reusing main styles for consistency

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalyticsPage = ({ results, onBack }) => {
  // Sort by efficiency for the charts
  const sortedResults = [...results].sort((a, b) => a.nodes_explored - b.nodes_explored);
  const labels = sortedResults.map(r => r.heuristic.toUpperCase());
  
  // Data for Pie Chart (Nodes Explored Distribution)
  const pieData = {
    labels: labels,
    datasets: [
      {
        label: 'Nodes Explored',
        data: sortedResults.map(r => r.nodes_explored),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)', // Blue
          'rgba(255, 99, 132, 0.8)', // Red
          'rgba(75, 192, 192, 0.8)', // Green
          'rgba(255, 206, 86, 0.8)', // Yellow
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for Bar Chart (Efficiency Comparison)
  const barData = {
    labels: labels,
    datasets: [
      {
        label: 'Efficiency (Path Length / Nodes Explored)',
        data: sortedResults.map(r => (r.path.length / r.nodes_explored * 100).toFixed(1)),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const winner = sortedResults[0];

  return (
    <div className={styles.app} style={{ height: 'auto', minHeight: '100vh' }}>
      <div className={styles.container}>
        <div className={styles.resultsHeader}>
          <button onClick={onBack} className={styles.backBtn}>← Back to Results</button>
          <h1 className={styles.title} style={{ fontSize: '2rem', margin: 0 }}>📊 Comprehensive Analytics</h1>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', marginTop: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          
          {/* Executive Summary */}
          <div style={{ marginBottom: '3rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '10px', borderLeft: '5px solid #3b82f6' }}>
            <h2 style={{ color: '#1e293b', marginTop: 0 }}>🧪 Executive Summary</h2>
            <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.6' }}>
              The <strong>{winner.heuristic.toUpperCase()}</strong> heuristic demonstrated superior performance in this environment. 
              It explored <strong>{winner.nodes_explored}</strong> nodes to find a path of length <strong>{winner.path.length}</strong>.
              This represents a computational efficiency score of <strong>{((winner.path.length / winner.nodes_explored) * 100).toFixed(1)}%</strong>.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
            
            {/* Pie Chart Section */}
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#64748b', marginBottom: '1rem' }}>Search Space Distribution</h3>
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                <Pie data={pieData} />
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '1rem' }}>
                Shows the total volume of computations performed by each algorithm. Smaller slices indicate better optimization.
              </p>
            </div>

            {/* Bar Chart Section */}
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#64748b', marginBottom: '1rem' }}>Algorithmic Efficiency (%)</h3>
              <div style={{ height: '300px' }}>
                <Bar options={{ responsive: true, maintainAspectRatio: false }} data={barData} />
              </div>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '1rem' }}>
                Higher bars indicate the algorithm spent less time "wandering" and more time moving directly toward the goal.
              </p>
            </div>

          </div>

          {/* Detailed Data Table */}
          <h3 style={{ color: '#64748b', marginTop: '4rem', marginBottom: '1rem' }}>Detailed Metrics Table</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', color: '#475569' }}>
                  <th style={{ padding: '1rem' }}>Algorithm</th>
                  <th style={{ padding: '1rem' }}>Nodes Explored</th>
                  <th style={{ padding: '1rem' }}>Path Length</th>
                  <th style={{ padding: '1rem' }}>Time (s)</th>
                  <th style={{ padding: '1rem' }}>Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((r, idx) => (
                  <tr key={r.heuristic} style={{ borderBottom: '1px solid #e2e8f0', background: idx === 0 ? '#f0fdf4' : 'white' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                      {r.heuristic.toUpperCase()} {idx === 0 && '🏆'}
                    </td>
                    <td style={{ padding: '1rem' }}>{r.nodes_explored}</td>
                    <td style={{ padding: '1rem' }}>{r.path.length}</td>
                    <td style={{ padding: '1rem' }}>{r.time_taken.toFixed(5)}</td>
                    <td style={{ padding: '1rem' }}>{((r.path.length / r.nodes_explored) * 100).toFixed(1)}%</td>
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