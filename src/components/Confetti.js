import React, { memo } from 'react';

/**
 * Renders confetti effects for victory celebration
 */
const Confetti = memo(() => {
  // Create an array for confetti pieces
  const confetti = [];
  
  // Color palette for confetti pieces
  const colors = ['#f39c12', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c'];
  
  // Create 50 confetti pieces
  for (let i = 0; i < 50; i++) {
    const left = Math.random() * 100; // Spread across screen width
    const delay = Math.random() * 2; // Staggered start
    const duration = 2 + Math.random() * 2; // Random duration
    const size = Math.random() * 10 + 5; // Random size
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isSquare = Math.random() > 0.5; // Mix of shapes
    const rotation = Math.random() * 360; // Random rotation
    
    confetti.push(
      <div 
        key={i}
        style={{
          position: 'fixed',
          left: `${left}%`,
          top: '-5%',
          width: `${size}px`,
          height: isSquare ? `${size}px` : `${size * 0.4}px`,
          backgroundColor: color,
          borderRadius: isSquare ? '2px' : '0',
          transform: `rotate(${rotation}deg)`,
          opacity: 0.8,
          zIndex: 2000,
          animationName: 'confetti-fall, confetti-shake',
          animationDuration: `${duration}s, ${duration * 0.5}s`,
          animationTimingFunction: 'ease-in, ease-in-out',
          animationIterationCount: '1, infinite',
          animationDirection: 'normal, alternate',
          animationDelay: `${delay}s`
        }}
      />
    );
  }
  
  return <>{confetti}</>;
});

export default Confetti;