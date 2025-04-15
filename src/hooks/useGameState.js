import { useState, useCallback, useEffect } from 'react';
import { 
  loadHighScores, 
  saveHighScores, 
  loadDifficulty, 
  saveDifficulty, 
  loadDailyHintCount, 
  saveDailyHintCount 
} from '../utils/storageUtils';

/**
 * Hook for managing overall game state
 */
const useGameState = () => {
  // Game settings
  const [boardType, setBoardType] = useState('english');
  const [difficulty, setDifficulty] = useState(loadDifficulty());
  const [isDailyChallenge, setIsDailyChallenge] = useState(true); // Default to daily challenge
  
  // Game status
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // UI state
  const [showVictory, setShowVictory] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // High scores and hint tracking
  const [highScores, setHighScores] = useState({});
  const [hintCount, setHintCount] = useState({ date: '', count: 0 });
  const [hintsRemaining, setHintsRemaining] = useState(3); // Default 3 hints per day
  
  // Load high scores and hint count
  useEffect(() => {
    setHighScores(loadHighScores());
    
    const dailyHintData = loadDailyHintCount();
    setHintCount(dailyHintData);
    setHintsRemaining(Math.max(0, 3 - dailyHintData.count));
  }, []);
  
  // Timer functionality
  useEffect(() => {
    let timerRef = null;
    
    if (timerActive) {
      timerRef = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef) {
        clearInterval(timerRef);
      }
    };
  }, [timerActive]);
  
  // Handle difficulty changes
  useEffect(() => {
    saveDifficulty(difficulty);
  }, [difficulty]);
  
  // Save high score
  const saveHighScore = useCallback((score) => {
    const scoreKey = `${boardType}_${difficulty}`;
    
    // Only save if it's a better score
    if (!highScores[scoreKey] || 
        (score.moves < highScores[scoreKey].moves) || 
        (score.moves === highScores[scoreKey].moves && score.time < highScores[scoreKey].time)) {
      
      const newHighScores = {
        ...highScores,
        [scoreKey]: score
      };
      
      setHighScores(newHighScores);
      saveHighScores(newHighScores);
      return true;
    }
    
    return false;
  }, [boardType, difficulty, highScores]);
  
  // Check game end state
  const checkGameEnd = useCallback((pegCount, hasMovesLeft) => {
    // Win condition: only one peg left
    if (pegCount === 1) {
      setGameOver(true);
      setVictory(true);
      setTimerActive(false);
      
      // Save high score
      const score = {
        moves: pegCount,
        time: time,
        date: new Date().toISOString()
      };
      saveHighScore(score);
      
      // Show victory celebration
      setShowConfetti(true);
      setTimeout(() => {
        setShowVictory(true);
      }, 1000);
      
      return true;
    }
    
    // Game over if no more moves
    if (!hasMovesLeft) {
      setGameOver(true);
      setTimerActive(false);
      setTimeout(() => {
        setShowGameOver(true);
      }, 500);
      return true;
    }
    
    return false;
  }, [time, saveHighScore]);
  
  // Get current high score
  const getCurrentHighScore = useCallback(() => {
    const scoreKey = `${boardType}_${difficulty}`;
    return highScores[scoreKey];
  }, [boardType, difficulty, highScores]);
  
  // Reset game status
  const resetGameStatus = useCallback(() => {
    setGameOver(false);
    setVictory(false);
    setShowVictory(false);
    setShowGameOver(false);
    setShowConfetti(false);
    setShowHint(false); // Reset hint display
    setTime(0);
    setTimerActive(true);
    
    // Reload the hint count state from localStorage for daily challenge
    // or reset to 3 for classic mode
    if (isDailyChallenge) {
      try {
        const storedHintData = localStorage.getItem('pegSolitaireHintCount');
        if (storedHintData) {
          const parsedData = JSON.parse(storedHintData);
          const today = new Date().toDateString();
          
          if (parsedData.date === today) {
            // Use today's hint count
            setHintCount(parsedData);
            setHintsRemaining(Math.max(0, 3 - parsedData.count));
          } else {
            // Reset for a new day
            setHintCount({ date: today, count: 0 });
            setHintsRemaining(3);
          }
        } else {
          // No stored data, reset
          setHintCount({ date: new Date().toDateString(), count: 0 });
          setHintsRemaining(3);
        }
      } catch (e) {
        console.error('Error loading hint data during reset:', e);
        // Default to fresh state
        setHintCount({ date: new Date().toDateString(), count: 0 });
        setHintsRemaining(3);
      }
    } else {
      // Classic mode - unlimited hints
      setHintsRemaining(3);
    }
    
    return true; // Return true to indicate success
  }, [isDailyChallenge]);
  
  // Use a hint and track usage
  const useHint = useCallback(() => {
    // First check if we can use a hint
    if (!isDailyChallenge || hintsRemaining > 0) {
      // Only update hint count for daily challenges - Classic mode has unlimited hints
      if (isDailyChallenge) {
        const today = new Date().toDateString();
        let newCount = 0;
        
        // Make sure we're using the most current data from localStorage
        try {
          const storedData = localStorage.getItem('pegSolitaireHintCount');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.date === today) {
              newCount = parsedData.count + 1;
            } else {
              newCount = 1; // First hint of a new day
            }
          } else {
            newCount = 1; // First hint ever
          }
        } catch (e) {
          newCount = 1; // Error reading, just assume it's the first
          console.error('Error reading hint data:', e);
        }
        
        // Create new hint data
        const newHintData = {
          date: today,
          count: newCount
        };
        
        // Update state
        setHintCount(newHintData);
        setHintsRemaining(Math.max(0, 3 - newCount));
        
        // Save to localStorage
        try {
          localStorage.setItem('pegSolitaireHintCount', JSON.stringify(newHintData));
        } catch (e) {
          console.error('Failed to save hint count:', e);
        }
        
        console.log("Daily challenge hint used:", newCount, "of 3");
      } else {
        console.log("Classic mode hint used (unlimited)");
      }
      
      // Return true to indicate hint was used successfully
      return true;
    }
    
    // Return false if no hints remaining
    console.log("No hints remaining");
    return false;
  }, [isDailyChallenge, hintsRemaining]);

  return {
    // Settings
    boardType,
    setBoardType,
    difficulty, 
    setDifficulty,
    isDailyChallenge,
    setIsDailyChallenge,
    
    // Status
    gameOver,
    setGameOver,
    victory,
    setVictory,
    time,
    setTime,
    timerActive,
    setTimerActive,
    
    // UI
    showVictory,
    setShowVictory,
    showGameOver,
    setShowGameOver,
    showAbout,
    setShowAbout,
    showDailyChallenge,
    setShowDailyChallenge,
    showHint,
    setShowHint,
    showConfetti,
    setShowConfetti,
    
    // Hints
    hintsRemaining,
    setHintsRemaining,
    useHint,
    
    // Functions
    checkGameEnd,
    getCurrentHighScore,
    saveHighScore,
    resetGameStatus
  };
};

export default useGameState;