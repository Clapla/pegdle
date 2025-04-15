import React, { memo } from 'react';
import { formatTime } from '../utils/gameUtils';
import { difficultyLevels } from '../utils/boardConfigs';

/**
 * Game controls and info display
 */
const GameControls = memo(({
  moveCount,
  pegCount,
  time,
  difficulty,
  boardType,
  isDailyChallenge,
  moveHistory,
  gameOver,
  hintsRemaining,
  onReset,
  onUndo,
  onShowHint,
  onBoardTypeChange,
  onShowDailyChallenge
}) => {
  return (
    <>
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
        <button onClick={onReset} className="control-btn">Reset Game</button>
        <button onClick={onUndo} disabled={moveHistory.length === 0} className="control-btn">
          Undo Move
        </button>
        <button 
          onClick={onShowHint} 
          disabled={gameOver || (isDailyChallenge && hintsRemaining <= 0)} 
          className="control-btn"
          title={isDailyChallenge ? `${hintsRemaining} hints remaining` : "Unlimited hints available"}
        >
          {isDailyChallenge ? `Hint (${hintsRemaining})` : "Hint"}
        </button>
        
        {/* Only show board selection in Classic mode */}
        {!isDailyChallenge && (
          <select 
            value={boardType} 
            onChange={(e) => onBoardTypeChange(e.target.value)}
            className="control-select"
          >
            <option value="english">English Board</option>
            <option value="european">European Board</option>
            <option value="triangle">Triangle Board</option>
            <option value="mini">Mini Board</option>
          </select>
        )}
      </div>
    </>
  );
});

export default GameControls;