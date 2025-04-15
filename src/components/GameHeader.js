import React, { memo } from 'react';

/**
 * Game header with title and mode selection
 */
const GameHeader = memo(({
  isDailyChallenge,
  onSelectDailyChallenge,
  onSelectClassicGame
}) => {
  return (
    <>
      <header>
        <h1>Pegdle</h1>
        <p className="subtitle">A daily peg solitaire puzzle</p>
      </header>
      
      <div className="game-modes">
        <button 
          className={`mode-btn ${isDailyChallenge ? 'active' : ''}`} 
          onClick={onSelectDailyChallenge}
        >
          Daily Challenge
        </button>
        <button 
          className={`mode-btn ${!isDailyChallenge ? 'active' : ''}`} 
          onClick={onSelectClassicGame}
        >
          Classic Game
        </button>
      </div>
    </>
  );
});

export default GameHeader;