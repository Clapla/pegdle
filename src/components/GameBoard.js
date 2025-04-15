import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import Cell from './Cell';
import Particles from './Particles';
import Confetti from './Confetti';

/**
 * The game board component that renders the peg solitaire board
 */
const GameBoard = memo(({
  board,
  selectedPeg,
  validMoves,
  animatingPeg,
  capturedPeg,
  showParticles,
  particlePosition,
  showConfetti,
  handleCellClick,
  handleDrop,
  handleDragOver
}) => {
  const boardRef = useRef(null);
  const [boardDimensions, setBoardDimensions] = useState({ cellSize: 40 });
  
  // Update board dimensions on resize or board changes
  useEffect(() => {
    if (!boardRef.current || !board.length) return;
    
    const updateBoardDimensions = () => {
      const rows = board.length;
      const cols = board[0].length;
      
      const boardRect = boardRef.current.getBoundingClientRect();
      
      // Avoid division by zero
      if (boardRect.width === 0 || boardRect.height === 0 || rows === 0 || cols === 0) return;
      
      const cellSize = Math.min(
        boardRect.width / cols,
        boardRect.height / rows
      );
      
      if (cellSize > 0) {
        setBoardDimensions({
          cellSize: cellSize
        });
      }
    };
    
    updateBoardDimensions();
    
    // Add resize listener
    const resizeHandler = () => {
      requestAnimationFrame(updateBoardDimensions);
    };
    window.addEventListener('resize', resizeHandler);
    
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [board]);
  
  // Get board CSS grid template based on board dimensions
  const getBoardStyle = useCallback(() => {
    if (!board.length) return {};
    
    return {
      display: 'grid',
      gridTemplateRows: `repeat(${board.length}, ${boardDimensions.cellSize}px)`,
      gridTemplateColumns: `repeat(${board[0].length}, ${boardDimensions.cellSize}px)`,
      position: 'relative',
      margin: '20px auto'
    };
  }, [board, boardDimensions.cellSize]);
  
  // Only rerender the board when necessary props change
  return (
    <div className="board-container">
      <div 
        className="game-board" 
        ref={boardRef} 
        style={getBoardStyle()}
        onDragOver={handleDragOver}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              row={rowIndex}
              col={colIndex}
              isSelected={selectedPeg && selectedPeg[0] === rowIndex && selectedPeg[1] === colIndex}
              isValidMove={validMoves.some(move => move[0] === rowIndex && move[1] === colIndex)}
              isAnimating={animatingPeg && animatingPeg.from[0] === rowIndex && animatingPeg.from[1] === colIndex}
              isBeingCaptured={capturedPeg && capturedPeg[0] === rowIndex && capturedPeg[1] === colIndex}
              isCelebrating={board[rowIndex][colIndex] === 1 && validMoves.length === 0 && board.flat().filter(cell => cell === 1).length === 1}
              onCellClick={() => handleCellClick(rowIndex, colIndex, boardRef, boardDimensions)}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
              boardDimensions={boardDimensions}
            />
          ))
        ))}
      </div>
      {showParticles && <Particles position={particlePosition} />}
      {showConfetti && <Confetti />}
    </div>
  );
});

export default GameBoard;