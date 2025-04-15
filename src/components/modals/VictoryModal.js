import React, { memo } from 'react';
import { formatTime } from '../../utils/gameUtils';

/**
 * Modal displayed when player wins the game
 */
const VictoryModal = memo(({
  show,
  moveCount,
  time,
  isDailyChallenge,
  boardType,
  isHighScore,
  onPlayAgain
}) => {
  if (!show) return null;
  
  const shareResult = () => {
    // Create share text
    const today = new Date().toLocaleDateString();
    const shareText = `Pegdle ${today}\nMoves: ${moveCount}\nTime: ${formatTime(time)}\nBoard: ${boardType.charAt(0).toUpperCase() + boardType.slice(1)}`;
    
    // Try to use clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Results copied to clipboard!'))
        .catch(() => alert('Failed to copy results'));
    } else {
      alert('Results sharing not supported in your browser');
    }
  };
  
  return (
    <div className="modal">
      <div className="modal-content victory">
        <h2>🎉 Congratulations! 🎉</h2>
        <p>You solved the puzzle with {moveCount} moves in {formatTime(time)}!</p>
        
        {/* Display daily challenge results as a Wordle-like box */}
        {isDailyChallenge && (
          <div className="daily-results">
            <p>Daily Pegdle {new Date().toLocaleDateString()}</p>
            <div className="results-grid">
              <div className="result-box">{moveCount}</div>
              <div className="result-label">Moves</div>
              
              <div className="result-box">{formatTime(time)}</div>
              <div className="result-label">Time</div>
              
              <div className="result-box">{boardType.charAt(0).toUpperCase() + boardType.slice(1)}</div>
              <div className="result-label">Board</div>
            </div>
            <button className="share-btn" onClick={shareResult}>
              Share Results
            </button>
          </div>
        )}
        
        {isHighScore && (
          <p className="new-record">🏆 New High Score! 🏆</p>
        )}
        
        <button className="play-again-btn" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
    </div>
  );
});

export default VictoryModal;