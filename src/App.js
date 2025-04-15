import React, { useState, useEffect, useRef } from 'react';

function PegSolitaire() {
  // Board configurations
  const boardConfigs = {
    english: {
      rows: 7,
      cols: 7,
      layout: [
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1], // 0 represents empty center
        [1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 0, 0]
      ]
    },
    european: {
      rows: 7,
      cols: 7,
      layout: [
        [0, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1], // 0 represents empty center
        [1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 0, 0]
      ]
    },
    triangle: {
      rows: 5,
      cols: 5,
      layout: [
        [0, 0, 0, 0, 1],
        [0, 0, 0, 1, 1],
        [0, 0, 1, 1, 1],
        [0, 1, 1, 1, 1],
        [1, 1, 1, 1, 0] // 0 represents empty corner
      ],
      isTriangle: true
    },
    mini: {
      rows: 5,
      cols: 5,
      layout: [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]
      ]
    }
  };

  // Difficulty levels
  const difficultyLevels = {
    easy: { name: "Easy", movesToSolve: 6, timeLimit: 120 },
    medium: { name: "Medium", movesToSolve: 10, timeLimit: 180 },
    hard: { name: "Hard", movesToSolve: 15, timeLimit: 240 }
  };

  // Sound references
  const moveSound = useRef(null);
  const captureSound = useRef(null);
  const victorySound = useRef(null);
  const gameOverSound = useRef(null);
  const clickSound = useRef(null);

  // Game state
  const [boardType, setBoardType] = useState('english');
  const [isDailyChallenge, setIsDailyChallenge] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [board, setBoard] = useState([]);
  const [originalBoard, setOriginalBoard] = useState([]);
  const [selectedPeg, setSelectedPeg] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [pegCount, setPegCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [showAbout, setShowAbout] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [highScores, setHighScores] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [showHint, setShowHint] = useState(false);
  
  // Animation state
  const [animatingPeg, setAnimatingPeg] = useState(null);
  const [capturedPeg, setCapturedPeg] = useState(null);
  const [draggedPeg, setDraggedPeg] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  
  const timerRef = useRef(null);
  const boardRef = useRef(null);
  
  // Play sound effect
  const playSound = (soundRef) => {
    if (!soundEnabled || !soundRef.current) return;
    
    try {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(err => console.log("Audio play error:", err));
    } catch (error) {
      console.error("Sound play error:", error);
    }
  };
  
  // Load high scores from localStorage
  useEffect(() => {
    const savedScores = localStorage.getItem('pegSolitaireHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
    
    // Check for daily challenge
    checkDailyChallenge();
  }, []);
  
  // Timer functionality
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);
  
  // Initialize board when board type changes or when daily challenge is toggled
  useEffect(() => {
    if (isDailyChallenge && dailyChallenge) {
      loadDailyChallenge();
    } else {
      initBoard(boardType);
    }
  }, [boardType, isDailyChallenge, dailyChallenge]);
  
  // Check daily challenge
  const checkDailyChallenge = () => {
    const today = new Date().toDateString();
    const savedChallenge = localStorage.getItem('pegSolitaireDailyChallenge');
    
    if (savedChallenge) {
      const challenge = JSON.parse(savedChallenge);
      
      if (challenge.date === today) {
        // We already have today's challenge
        setDailyChallenge(challenge);
        
        // If we're in daily challenge mode, load it
        if (isDailyChallenge) {
          loadDailyChallenge();
        }
        return;
      }
    }
    
    // Generate a new daily challenge
    generateDailyChallenge(today);
  };
  
  // Generate a daily challenge
  const generateDailyChallenge = (date) => {
    // Use the date as a seed for pseudo-random generation
    const dateString = date || new Date().toDateString();
    const seed = dateString.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Choose a board type based on the day of the week
    const dayOfWeek = new Date().getDay();
    const boardTypes = Object.keys(boardConfigs);
    const selectedBoardType = boardTypes[dayOfWeek % boardTypes.length];
    
    // Get configuration for selected board
    const config = boardConfigs[selectedBoardType];
    const difficultyLevel = difficultyLevels[difficulty].movesToSolve;
    
    // Create a solved board (just one peg)
    let solvedBoard = [];
    for (let r = 0; r < config.rows; r++) {
      const row = [];
      for (let c = 0; c < (config.cols || config.rows); c++) {
        if (config.isTriangle && c > r) {
          row.push(-1); // Not part of the board
        } else if (r === Math.floor(config.rows/2) && c === Math.floor(config.cols/2)) {
          row.push(1); // Center peg
        } else {
          row.push(0); // Empty
        }
      }
      solvedBoard.push(row);
    }
    
    // Work backwards from the solved state
    let moves = [];
    let currentBoard = solvedBoard;
    
    for (let i = 0; i < difficultyLevel; i++) {
      const possibleUnmoves = findAllPossibleUnmoves(currentBoard);
      
      if (possibleUnmoves.length === 0) break;
      
      // Use the seed to select a consistent "random" move
      const unmoveIndex = (seed + i) % possibleUnmoves.length;
      const unmove = possibleUnmoves[unmoveIndex];
      
      // Apply the unmove
      const newBoard = [...currentBoard.map(row => [...row])];
      newBoard[unmove.from[0]][unmove.from[1]] = 0; // Remove peg
      newBoard[unmove.jumped[0]][unmove.jumped[1]] = 1; // Add jumped peg
      newBoard[unmove.to[0]][unmove.to[1]] = 1; // Add destination peg
      
      currentBoard = newBoard;
      moves.push(unmove);
    }
    
    const challenge = {
      date: dateString,
      boardType: selectedBoardType,
      initialBoard: currentBoard,
      difficulty: difficulty,
      movesToSolve: moves.length,
      solution: moves.reverse() // Reverse to get forward moves
    };
    
    setDailyChallenge(challenge);
    localStorage.setItem('pegSolitaireDailyChallenge', JSON.stringify(challenge));
    
    // If we're in daily challenge mode, load it
    if (isDailyChallenge) {
      loadDailyChallenge();
    }
  };
  
  // Find all possible "unmoves" (reverse moves) for generating puzzles
  const findAllPossibleUnmoves = (currentBoard) => {
    const unmoves = [];
    
    for (let r = 0; r < currentBoard.length; r++) {
      for (let c = 0; c < currentBoard[r].length; c++) {
        if (currentBoard[r][c] === 1) { // For each peg
          // Check all four directions for a possible "unmove"
          const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
          ];
          
          directions.forEach(([dr, dc]) => {
            const jumpedRow = r + dr;
            const jumpedCol = c + dc;
            const toRow = r + 2 * dr;
            const toCol = c + 2 * dc;
            
            // Check if the unmove is valid
            if (isValidPosition(toRow, toCol, currentBoard) && 
                isValidPosition(jumpedRow, jumpedCol, currentBoard) &&
                currentBoard[toRow][toCol] === 0 && 
                currentBoard[jumpedRow][jumpedCol] === 0) {
              unmoves.push({
                from: [r, c],
                jumped: [jumpedRow, jumpedCol],
                to: [toRow, toCol]
              });
            }
          });
        }
      }
    }
    
    return unmoves;
  };
  
  // Load daily challenge
  const loadDailyChallenge = () => {
    if (!dailyChallenge) return;
    
    setBoardType(dailyChallenge.boardType);
    setBoard(dailyChallenge.initialBoard.map(row => [...row]));
    setOriginalBoard(dailyChallenge.initialBoard.map(row => [...row]));
    
    // Count pegs
    let pegs = 0;
    dailyChallenge.initialBoard.forEach(row => {
      row.forEach(cell => {
        if (cell === 1) pegs++;
      });
    });
    
    setPegCount(pegs);
    setMoveCount(0);
    setSelectedPeg(null);
    setValidMoves([]);
    setGameOver(false);
    setVictory(false);
    setMoveHistory([]);
    setShowVictory(false);
    setShowGameOver(false);
    setTime(0);
    setTimerActive(true);
    setShowDailyChallenge(false);
  };
  
  // Initialize the game board
  const initBoard = (type) => {
    const config = boardConfigs[type];
    let newBoard = [];
    let pegCounter = 0;
    
    for (let r = 0; r < config.rows; r++) {
      const row = [];
      for (let c = 0; c < (config.cols || config.rows); c++) {
        // For triangle board, only use cells within the triangle
        if (config.isTriangle && c > r) {
          row.push(-1); // -1 represents not part of the board
        } else {
          const cellValue = config.layout[r][c];
          row.push(cellValue);
          if (cellValue === 1) pegCounter++;
        }
      }
      newBoard.push(row);
    }
    
    setBoard(newBoard);
    setOriginalBoard(newBoard.map(row => [...row]));
    setPegCount(pegCounter);
    setMoveCount(0);
    setSelectedPeg(null);
    setValidMoves([]);
    setGameOver(false);
    setVictory(false);
    setMoveHistory([]);
    setShowVictory(false);
    setShowGameOver(false);
    setTime(0);
    setTimerActive(true);
  };
  
  // Check if position is valid
  const isValidPosition = (row, col, currentBoard = board) => {
    if (row < 0 || row >= currentBoard.length || col < 0 || 
        (currentBoard[0] && col >= currentBoard[0].length)) {
      return false;
    }
    return currentBoard[row][col] !== -1;
  };
  
  // Check for valid moves from a position
  const findValidMoves = (row, col) => {
    const directions = [
      [-2, 0], // Up
      [2, 0],  // Down
      [0, -2], // Left
      [0, 2]   // Right
    ];
    
    const moves = [];
    
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      const middleRow = row + dr/2;
      const middleCol = col + dc/2;
      
      if (isValidPosition(newRow, newCol) && 
          isValidPosition(middleRow, middleCol) &&
          board[newRow][newCol] === 0 && 
          board[middleRow][middleCol] === 1) {
        moves.push([newRow, newCol]);
      }
    });
    
    return moves;
  };
  
  // Find a hint move
  const findHintMove = () => {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === 1) {
          const moves = findValidMoves(r, c);
          if (moves.length > 0) {
            return {
              from: [r, c],
              to: moves[0]
            };
          }
        }
      }
    }
    return null;
  };
  
  // Show hint
  const showHintMove = () => {
    const hint = findHintMove();
    if (hint) {
      setSelectedPeg(hint.from);
      setValidMoves([hint.to]);
      setShowHint(true);
      
      // Hide hint after 2 seconds
      setTimeout(() => {
        setShowHint(false);
        if (!gameOver) {
          setSelectedPeg(null);
          setValidMoves([]);
        }
      }, 2000);
    }
  };
  
  // Handle clicking on a hole
  const handleCellClick = (row, col) => {
    // Ignore clicks if game is over or if animation is in progress
    if (gameOver || animatingPeg) return;
    
    // Play click sound
    playSound(clickSound);
    
    const cellValue = board[row][col];
    
    // If a peg is already selected
    if (selectedPeg) {
      const [selectedRow, selectedCol] = selectedPeg;
      
      // Check if this is a valid move
      const isValid = validMoves.some(move => 
        move[0] === row && move[1] === col
      );
      
      if (isValid) {
        // Make the move with animation
        makeMove(selectedRow, selectedCol, row, col);
      } else {
        // If clicking on another peg, select it
        if (cellValue === 1) {
          selectPeg(row, col);
        } else {
          // Clicking elsewhere deselects current peg
          setSelectedPeg(null);
          setValidMoves([]);
        }
      }
    } else if (cellValue === 1) {
      // Select this peg
      selectPeg(row, col);
    }
  };
  
  // Make a move with animation
  const makeMove = (fromRow, fromCol, toRow, toCol) => {
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    
    // Start animation
    setAnimatingPeg({ from: [fromRow, fromCol], to: [toRow, toCol] });
    setCapturedPeg([middleRow, middleCol]);
    
    // Play move sound
    playSound(moveSound);
    
    // After a short delay, update the board
    setTimeout(() => {
      // Play capture sound
      playSound(captureSound);
      
      // Update the board after animation completes
      const newBoard = [...board.map(row => [...row])];
      newBoard[fromRow][fromCol] = 0;
      newBoard[middleRow][middleCol] = 0;
      newBoard[toRow][toCol] = 1;
      
      // Update state
      setBoard(newBoard);
      setPegCount(pegCount - 1);
      setMoveCount(moveCount + 1);
      setSelectedPeg(null);
      setValidMoves([]);
      
      // Save move to history
      setMoveHistory([...moveHistory, {
        from: [fromRow, fromCol],
        to: [toRow, toCol],
        jumped: [middleRow, middleCol]
      }]);
      
      // Reset animation state
      setAnimatingPeg(null);
      setCapturedPeg(null);
      
      // Check for win/game over
      checkGameEnd(newBoard, pegCount - 1);
    }, 350); // Reduced animation duration for smoother feel
  };
  
  // Select a peg and show valid moves
  const selectPeg = (row, col) => {
    setSelectedPeg([row, col]);
    setValidMoves(findValidMoves(row, col));
  };
  
  // Handle starting drag
  const handleDragStart = (event, row, col) => {
    // Only allow dragging pegs, not empty holes
    if (board[row][col] !== 1 || gameOver || animatingPeg) return;
    
    // Create a custom drag image (invisible)
    const dragImage = document.createElement('div');
    dragImage.style.opacity = '0';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up the drag image after drag starts
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
    // Get board position for more accurate drag tracking
    const boardRect = boardRef.current.getBoundingClientRect();
    
    // Calculate initial position relative to the board
    const initialX = event.clientX - boardRect.left;
    const initialY = event.clientY - boardRect.top;
    
    setDraggedPeg([row, col]);
    setDragPosition({ x: initialX, y: initialY });
    
    // Select the peg to show valid move targets
    selectPeg(row, col);
    
    // Play click sound
    playSound(clickSound);
  };
  
  // Handle drag over
  const handleDragOver = (event) => {
    if (!draggedPeg) return;
    
    event.preventDefault();
    
    // Get board position for accurate tracking
    const boardRect = boardRef.current.getBoundingClientRect();
    
    // Update position with smoother tracking
    requestAnimationFrame(() => {
      setDragPosition({
        x: event.clientX - boardRect.left,
        y: event.clientY - boardRect.top
      });
    });
  };
  
  // Calculate which cell the drag is over
  const getDragOverCell = (x, y) => {
    if (!boardRef.current) return null;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const cellSize = 50; // Hole width + margin
    
    // Convert to board coordinates
    const boardX = x;
    const boardY = y;
    
    // Calculate row and column
    const row = Math.floor(boardY / cellSize);
    const col = Math.floor(boardX / cellSize);
    
    // Validate row and column
    if (row < 0 || row >= board.length || col < 0 || col >= (board[0] ? board[0].length : 0)) {
      return null;
    }
    
    // Check if cell is part of the board
    if (board[row] && board[row][col] === -1) {
      return null;
    }
    
    return [row, col];
  };
  
  // Handle drop
  const handleDrop = (event, targetRow, targetCol) => {
    event.preventDefault();
    
    if (!draggedPeg) return;
    
    // Get the cell being dropped on
    const cell = getDragOverCell(dragPosition.x, dragPosition.y) || [targetRow, targetCol];
    const [row, col] = cell;
    
    // Check if this is a valid move
    const isValid = validMoves.some(move => 
      move[0] === row && move[1] === col
    );
    
    if (isValid) {
      // Make the move
      makeMove(draggedPeg[0], draggedPeg[1], row, col);
    }
    
    // Reset drag state
    setDraggedPeg(null);
  };
  
  // Handle drag end (cleanup)
  const handleDragEnd = () => {
    // Reset drag state if drag ended outside a valid target
    setDraggedPeg(null);
  };
  
  // Undo the last move
  const handleUndo = () => {
    if (moveHistory.length === 0 || animatingPeg) return;
    
    const lastMove = moveHistory[moveHistory.length - 1];
    const { from, to, jumped } = lastMove;
    
    const newBoard = [...board.map(row => [...row])];
    newBoard[from[0]][from[1]] = 1;
    newBoard[jumped[0]][jumped[1]] = 1;
    newBoard[to[0]][to[1]] = 0;
    
    // Play move sound
    playSound(moveSound);
    
    setBoard(newBoard);
    setPegCount(pegCount + 1);
    setMoveCount(moveCount - 1);
    setMoveHistory(moveHistory.slice(0, -1));
    setGameOver(false);
    setVictory(false);
    setShowVictory(false);
    setShowGameOver(false);
    setTimerActive(true);
  };
  
  // Check if the game is over
  const checkGameEnd = (currentBoard, currentPegCount) => {
    // Win condition: only one peg left
    if (currentPegCount === 1) {
      setGameOver(true);
      setVictory(true);
      setShowVictory(true);
      setTimerActive(false);
      
      // Play victory sound
      playSound(victorySound);
      
      // Save high score
      saveHighScore();
      
      return;
    }
    
    // Check if there are any valid moves left
    let movesAvailable = false;
    
    for (let r = 0; r < currentBoard.length; r++) {
      for (let c = 0; c < currentBoard[r].length; c++) {
        if (currentBoard[r][c] === 1) {
          const moves = findValidMoves(r, c);
          if (moves.length > 0) {
            movesAvailable = true;
            break;
          }
        }
      }
      if (movesAvailable) break;
    }
    
    if (!movesAvailable) {
      setGameOver(true);
      setTimerActive(false);
      setShowGameOver(true);
      
      // Play game over sound
      playSound(gameOverSound);
    }
  };
  
  // Save high score
  const saveHighScore = () => {
    const scoreKey = `${boardType}_${difficulty}`;
    const currentScore = {
      moves: moveCount,
      time: time,
      date: new Date().toISOString()
    };
    
    // Only save if it's a better score
    if (!highScores[scoreKey] || 
        (moveCount < highScores[scoreKey].moves) || 
        (moveCount === highScores[scoreKey].moves && time < highScores[scoreKey].time)) {
      
      const newHighScores = {
        ...highScores,
        [scoreKey]: currentScore
      };
      
      setHighScores(newHighScores);
      localStorage.setItem('pegSolitaireHighScores', JSON.stringify(newHighScores));
    }
  };
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Render a cell
  const renderCell = (value, row, col) => {
    if (value === -1) return null; // Not part of board
    
    // Check if this peg is animating
    const isAnimating = animatingPeg && 
                        animatingPeg.from[0] === row && 
                        animatingPeg.from[1] === col;
    
    // Check if this peg is being captured
    const isBeingCaptured = capturedPeg && 
                            capturedPeg[0] === row && 
                            capturedPeg[1] === col;
    
    // Check if this peg is being dragged
    const isBeingDragged = draggedPeg && 
                           draggedPeg[0] === row && 
                           draggedPeg[1] === col;
    
    if (value === 0) {
      // Empty hole
      const isValidMove = validMoves.some(move => move[0] === row && move[1] === col);
      
      return (
        <div 
          className={`hole ${isValidMove ? 'valid-move' : ''}`}
          onClick={() => handleCellClick(row, col)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, row, col)}
          data-row={row}
          data-col={col}
        />
      );
    } else {
      // Hole with peg
      const isSelected = selectedPeg && selectedPeg[0] === row && selectedPeg[1] === col;
      const isHint = showHint && isSelected;
      
      return (
        <div 
          className={`hole ${isSelected ? 'active' : ''} ${isHint ? 'hint' : ''}`}
          onClick={() => handleCellClick(row, col)}
          data-row={row}
          data-col={col}
        >
          <div 
            className={`peg ${victory && pegCount === 1 ? 'celebrate' : ''} 
                      ${isBeingCaptured ? 'capturing' : ''} 
                      ${isAnimating ? 'animating' : ''}
                      ${isBeingDragged ? 'hidden' : ''}`}
            draggable={!animatingPeg}
            onDragStart={(e) => handleDragStart(e, row, col)}
            onDragEnd={handleDragEnd}
          />
        </div>
      );
    }
  };
  
  // Render dragged peg
  const renderDraggedPeg = () => {
    if (!draggedPeg) return null;
    
    return (
      <div 
        className="peg dragged" 
        style={{
          position: 'absolute',
          left: `${dragPosition.x - 15}px`, // Half peg width
          top: `${dragPosition.y - 15}px`,  // Half peg height
          pointerEvents: 'none'
        }}
      />
    );
  };
  
  // Get board CSS grid template based on board type
  const getBoardStyle = () => {
    const config = boardConfigs[boardType];
    return {
      display: 'grid',
      gridTemplateRows: `repeat(${config.rows}, 50px)`,
      gridTemplateColumns: `repeat(${config.cols || config.rows}, 50px)`,
      position: 'relative',
      margin: '20px auto'
    };
  };
  
  // Get current high score
  const getCurrentHighScore = () => {
    const scoreKey = `${boardType}_${difficulty}`;
    return highScores[scoreKey];
  };
  
  return (
    <div className="peg-solitaire-game">
      <header>
        <h1>Peg Solitaire</h1>
        <p className="subtitle">A classic board game of strategy and planning</p>
      </header>
      
      <div className="game-modes">
        <button 
          className={`mode-btn ${isDailyChallenge ? 'active' : ''}`} 
          onClick={() => setIsDailyChallenge(true)}
        >
          Daily Challenge
        </button>
        <button 
          className={`mode-btn ${!isDailyChallenge ? 'active' : ''}`} 
          onClick={() => {
            setIsDailyChallenge(false);
            initBoard(boardType);
          }}
        >
          Classic Game
        </button>
      </div>
      
      <div className="game-container">
        <div className="board-container">
          <div className="game-board" ref={boardRef} style={getBoardStyle()}>
            {board.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`}>
                  {renderCell(cell, rowIndex, colIndex)}
                </div>
              ))
            ))}
            {renderDraggedPeg()}
          </div>
        </div>
        
        <div className="game-info">
          <div className="info-item">
            <p>Moves: <span>{moveCount}</span></p>
            <p>Pegs Left: <span>{pegCount}</span></p>
          </div>
          <div className="info-item">
            <p>Timer: <span>{formatTime(time)}</span></p>
            <p>Difficulty: <span>{difficultyLevels[difficulty].name}</span></p>
          </div>
        </div>
        
        <div className="controls">
          <button onClick={() => initBoard(boardType)}>Reset Game</button>
          <button onClick={handleUndo} disabled={moveHistory.length === 0}>
            Undo Move
          </button>
          <button onClick={showHintMove} disabled={gameOver}>
            Hint
          </button>
          <select 
            value={boardType} 
            onChange={(e) => setBoardType(e.target.value)}
            disabled={isDailyChallenge}
          >
            <option value="english">English Board</option>
            <option value="european">European Board</option>
            <option value="triangle">Triangle Board</option>
            <option value="mini">Mini Board</option>
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isDailyChallenge}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={soundEnabled ? 'sound-on' : 'sound-off'}
          >
            {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
          </button>
        </div>
      </div>
      
      <div className="high-score">
        {getCurrentHighScore() && (
          <div>
            <h3>High Score</h3>
            <p>Moves: {getCurrentHighScore().moves} | Time: {formatTime(getCurrentHighScore().time)}</p>
          </div>
        )}
      </div>
      
      <div className="instructions">
        <h2>How to Play</h2>
        <p>The goal is to remove as many pegs as possible by jumping one peg over another into an empty hole.</p>
        <ol>
          <li>Click on a peg you want to move.</li>
          <li>Click on a highlighted empty hole to jump to it.</li>
          <li>The jumped peg will be removed from the board.</li>
          <li>Continue until no more moves are possible.</li>
          <li>You win if only one peg remains!</li>
        </ol>
      </div>
      
      {/* Victory Modal */}
      {showVictory && (
        <div className="modal">
          <div className="modal-content">
            <h2>Congratulations!</h2>
            <p>You solved the puzzle with {moveCount} moves in {formatTime(time)}!</p>
            {getCurrentHighScore() && moveCount === getCurrentHighScore().moves && time === getCurrentHighScore().time && (
              <p className="new-record">🏆 New High Score! 🏆</p>
            )}
            <button onClick={() => {
              setShowVictory(false);
              initBoard(boardType);
            }}>
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {/* Game Over Modal */}
      {showGameOver && (
        <div className="modal">
          <div className="modal-content game-over">
            <h2>Game Over</h2>
            <p>No more moves available. You have {pegCount} pegs left.</p>
            <div className="modal-buttons">
              <button onClick={() => {
                setShowGameOver(false);
                initBoard(boardType);
              }}>
                New Game
              </button>
              <button onClick={() => {
                setShowGameOver(false);
                // Reset to original board
                setBoard(originalBoard.map(row => [...row]));
                // Count pegs
                let pegs = 0;
                originalBoard.forEach(row => {
                  row.forEach(cell => {
                    if (cell === 1) pegs++;
                  });
                });
                setPegCount(pegs);
                setMoveCount(0);
                setSelectedPeg(null);
                setValidMoves([]);
                setGameOver(false);
                setVictory(false);
                setMoveHistory([]);
                setTime(0);
                setTimerActive(true);
              }}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Daily Challenge Modal */}
      {showDailyChallenge && dailyChallenge && (
        <div className="modal">
          <div className="modal-content">
            <h2>Daily Challenge</h2>
            <p>Today's challenge is a {difficultyLevels[dailyChallenge.difficulty].name} puzzle on the {dailyChallenge.boardType} board.</p>
            <p>Can you solve it in {dailyChallenge.movesToSolve} moves?</p>
            <button onClick={loadDailyChallenge}>
              Start Challenge
            </button>
            <button onClick={() => setShowDailyChallenge(false)}>
              Cancel
            </button>
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
            <button onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}
      
      {/* Sound elements */}
      <audio ref={moveSound} src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" preload="auto"></audio>
      <audio ref={captureSound} src="https://assets.mixkit.co/active_storage/sfx/650/650-preview.mp3" preload="auto"></audio>
      <audio ref={victorySound} src="https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3" preload="auto"></audio>
      <audio ref={gameOverSound} src="https://assets.mixkit.co/active_storage/sfx/217/217-preview.mp3" preload="auto"></audio>
      <audio ref={clickSound} src="https://assets.mixkit.co/active_storage/sfx/688/688-preview.mp3" preload="auto"></audio>
      
      <footer>
        <p>&copy; 2025 Peg Solitaire Game | 
          <a href="#" onClick={(e) => {
            e.preventDefault();
            setShowAbout(true);
          }}> About this Game</a>
        </p>
      </footer>
      
      <style>{`
        .peg-solitaire-game {
          max-width: 800px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        
        header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        
        h1 {
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .subtitle {
          color: #7f8c8d;
          font-style: italic;
        }
        
        .game-modes {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .mode-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          background-color: #95a5a6;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .mode-btn.active {
          background-color: #3498db;
        }
        
        .game-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .board-container {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        
        .hole {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #95a5a6;
          margin: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .hole.active {
          background-color: #3498db;
          box-shadow: 0 0 10px rgba(52, 152, 219, 0.5);
        }
        
        .hole.valid-move {
          background-color: #2ecc71;
          box-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
        }
        
        .hole.hint {
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .peg {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #e74c3c, #c0392b);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        .peg:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .peg.celebrate {
          animation: celebrate 0.5s ease-in-out 3;
        }
        
        @keyframes celebrate {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); background: radial-gradient(circle at 30% 30%, #f1c40f, #f39c12); }
          100% { transform: scale(1); }
        }
        
        .peg.hidden {
          opacity: 0;
        }
        
        .peg.dragged {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #e74c3c, #c0392b);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          z-index: 100;
        }
        
        .peg.capturing {
          animation: capture 0.35s forwards;
        }
        
        @keyframes capture {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0); opacity: 0; }
        }
        
        .peg.animating {
          opacity: 0;
        }
        
        .game-info {
          display: flex;
          justify-content: space-around;
          width: 100%;
          margin: 15px 0;
          font-weight: bold;
        }
        
        .info-item {
          text-align: center;
        }
        
        .controls {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin: 10px 0;
        }
        
        button, select {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          background-color: #2c3e50;
          color: white;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        
        button:hover {
          background-color: #34495e;
        }
        
        button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        select {
          background-color: #7f8c8d;
        }
        
        .sound-on {
          background-color: #27ae60;
        }
        
        .sound-off {
          background-color: #c0392b;
        }
        
        .high-score {
          background-color: #f39c12;
          color: white;
          text-align: center;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        
        .high-score h3 {
          margin: 0;
          margin-bottom: 5px;
        }
        
        .instructions {
          background-color: #ecf0f1;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        
        .instructions h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }
        
        .instructions ol {
          margin-left: 20px;
        }
        
        .instructions li {
          margin: 8px 0;
        }
        
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 500px;
          width: 90%;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .modal-content.game-over {
          border-top: 5px solid #e74c3c;
        }
        
        .modal h2 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        
        .modal p {
          margin-bottom: 20px;
        }
        
        .new-record {
          color: #f39c12;
          font-weight: bold;
          font-size: 1.2em;
        }
        
        .modal-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        
        footer {
          text-align: center;
          margin-top: 20px;
          color: #7f8c8d;
          font-size: 14px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
        
        footer a {
          color: #3498db;
          text-decoration: none;
        }
        
        footer a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 600px) {
          .hole {
            width: 30px;
            height: 30px;
          }
          
          .peg {
            width: 22px;
            height: 22px;
          }
          
          .controls {
            flex-direction: column;
          }
          
          .game-info {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default PegSolitaire;