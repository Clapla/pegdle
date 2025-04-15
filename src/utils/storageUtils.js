/**
 * Load high scores from localStorage
 * @returns {Object} - High score data, or empty object if none
 */
export const loadHighScores = () => {
  try {
    const savedScores = localStorage.getItem('pegSolitaireHighScores');
    if (savedScores) {
      return JSON.parse(savedScores);
    }
    return {};
  } catch (error) {
    console.error('Error loading high scores:', error);
    return {};
  }
};

/**
 * Save high scores to localStorage
 * @param {Object} highScores - The high scores data to save
 */
export const saveHighScores = (highScores) => {
  try {
    localStorage.setItem('pegSolitaireHighScores', JSON.stringify(highScores));
  } catch (error) {
    console.error('Error saving high scores:', error);
  }
};

/**
 * Load daily challenge from localStorage
 * @returns {Object|null} - The daily challenge if found for today, or null
 */
export const loadDailyChallenge = () => {
  try {
    const today = new Date().toDateString();
    const savedChallenge = localStorage.getItem('pegSolitaireDailyChallenge');
    
    if (savedChallenge) {
      const challenge = JSON.parse(savedChallenge);
      if (challenge.date === today) {
        return challenge;
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading daily challenge:', error);
    return null;
  }
};

/**
 * Save daily challenge to localStorage
 * @param {Object} challenge - The daily challenge data
 */
export const saveDailyChallenge = (challenge) => {
  try {
    localStorage.setItem('pegSolitaireDailyChallenge', JSON.stringify(challenge));
  } catch (error) {
    console.error('Error saving daily challenge:', error);
  }
};

/**
 * Save user-selected difficulty in localStorage
 * @param {string} difficulty - The difficulty level
 */
export const saveDifficulty = (difficulty) => {
  try {
    localStorage.setItem('pegSolitaireDifficulty', difficulty);
  } catch (error) {
    console.error('Error saving difficulty setting:', error);
  }
};

/**
 * Load user-selected difficulty from localStorage
 * @returns {string} - The saved difficulty, or 'medium' if none found
 */
export const loadDifficulty = () => {
  try {
    const difficulty = localStorage.getItem('pegSolitaireDifficulty');
    return difficulty || 'medium';
  } catch (error) {
    console.error('Error loading difficulty setting:', error);
    return 'medium';
  }
};

/**
 * Save daily hint count to localStorage
 * @param {string} date - Current date string
 * @param {number} hintsUsed - Number of hints used today
 */
export const saveDailyHintCount = (date, hintsUsed) => {
  try {
    localStorage.setItem('pegSolitaireHintCount', JSON.stringify({
      date,
      count: hintsUsed
    }));
  } catch (error) {
    console.error('Error saving hint count:', error);
  }
};

/**
 * Load daily hint count from localStorage
 * @returns {Object} - Object with date and count of hints used
 */
export const loadDailyHintCount = () => {
  try {
    const today = new Date().toDateString();
    const savedHints = localStorage.getItem('pegSolitaireHintCount');
    
    if (savedHints) {
      const hintData = JSON.parse(savedHints);
      
      // If the saved data is from today, return it
      if (hintData.date === today) {
        return hintData;
      }
    }
    
    // Otherwise return a fresh count for today
    return {
      date: today,
      count: 0
    };
  } catch (error) {
    console.error('Error loading hint count:', error);
    return {
      date: new Date().toDateString(),
      count: 0
    };
  }
};