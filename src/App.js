import React, { useEffect, useRef, useCallback } from 'react';
import { boardConfigs } from './utils/boardConfigs';
import { formatTime, findBestHintMove } from './utils/gameUtils';
import './App.css';

// Components
import GameBoard from './components/GameBoard';
import GameHeader from './components/GameHeader';
import GameControls from './components/GameControls';
import HighScore from './components/HighScore';
import Instructions from './components/Instructions';
import VictoryModal from './components/modals/VictoryModal';
import GameOverModal from './components/modals/GameOverModal';
import Confetti from './components/Confetti';

// Hooks
import useGameBoard from './hooks/useGameBoard';
import useGameState from './hooks/useGameState';
import useDailyChallenge from './hooks/useDailyChallenge';

// Styles
import { GameStyles } from './styles/GameStyles';

function PegSolitaire() {
  // Initialize hooks
  const {
    board, 
    pegCount, 
    moveCount, 
    selectedPeg,
    validMoves,
    animatingPeg,
    capturedPeg,
    showParticles,
    particlePosition,
    initBoard,
    resetBoard,
    handleCellClick,
    makeMove,
    handleUndo,
    isGameWon,
    hasMovesLeft,
    selectPeg,      // Include this explicitly for the hint system
    setSelectedPeg, // Include this for resetting selection after hint
    setValidMoves   // Include this for resetting valid moves after hint
  } = useGameBoard();
  
  const {
    boardType,
    setBoardType,
    difficulty,
    setDifficulty,
    isDailyChallenge,
    setIsDailyChallenge,
    gameOver,
    setGameOver,
    victory,
    setVictory,
    time,
    setTime,
    timerActive,
    setTimerActive,
    showVictory,
    setShowVictory,
    showGameOver,
    setShowGameOver,
    showAbout,
    setShowAbout,
    showDailyChallenge,
    setShowDailyChallenge,
    showHint,
    setShowHint,
    showConfetti,
    setShowConfetti,
    hintsRemaining,
    setHintsRemaining,
    useHint,
    checkGameEnd,
    getCurrentHighScore,
    resetGameStatus
  } = useGameState();
  
  const {
    dailyChallenge,
    generateDailyChallenge,
    getTodaysChallenge
  } = useDailyChallenge();
  
  // Game refs
  const boardRef = useRef(null);
  const invisibleDragImageRef = useRef(null);
  
  // Create invisible drag image once
  useEffect(() => {
    const dragImage = document.createElement('div');
    dragImage.style.opacity = '0';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-500px'; // Off-screen
    dragImage.style.pointerEvents = 'none';
    document.body.appendChild(dragImage);
    invisibleDragImageRef.current = dragImage;
    
    // Cleanup on unmount
    return () => {
      if (invisibleDragImageRef.current) {
        document.body.removeChild(invisibleDragImageRef.current);
      }
    };
  }, []);
  
  // Handle initial game setup
  useEffect(() => {
    // Initialize the game with daily challenge or regular board
    if (isDailyChallenge) {
      // Get today's challenge (or generate it if it doesn't exist)
      const challenge = getTodaysChallenge(difficulty);
      
      // Always show the daily challenge modal on initial load
      setShowDailyChallenge(true);
    } else {
      // For classic game, just initialize the board
      initBoard(boardConfigs[boardType]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on initial mount to set up the game
  
  // Handle changes to game settings
  useEffect(() => {
    // This effect runs when game mode, board type, or difficulty changes
    // but skips the initial mount since that's handled by the previous effect
    
    // Skip if this is called during initial mount
    if (!board.length && isDailyChallenge) return;
    
    if (isDailyChallenge) {
      // Just get the challenge - actual loading happens on button click
      getTodaysChallenge(difficulty);
    } else {
      // For classic game, initialize the board with the current board type
      initBoard(boardConfigs[boardType]);
    }
  }, [isDailyChallenge, boardType, difficulty, board, getTodaysChallenge, initBoard, boardConfigs]);
  
  // Listen for storage changes
  useEffect(() => {
    // This manually checks localStorage since the storage event
    // doesn't fire in the same tab that made the change
    const checkHintCount = () => {
      try {
        const hintCountData = localStorage.getItem('pegSolitaireHintCount');
        if (hintCountData) {
          const hintData = JSON.parse(hintCountData);
          if (hintData && hintData.date === new Date().toDateString()) {
            // Update hints remaining
            setHintsRemaining(Math.max(0, 3 - hintData.count));
          }
        }
      } catch (error) {
        console.error('Error checking hint count:', error);
      }
    };
    
    // Set up an interval to check regularly
    const interval = setInterval(checkHintCount, 1000);
    
    // Do an immediate check
    checkHintCount();
    
    // Cleanup
    return () => clearInterval(interval);
  }, [setHintsRemaining]);

  // Check for game end
  useEffect(() => {
    if (!board.length || gameOver) return;
    
    const won = isGameWon();
    const movesAvailable = hasMovesLeft();
    
    if (won || !movesAvailable) {
      checkGameEnd(pegCount, movesAvailable);
    }
  }, [board, gameOver, pegCount, isGameWon, hasMovesLeft, checkGameEnd]);
  
  // Handle cell click implementation
  const handleCellClickImpl = useCallback((row, col) => {
    // Pass the call to the hook implementation with our board ref
    const boardDimensions = { cellSize: 40 }; // Default dimensions
    handleCellClick(row, col, boardRef, boardDimensions, makeMove);
  }, [handleCellClick, makeMove]);

  // Handle drag operations
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const handleDrop = useCallback((event, targetRow, targetCol) => {
    event.preventDefault();
    
    try {
      const dragData = event.dataTransfer.getData('text/plain');
      const [fromRow, fromCol] = dragData.split(',').map(Number);
      
      // When drop happens on a specific cell
      if (targetRow !== undefined && targetCol !== undefined) {
        // Check if this is a valid move
        const isValid = validMoves.some(move => 
          move[0] === targetRow && move[1] === targetCol
        );
        
        if (isValid) {
          // Make the move
          const boardDimensions = { cellSize: 40 }; // Default dimensions
          makeMove(fromRow, fromCol, targetRow, targetCol, boardRef, boardDimensions);
        }
      }
    } catch (error) {
      console.error("Error during drop:", error);
    }
  }, [validMoves, makeMove]);
  
  // Load daily challenge
  const loadDailyChallenge = useCallback(() => {
    // If no daily challenge exists yet, generate it first
    let challenge = dailyChallenge;
    if (!challenge) {
      challenge = generateDailyChallenge(new Date().toDateString(), difficulty);
    }
    
    setBoardType(challenge.boardType);
    const initializedBoard = initBoard({
      ...boardConfigs[challenge.boardType],
      layout: challenge.initialBoard
    });
    
    resetGameStatus();
    setShowDailyChallenge(false);
  }, [dailyChallenge, generateDailyChallenge, difficulty, initBoard, resetGameStatus, setBoardType, setShowDailyChallenge, boardConfigs]);
  
  // We don't need a separate tracking function - we'll handle this directly
  
  // Show hint with limit for daily challenges
  const showHintMove = useCallback(() => {
    // First clear any existing selection or hint
    setShowHint(false);
    
    // Check if we can use a hint for daily challenge
    if (isDailyChallenge && hintsRemaining <= 0) {
      // No hints remaining for daily challenge
      alert("You've used all your hints for today's challenge!");
      return;
    }
    
    // Find the best move for a hint
    const bestMove = findBestHintMove(board);
    
    if (bestMove) {
      // For daily challenges, update the hint count directly
      if (isDailyChallenge) {
        const today = new Date().toDateString();
        const newCount = hintsRemaining > 0 ? 3 - hintsRemaining + 1 : 3;
        
        // Create the new hint data
        const newHintCount = { 
          date: today, 
          count: newCount
        };
        
        // Directly update local storage
        try {
          localStorage.setItem('pegSolitaireHintCount', JSON.stringify(newHintCount));
          
          // Also update the state directly
          setHintsRemaining(Math.max(0, 3 - newCount));
        } catch (e) {
          console.error('Failed to save hint count:', e);
        }
      }
      
      // First, select the peg to show valid moves
      selectPeg(bestMove.from[0], bestMove.from[1]);
      
      // Then show the hint highlighting
      setShowHint(true);
      
      // Hide hint after 3 seconds but don't deselect the peg
      // This way the user can still see the valid moves but can select a different peg if they want
      setTimeout(() => {
        setShowHint(false);
      }, 3000);
    } else {
      // No valid moves found
      alert("No valid moves available!");
    }
  }, [
    board, 
    isDailyChallenge, 
    hintsRemaining, 
    setShowHint, 
    selectPeg,
    setHintsRemaining
  ]);
  
  // Handle play again after victory/game over
  const handlePlayAgain = useCallback(() => {
    setShowVictory(false);
    setShowGameOver(false);
    setShowConfetti(false);
    
    if (isDailyChallenge) {
      loadDailyChallenge();
    } else {
      resetBoard();
      resetGameStatus();
    }
  }, [isDailyChallenge, loadDailyChallenge, resetBoard, resetGameStatus, setShowConfetti, setShowGameOver, setShowVictory]);
  
  // Handle board type change
  const handleBoardTypeChange = useCallback((newBoardType) => {
    // Clear any hint display or selection
    setShowHint(false);
    setSelectedPeg(null);
    setValidMoves([]);
    
    setBoardType(newBoardType);
    initBoard(boardConfigs[newBoardType]);
    resetGameStatus();
  }, [
    initBoard, 
    setBoardType, 
    resetGameStatus,
    setShowHint,
    setSelectedPeg,
    setValidMoves
  ]);
  
  // Handle difficulty change
  const handleDifficultyChange = useCallback((newDifficulty) => {
    // Clear any hint display or selection
    setShowHint(false);
    setSelectedPeg(null);
    setValidMoves([]);
    
    setDifficulty(newDifficulty);
    // If in daily challenge mode, regenerate the challenge with new difficulty
    if (isDailyChallenge) {
      // Generate the challenge with the new difficulty immediately
      const newChallenge = generateDailyChallenge(new Date().toDateString(), newDifficulty);
      
      // Update the board type to match the new challenge
      if (newChallenge) {
        setBoardType(newChallenge.boardType);
      }
    }
  }, [
    generateDailyChallenge, 
    isDailyChallenge, 
    setDifficulty, 
    setBoardType,
    setShowHint,
    setSelectedPeg,
    setValidMoves
  ]);
  
  // Handle game mode toggle
  const handleGameModeToggle = useCallback((isDaily) => {
    // Clear any hint display or selection
    setShowHint(false);
    setSelectedPeg(null);
    setValidMoves([]);
    
    setIsDailyChallenge(isDaily);
    if (isDaily) {
      generateDailyChallenge(new Date().toDateString(), difficulty);
      setShowDailyChallenge(true);
    } else {
      initBoard(boardConfigs[boardType]);
      resetGameStatus();
    }
  }, [
    boardType,
    difficulty,
    generateDailyChallenge,
    initBoard,
    resetGameStatus,
    setIsDailyChallenge,
    setShowDailyChallenge,
    setShowHint,
    setSelectedPeg,
    setValidMoves
  ]);
  
  return (
    <div className="peg-solitaire-game">
      <GameHeader 
        isDailyChallenge={isDailyChallenge}
        onSelectDailyChallenge={() => handleGameModeToggle(true)}
        onSelectClassicGame={() => handleGameModeToggle(false)}
      />
      
      <div className="game-container">
        <GameBoard
          board={board}
          selectedPeg={selectedPeg}
          validMoves={validMoves}
          animatingPeg={animatingPeg}
          capturedPeg={capturedPeg}
          showParticles={showParticles}
          particlePosition={particlePosition}
          showConfetti={showConfetti}
          handleCellClick={handleCellClickImpl}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
        />
        
        <GameControls 
          moveCount={moveCount}
          pegCount={pegCount}
          time={time}
          difficulty={difficulty}
          boardType={boardType}
          isDailyChallenge={isDailyChallenge}
          moveHistory={[]}
          gameOver={gameOver}
          hintsRemaining={hintsRemaining}
          onReset={() => {
            resetBoard();
            resetGameStatus();
          }}
          onUndo={handleUndo}
          onShowHint={showHintMove}
          onBoardTypeChange={handleBoardTypeChange}
          onShowDailyChallenge={() => setShowDailyChallenge(true)}
        />
      </div>
      
      <HighScore highScore={getCurrentHighScore()} />
      
      <Instructions />
      
      {/* Victory Modal */}
      <VictoryModal
        show={showVictory}
        moveCount={moveCount}
        time={time}
        isDailyChallenge={isDailyChallenge}
        boardType={boardType}
        isHighScore={false}
        onPlayAgain={handlePlayAgain}
      />
      
      {/* Game Over Modal */}
      <GameOverModal
        show={showGameOver}
        pegCount={pegCount}
        onNewGame={handlePlayAgain}
        onTryAgain={() => {
          resetBoard();
          resetGameStatus();
          setShowGameOver(false);
        }}
      />
      
      {/* Daily Challenge Modal */}
      {showDailyChallenge && dailyChallenge && (
        <div className="modal">
          <div className="modal-content daily-challenge">
            <h2>Daily Challenge</h2>
            <p>Today's challenge is on the {dailyChallenge.boardType.charAt(0).toUpperCase() + dailyChallenge.boardType.slice(1)} board.</p>
            
            <div className="difficulty-select">
              <p>Select difficulty level:</p>
              <div className="difficulty-buttons">
                <button 
                  className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange('easy')}
                >
                  Easy ({boardConfigs.easy ? boardConfigs.easy.movesToSolve : 5} moves)
                </button>
                <button 
                  className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange('medium')}
                >
                  Medium ({boardConfigs.medium ? boardConfigs.medium.movesToSolve : 10} moves)
                </button>
                <button 
                  className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange('hard')}
                >
                  Hard ({boardConfigs.hard ? boardConfigs.hard.movesToSolve : 18} moves)
                </button>
              </div>
            </div>
            
            <p>The selected difficulty will affect the number of moves needed to solve the puzzle.</p>
            
            <div className="modal-buttons">
              <button className="control-btn start-btn" onClick={loadDailyChallenge}>
                Start Challenge
              </button>
              <button className="control-btn cancel-btn" onClick={() => {
                setShowDailyChallenge(false);
                setIsDailyChallenge(false);
                initBoard(boardConfigs[boardType]);
              }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* About Modal */}
      {showAbout && (
        <div className="modal">
          <div className="modal-content">
            <h2>About Peg Solitaire</h2>
            <p>Peg Solitaire, also known as Solo Noble, is a classic board game dating back to the 17th century. The first evidence of the game can be traced back to the court of Louis XIV in 1697.</p>
            <p>The traditional game fills the entire board with pegs except for the central hole. The objective is to remove all pegs except for one, which ideally should end up in the center hole.</p>
            <button className="control-btn" onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}
      
      <footer>
        <p>&copy; 2025 Peg Solitaire Game | 
          <a href="#" onClick={(e) => {
            e.preventDefault();
            setShowAbout(true);
          }}> About this Game</a>
        </p>
      </footer>
      
      {/* Include all styles */}
      <style>{GameStyles}</style>
    </div>
  );
}

export default PegSolitaire;