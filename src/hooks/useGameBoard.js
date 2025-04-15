import { useState, useCallback } from 'react';
import { findValidMoves, isValidPosition } from '../utils/gameUtils';

/**
 * Hook for handling the game board state and interactions
 */
const useGameBoard = () => {
  // Game board state
  const [board, setBoard] = useState([]);
  const [originalBoard, setOriginalBoard] = useState([]);
  const [selectedPeg, setSelectedPeg] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [pegCount, setPegCount] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);

  // Animation state
  const [animatingPeg, setAnimatingPeg] = useState(null);
  const [capturedPeg, setCapturedPeg] = useState(null);
  const [showParticles, setShowParticles] = useState(false);
  const [particlePosition, setParticlePosition] = useState({ x: 0, y: 0 });
  
  // Initialize board with given configuration
  const initBoard = useCallback((config) => {
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
    setMoveHistory([]);
    
    // Reset any animation states
    setAnimatingPeg(null);
    setCapturedPeg(null);
    setShowParticles(false);
    
    return newBoard;
  }, []);

  // Reset the board to its original state
  const resetBoard = useCallback(() => {
    if (originalBoard.length === 0) return;
    
    setBoard(originalBoard.map(row => [...row]));
    
    // Count pegs in original board
    let pegs = 0;
    originalBoard.forEach(row => {
      row.forEach(cell => {
        if (cell === 1) pegs++;
      });
    });
    
    // Reset all game state values
    setPegCount(pegs);
    setMoveCount(0);
    setSelectedPeg(null);
    setValidMoves([]);
    setMoveHistory([]);
    
    // Reset animation states
    setAnimatingPeg(null);
    setCapturedPeg(null);
    setShowParticles(false);
    
    return true; // Return true to indicate success
  }, [originalBoard]);

  // Select a peg and find valid moves
  const selectPeg = useCallback((row, col) => {
    setSelectedPeg([row, col]);
    setValidMoves(findValidMoves(row, col, board));
  }, [board]);

  // Handle cell click for game logic
  const handleCellClick = useCallback((row, col, boardRef, boardDimensions, makeMove) => {
    // Ignore clicks if animation is in progress
    if (animatingPeg) return;
    
    const cellValue = board[row][col];
    
    // If a peg is already selected
    if (selectedPeg) {
      const [selectedRow, selectedCol] = selectedPeg;
      
      // Check if this is a valid move
      const isValid = validMoves.some(move => 
        move[0] === row && move[1] === col
      );
      
      // If clicking on the already selected peg, deselect it
      if (row === selectedRow && col === selectedCol) {
        setSelectedPeg(null);
        setValidMoves([]);
        return;
      }
      
      if (isValid) {
        // Make the move with animation
        makeMove(selectedRow, selectedCol, row, col, boardRef, boardDimensions);
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
  }, [board, selectedPeg, validMoves, animatingPeg, selectPeg]);

  // Make a move on the board with animation
  const makeMove = useCallback((fromRow, fromCol, toRow, toCol, boardRef, boardDimensions) => {
    // Calculate middle (jumped) position
    const middleRow = (fromRow + toRow) / 2;
    const middleCol = (fromCol + toCol) / 2;
    
    // Start animation
    setAnimatingPeg({ from: [fromRow, fromCol], to: [toRow, toCol] });
    setCapturedPeg([middleRow, middleCol]);
    
    // Find the position of the captured peg for particles
    if (boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect();
      const { cellSize } = boardDimensions;
      
      // Calculate absolute position in the DOM
      const cellWidth = boardRect.width / board[0].length;
      const cellHeight = boardRect.height / board.length;
      
      // Get the center of the captured peg
      const x = boardRect.left + middleCol * cellWidth + cellWidth/2;
      const y = boardRect.top + middleRow * cellHeight + cellHeight/2;
      
      setParticlePosition({ x, y });
    }
    
    // After a delay, show particles and update the board
    setTimeout(() => {
      // Show the particles effect
      setShowParticles(true);
      
      // Update the board state
      const newBoard = [...board.map(row => [...row])];
      newBoard[fromRow][fromCol] = 0;       // Remove source peg
      newBoard[middleRow][middleCol] = 0;   // Remove jumped peg
      newBoard[toRow][toCol] = 1;           // Add peg at destination
      
      // Update game state
      setBoard(newBoard);
      setPegCount(prevCount => prevCount - 1);
      setMoveCount(prevCount => prevCount + 1);
      setSelectedPeg(null);
      setValidMoves([]);
      
      // Add move to history
      setMoveHistory(prevHistory => [...prevHistory, {
        from: [fromRow, fromCol],
        to: [toRow, toCol],
        jumped: [middleRow, middleCol]
      }]);
      
      // After a short delay, clean up animation states
      setTimeout(() => {
        setAnimatingPeg(null);
        setCapturedPeg(null);
        setShowParticles(false);
      }, 300);
      
    }, 200); // Delay before updating the board
    
    return true;
  }, [board]);

  // Handle undo move action
  const handleUndo = useCallback(() => {
    if (moveHistory.length === 0 || animatingPeg) return false;
    
    const lastMove = moveHistory[moveHistory.length - 1];
    const { from, to, jumped } = lastMove;
    
    const newBoard = [...board.map(row => [...row])];
    newBoard[from[0]][from[1]] = 1;
    newBoard[jumped[0]][jumped[1]] = 1;
    newBoard[to[0]][to[1]] = 0;
    
    setBoard(newBoard);
    setPegCount(prevCount => prevCount + 1);
    setMoveCount(prevCount => prevCount - 1);
    setMoveHistory(prevHistory => prevHistory.slice(0, -1));
    setSelectedPeg(null);
    setValidMoves([]);
    
    return true;
  }, [board, moveHistory, animatingPeg]);

  // Check if the game is won
  const isGameWon = useCallback(() => {
    return pegCount === 1;
  }, [pegCount]);

  // Check if there are any moves left
  const hasMovesLeft = useCallback(() => {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] === 1 && findValidMoves(r, c, board).length > 0) {
          return true;
        }
      }
    }
    return false;
  }, [board]);

  return {
    board,
    pegCount,
    moveCount,
    selectedPeg,
    validMoves,
    animatingPeg,
    capturedPeg,
    showParticles,
    particlePosition,
    setParticlePosition,
    setShowParticles,
    initBoard,
    resetBoard,
    selectPeg,
    setSelectedPeg,   // Export for hint system
    setValidMoves,    // Export for hint system
    handleCellClick,
    makeMove,
    handleUndo,
    isGameWon,
    hasMovesLeft
  };
};

export default useGameBoard;