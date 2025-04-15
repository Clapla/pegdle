import React, { memo, useCallback } from 'react';

/**
 * A cell in the game board which can contain a peg or be empty
 */
const Cell = memo(({
  value,
  row,
  col,
  isSelected,
  isValidMove,
  isAnimating,
  isBeingCaptured,
  isCelebrating,
  onCellClick,
  onDrop,
  boardDimensions
}) => {
  // Prevent default to allow drop
  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle drag start with an invisible drag image
  const handleDragStart = useCallback((event) => {
    // Only allow dragging pegs
    if (value !== 1) {
      event.preventDefault();
      return false;
    }
    
    // Try to hide the ghost image
    try {
      const img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      event.dataTransfer.setDragImage(img, 0, 0);
    } catch (err) {
      console.error("Error setting drag image:", err);
    }
    
    // Set the drag data - do this first to ensure it's set
    event.dataTransfer.setData('text/plain', `${row},${col}`);
    
    // Set the effect after setting the data
    event.dataTransfer.effectAllowed = 'move';
    
    // We need to also trigger the cell click to show valid moves
    onCellClick();
  }, [value, row, col, onCellClick]);
  
  // Handle drag end (cleanup)
  const handleDragEnd = useCallback(() => {
    // Just cleanup in case
  }, []);
  
  // Render based on the cell value (peg or empty)
  if (value === -1) return null; // Not part of board
  
  if (value === 0) {
    // Empty hole
    return (
      <div 
        className={`hole ${isValidMove ? 'valid-move' : ''}`}
        onClick={onCellClick}
        onDragOver={handleDragOver}
        onDrop={onDrop}
        data-row={row}
        data-col={col}
      />
    );
  } else {
    // Hole with peg
    return (
      <div 
        className={`hole ${isSelected ? 'active' : ''}`}
        onClick={onCellClick}
        data-row={row}
        data-col={col}
      >
        <div 
          className={`peg 
            ${isCelebrating ? 'celebrate' : ''} 
            ${isBeingCaptured ? 'capturing' : ''} 
            ${isAnimating ? 'animating' : ''}`
          }
          draggable="true"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={(e) => e.stopPropagation()}
          data-row={row}
          data-col={col}
        />
      </div>
    );
  }
});

export default Cell;