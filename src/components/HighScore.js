import React, { memo } from 'react';
import { formatTime } from '../utils/gameUtils';

/**
 * High score display component
 */
const HighScore = memo(({ highScore }) => {
  if (!highScore) return null;
  
  return (
    <div className="high-score">
      <div>
        <h3>High Score</h3>
        <p>Moves: {highScore.moves} | Time: {formatTime(highScore.time)}</p>
      </div>
    </div>
  );
});

export default HighScore;