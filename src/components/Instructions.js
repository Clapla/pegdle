import React, { memo } from 'react';

/**
 * Game instructions component
 */
const Instructions = memo(() => {
  return (
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
  );
});

export default Instructions;