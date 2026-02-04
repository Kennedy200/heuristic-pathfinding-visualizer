import React, { useState } from 'react';
import styles from './App.module.css';
import ControlPanel from './components/ControlPanel';
import MazeGrid from './components/MazeGrid';
import WinnerModal from './components/WinnerModal';
import AnalyticsPage from './components/AnalyticsPage';
import { generateRandomMaze } from './utils/mazeGenerator';
import { api } from './utils/api';

function App() {
  const [page, setPage] = useState('home'); // 'home', 'results', 'analytics'
  const [mazeSize, setMazeSize] = useState(15);
  const [obstacleDensity, setObstacleDensity] = useState(0.3);
  const [animationSpeed, setAnimationSpeed] = useState(0.25);
  const [mazeData, setMazeData] = useState(null);
  const [selectedHeuristics, setSelectedHeuristics] = useState(['manhattan', 'euclidean', 'custom']);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGenerateMaze = () => {
    const newMaze = generateRandomMaze(mazeSize, mazeSize, obstacleDensity);
    setMazeData(newMaze);
    setResults([]);
    setShowModal(false);
  };

  const handleHeuristicChange = (id) => {
    setSelectedHeuristics(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const handleSolve = async () => {
    if (!mazeData || selectedHeuristics.length === 0) return;
    setIsLoading(true);
    setResults([]);
    setShowModal(false);
    
    try {
      const response = await api.compareHeuristics(
        mazeData.grid, mazeData.start, mazeData.goal, selectedHeuristics
      );

      let rawResults = response.results;
      let calculatedWinner = rawResults[0];
      
      // Determine Winner
      rawResults.forEach(res => {
        if (res.nodes_explored < calculatedWinner.nodes_explored) {
          calculatedWinner = res;
        } else if (res.nodes_explored === calculatedWinner.nodes_explored) {
          if (res.heuristic.toLowerCase() === 'custom') calculatedWinner = res;
        }
      });

      // Sort Winner to Top Left
      const sortedResults = [...rawResults].sort((a, b) => {
        if (a.heuristic === calculatedWinner.heuristic) return -1;
        if (b.heuristic === calculatedWinner.heuristic) return 1;
        return a.nodes_explored - b.nodes_explored;
      });

      setResults(sortedResults);
      setPage('results');

    } catch (err) {
      console.error(err);
      alert('Backend error — make sure Flask is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const winner = results.length > 0 ? results[0] : null;

  const handleWinnerFinished = () => {
    // This is called by MazeGrid when it finishes Phase 2
    // We add a tiny delay just for visual breathing room
    setTimeout(() => {
        setShowModal(true);
    }, 500);
  };

  if (page === 'analytics') {
    return <AnalyticsPage results={results} onBack={() => setPage('results')} />;
  }

  if (page === 'home') {
    return (
      <div className={styles.app}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>🧠 Heuristic Pathfinding Visualizer</h1>
            <p className={styles.subtitle}>Watch A* algorithms race through a maze using different heuristic functions</p>
          </div>
          <ControlPanel
            onGenerateMaze={handleGenerateMaze}
            onSolve={handleSolve}
            selectedHeuristics={selectedHeuristics}
            onHeuristicChange={handleHeuristicChange}
            mazeSize={mazeSize}
            onMazeSizeChange={setMazeSize}
            obstacleDensity={obstacleDensity}
            onObstacleDensityChange={setObstacleDensity}
            animationSpeed={animationSpeed}
            onAnimationSpeedChange={setAnimationSpeed}
            isLoading={isLoading}
            hasMaze={!!mazeData}
          />
          {mazeData && (
            <div className={styles.previewSection}>
              <h2 className={styles.previewTitle}>🗺️ Your Maze — Ready to Solve!</h2>
              <div className={styles.previewMaze}>
                <MazeGrid
                  grid={mazeData.grid}
                  start={mazeData.start}
                  goal={mazeData.goal}
                  path={[]}
                  exploredCells={[]}
                  heuristicName="Preview"
                />
              </div>
            </div>
          )}
          {!mazeData && (
            <div className={styles.welcomeCard}>
              <h2 className={styles.welcomeTitle}>👋 How It Works</h2>
              <div className={styles.steps}>
                <div className={styles.step}><div className={styles.stepNum}>1</div><div className={styles.stepText}>Pick a maze size and animation speed</div></div>
                <div className={styles.step}><div className={styles.stepNum}>2</div><div className={styles.stepText}>Click <strong>Generate Maze</strong> to carve a new maze</div></div>
                <div className={styles.step}><div className={styles.stepNum}>3</div><div className={styles.stepText}>Choose 1–4 heuristics to compare</div></div>
                <div className={styles.step}><div className={styles.stepNum}>4</div><div className={styles.stepText}>Hit <strong>SOLVE & COMPARE</strong> and watch them race!</div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {showModal && winner && (
        <WinnerModal 
          winner={winner} 
          onClose={() => setShowModal(false)} 
          onGoToAnalytics={() => setPage('analytics')}
        />
      )}
      <div className={styles.resultsContainer}>
        <div className={styles.resultsHeader}>
          <button onClick={() => setPage('home')} className={styles.backBtn}>← Back</button>
          <div className={styles.resultsHeaderText}><h1 className={styles.resultsTitle}>📊 Results</h1></div>
          <button onClick={() => { setPage('home'); setResults([]); }} className={styles.newBtn}>🎲 New Maze</button>
        </div>
        <div className={styles.resultsGrid}>
          {results.map((result, i) => (
            <MazeGrid
              key={result.heuristic}
              grid={mazeData.grid}
              start={mazeData.start}
              goal={mazeData.goal}
              path={result.path || []}
              exploredCells={result.explored || []} 
              heuristicName={result.heuristic}
              stats={result}
              animationSpeed={animationSpeed}
              isWinner={winner && result.heuristic === winner.heuristic}
              // ONLY the winner's card is allowed to trigger the modal
              onAnimationComplete={winner && result.heuristic === winner.heuristic ? handleWinnerFinished : null}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;