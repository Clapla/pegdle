import React, { memo } from 'react';

/**
 * Renders particle effects for captured pegs
 */
const Particles = memo(({ position }) => {
  // Create a particle array
  const particles = [];
  
  // Create 6 particles
  for (let i = 0; i < 6; i++) {
    // Simple position offsets for spread
    const xOffset = (Math.random() * 40) - 20; // -20 to +20
    const yOffset = (Math.random() * 40) - 20; // -20 to +20
    const delay = Math.random() * 0.2; // Stagger animation
    const size = Math.random() * 6 + 3; // Random size
    
    particles.push(
      <div 
        key={i}
        className="particle"
        style={{
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: '#f0d080',
          opacity: 0.9,
          top: `calc(${position.y}px + ${yOffset}px)`,
          left: `calc(${position.x}px + ${xOffset}px)`,
          animationName: 'particle-fade',
          animationDuration: '0.5s',
          animationTimingFunction: 'ease-out',
          animationFillMode: 'forwards',
          animationDelay: `${delay}s`,
          zIndex: 100
        }}
      />
    );
  }
  
  return <>{particles}</>;
});

export default Particles;