/**
 * Format time display
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string (e.g. "2:05")
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

/**
 * Check if position is valid on the board
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {Array<Array<number>>} currentBoard - Current state of the board
 * @returns {boolean} - Whether the position is valid
 */
export const isValidPosition = (row, col, currentBoard) => {
  if (row < 0 || row >= currentBoard.length || col < 0 || 
      (currentBoard[0] && col >= currentBoard[0].length)) {
    return false;
  }
  return currentBoard[row][col] !== -1;
};

/**
 * Find all possible valid moves for a peg
 * @param {number} row - Row of the peg
 * @param {number} col - Column of the peg
 * @param {Array<Array<number>>} board - Current state of the board
 * @returns {Array<[number, number]>} - Array of valid destination positions
 */
export const findValidMoves = (row, col, board) => {
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
    
    if (isValidPosition(newRow, newCol, board) && 
        isValidPosition(middleRow, middleCol, board) &&
        board[newRow][newCol] === 0 && 
        board[middleRow][middleCol] === 1) {
      moves.push([newRow, newCol]);
    }
  });
  
  return moves;
};

/**
 * Find all possible "unmoves" (reverse moves) for generating puzzles
 * @param {Array<Array<number>>} currentBoard - Current state of the board
 * @returns {Array<Object>} - Array of possible unmoves
 */
export const findAllPossibleUnmoves = (currentBoard) => {
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

/**
 * Find the best hint move for the current board state
 * 
 * Evaluates all possible moves and returns the one that:
 * 1. Leads to the fewest isolated pegs
 * 2. Opens up the most future moves
 * 
 * @param {Array<Array<number>>} board - Current game board
 * @returns {Object|null} - The best move as {from: [row, col], to: [row, col]} or null if no moves
 */
export const findBestHintMove = (board) => {
  // First collect all possible moves
  const allMoves = [];
  
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 1) { // For each peg
        const validMoves = findValidMoves(r, c, board);
        
        validMoves.forEach(([toRow, toCol]) => {
          allMoves.push({
            from: [r, c],
            to: [toRow, toCol],
            jumped: [r + (toRow - r)/2, c + (toCol - c)/2]
          });
        });
      }
    }
  }
  
  if (allMoves.length === 0) return null;
  
  // Evaluate each move to find the best one
  const scoredMoves = allMoves.map(move => {
    // Create a copy of the board with this move applied
    const newBoard = board.map(row => [...row]);
    const { from, to, jumped } = move;
    
    newBoard[from[0]][from[1]] = 0; // Remove source peg
    newBoard[jumped[0]][jumped[1]] = 0; // Remove jumped peg
    newBoard[to[0]][to[1]] = 1; // Add peg at destination
    
    // Count how many pegs can move after this move
    let movablePegsCount = 0;
    let futureMovesCount = 0;
    
    for (let r = 0; r < newBoard.length; r++) {
      for (let c = 0; c < newBoard[r].length; c++) {
        if (newBoard[r][c] === 1) {
          const pegMoves = findValidMoves(r, c, newBoard);
          if (pegMoves.length > 0) {
            movablePegsCount++;
            futureMovesCount += pegMoves.length;
          }
        }
      }
    }
    
    // Calculate a score - higher is better
    const moveScore = movablePegsCount * 10 + futureMovesCount;
    
    return {
      ...move,
      score: moveScore
    };
  });
  
  // Sort by score (descending) and return the best move
  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0];
};