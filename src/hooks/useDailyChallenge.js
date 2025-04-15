import { useState, useCallback } from 'react';
import { boardConfigs, difficultyLevels } from '../utils/boardConfigs';
import { findAllPossibleUnmoves } from '../utils/gameUtils';
import { loadDailyChallenge, saveDailyChallenge } from '../utils/storageUtils';

/**
 * Hook for managing daily challenges
 */
const useDailyChallenge = () => {
  const [dailyChallenge, setDailyChallenge] = useState(null);
  
  /**
   * Generate a daily challenge with the given parameters
   * @param {string} date - Date string to use as seed
   * @param {string} difficulty - Difficulty level
   * @returns {Object} - The generated challenge
   */
  const generateDailyChallenge = useCallback((date, difficulty) => {
    // Use the date as a seed for pseudo-random generation
    const dateString = date || new Date().toDateString();
    const seed = dateString.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Choose a board type based on the day of the week
    const dayOfWeek = new Date(dateString).getDay();
    const boardTypes = Object.keys(boardConfigs);
    const selectedBoardType = boardTypes[dayOfWeek % boardTypes.length];
    
    // Get configuration for selected board
    const config = boardConfigs[selectedBoardType];
    
    // Get difficulty level
    const targetMoves = difficultyLevels[difficulty].movesToSolve;
    
    // Create a solved board (just one peg)
    let solvedBoard = [];
    for (let r = 0; r < config.rows; r++) {
      const row = [];
      for (let c = 0; c < (config.cols || config.rows); c++) {
        if (config.isTriangle && c > r) {
          row.push(-1); // Not part of the board
        } else if (r === Math.floor(config.rows/2) && c === Math.floor(config.cols/2)) {
          row.push(1); // Center peg
        } else {
          row.push(0); // Empty
        }
      }
      solvedBoard.push(row);
    }
    
    // Work backwards from the solved state
    let moves = [];
    let currentBoard = solvedBoard;
    
    // Add moves based on difficulty
    for (let i = 0; i < targetMoves; i++) {
      const possibleUnmoves = findAllPossibleUnmoves(currentBoard);
      
      if (possibleUnmoves.length === 0) break;
      
      // Use the seed to select a consistent "random" move
      const unmoveIndex = (seed + i) % possibleUnmoves.length;
      const unmove = possibleUnmoves[unmoveIndex];
      
      // Apply the unmove
      const newBoard = [...currentBoard.map(row => [...row])];
      newBoard[unmove.from[0]][unmove.from[1]] = 0; // Remove peg
      newBoard[unmove.jumped[0]][unmove.jumped[1]] = 1; // Add jumped peg
      newBoard[unmove.to[0]][unmove.to[1]] = 1; // Add destination peg
      
      currentBoard = newBoard;
      moves.push(unmove);
    }
    
    const challenge = {
      date: dateString,
      boardType: selectedBoardType,
      initialBoard: currentBoard,
      difficulty: difficulty,
      movesToSolve: moves.length,
      solution: moves.reverse() // Reverse to get forward moves
    };
    
    setDailyChallenge(challenge);
    saveDailyChallenge(challenge);
    
    return challenge;
  }, []);
  
  /**
   * Load today's daily challenge from localStorage, or generate a new one
   * @param {string} difficulty - Optional difficulty to use if generating new challenge
   * @returns {Object} - The loaded or generated challenge
   */
  const getTodaysChallenge = useCallback((difficulty) => {
    const today = new Date().toDateString();
    const savedChallenge = loadDailyChallenge();
    
    // If we have a saved challenge for today
    if (savedChallenge && savedChallenge.date === today) {
      // If difficulty is specified and different, regenerate with new difficulty
      if (difficulty && savedChallenge.difficulty !== difficulty) {
        return generateDailyChallenge(today, difficulty);
      }
      
      // Otherwise, use the saved challenge
      setDailyChallenge(savedChallenge);
      return savedChallenge;
    }
    
    // Generate a new challenge for today
    return generateDailyChallenge(today, difficulty || 'medium');
  }, [generateDailyChallenge]);
  
  return {
    dailyChallenge,
    generateDailyChallenge,
    getTodaysChallenge
  };
};

export default useDailyChallenge;