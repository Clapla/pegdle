import React, { memo } from 'react';

/**
 * Modal displayed when the game is over with no more moves
 */
const GameOverModal = memo(({
  show,
  pegCount,
  onNewGame,
  onTryAgain
}) => {
  if (!show) return null;
  
  return (
    <div className="modal">
      <div className="modal-content game-over">
        <h2>Game Over</h2>
        <p>No more moves available. You have {pegCount} pegs left.</p>
        <div className="modal-buttons">
          <button className="control-btn" onClick={onNewGame}>
            New Game
          </button>
          <button className="control-btn" onClick={onTryAgain}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
});

export default GameOverModal;