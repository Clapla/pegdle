// Board configurations for different board types
const boardConfigs = {
  english: {
    rows: 7,
    cols: 7,
    layout: [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1], // 0 represents empty center
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0]
    ]
  },
  european: {
    rows: 7,
    cols: 7,
    layout: [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1], // 0 represents empty center
      [1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 0, 0]
    ]
  },
  triangle: {
    rows: 5,
    cols: 5,
    layout: [
      [1, -1, -1, -1, -1],
      [1, 1, -1, -1, -1],
      [1, 1, 1, -1, -1],
      [1, 1, 1, 1, -1],
      [0, 1, 1, 1, 1] // 0 represents empty corner
    ],
    isTriangle: true
  },
  mini: {
    rows: 5,
    cols: 5,
    layout: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ]
  }
};

// Difficulty levels with more distinct number of moves
const difficultyLevels = {
  easy: { name: "Easy", movesToSolve: 5, timeLimit: 120 },
  medium: { name: "Medium", movesToSolve: 10, timeLimit: 180 },
  hard: { name: "Hard", movesToSolve: 18, timeLimit: 240 }
};

export { boardConfigs, difficultyLevels };