# Pegdle - Daily Peg Solitaire Puzzle

Pegdle is a daily puzzle game inspired by Wordle and Nerdle, bringing the classic Peg Solitaire game into a fun, bite-sized daily challenge format. Each day, players around the world face the same puzzle, trying to clear the board with strategic jumps while using the minimum number of moves.

## 🎮 Game Overview

- **Daily Challenge**: A new puzzle each day, the same for all players
- **Multiple Board Types**: Classic English, European, Triangle, and Mini layouts
- **Difficulty Levels**: Adjustable for casual and expert play
- **Score Tracking**: Compare your performance against personal bests
- **Responsive Design**: Play on any device

## 🚀 How to Play

1. Jump pegs over each other to remove them from the board
2. A peg can jump over an adjacent peg into an empty hole
3. The jumped peg is removed
4. Try to clear the board, leaving only one peg
5. Challenge yourself to solve each puzzle in the minimum number of moves!

## 🛠️ Development Roadmap

### Phase 1: Perfecting Solo Experience ✅

1. **Smooth Animations & Visual Feedback** ✅
   - ✅ Refine peg jump and capture animations
   - ✅ Add subtle particle effects for successful moves
   - ✅ Create satisfying victory animation sequence
   - ✅ Implement responsive sizing for different devices

2. **Enhanced User Interface** ✅
   - ✅ Create minimalist, distraction-free design
   - ✅ Develop cohesive color scheme and visual identity
   - ✅ Improve board visibility and playability
   - ✅ Design elegant dark color scheme with gold accents

3. **Game Feel Enhancements** ✅
   - ✅ Add micro-animations for user interactions
   - ✅ Optimize touch targets and drag sensitivity
   - ✅ Create "juicy" feedback for successful moves
   - ✅ Add helpful hints with daily limits

4. **Wordlike Reward Mechanics** ✅
   - ✅ Design minimalist success/progress indicators
   - ✅ Add simple confetti/celebration for victories
   - ✅ Create shareable daily results (like Wordle squares)
   - ✅ Implement multiple difficulty levels

5. **Performance Optimization** ✅
   - ✅ Ensure smooth animations on all devices
   - ✅ Optimize rendering for efficiency (component memoization)
   - ✅ Reduce unnecessary re-renders
   - ✅ Implement caching for daily puzzles and user preferences

### Phase 2: Core Game Features (IN PROGRESS)

1. **Daily Challenge Experience** (✅ Partially Complete)
   - ⬜ Add calendar view to show past challenges
   - ✅ Implement difficulty progression with selectable levels
   - 🔄 Track and limit hint usage for daily challenges (needs fixes)
   - ⬜ Design "perfect week" bonus challenges

2. **Game Modes & Variations** (✅ Partially Complete)
   - ✅ Refine existing board layouts (fixed triangle board)
   - 🔄 Implement practice mode with unlimited hints (needs fixes)
   - ✅ Add multiple board types (English, European, Triangle, Mini)
   - ⬜ Add timed challenge mode

3. **Progressive Tutorials** (⬜ To Do)
   - ⬜ Create guided first-time experience
   - ⬜ Design strategy tips that appear after losses
   - ✅ Implement intelligent hint system with move analysis
   - ⬜ Add optional advanced technique tutorials

### Known Issues & To-Do

1. **Hint System Fixes** (🔴 Priority)
   - Fix infinite update loop in hint tracking (partially fixed)
   - Fix hint count persistence across game mode changes
   - Ensure hint counter resets properly for daily challenges
   - Make hint button correctly show available hints
   - Fix "maximum update depth exceeded" errors in both Classic and Daily challenge modes

### Phase 3: Social & Advanced Features

1. **Social Elements**
   - Implement social sharing of results
   - Create streak tracking for daily challenges
   - Design shareable performance graphs
   - Add optional result comparisons

2. **Advanced Game Features**
   - Create themed board designs for holidays
   - Add weekly special challenges
   - Implement achievement system
   - Create custom puzzle creator

### Phase 4: Infrastructure & User Accounts (Future)

1. **User Account System**
   - Add optional user accounts
   - Implement cross-device synchronization
   - Create persistent statistics
   - Add profile customization

2. **Community Features**
   - Add leaderboards
   - Implement friend challenges
   - Create community puzzle sharing
   - Add minimal, non-intrusive ads in designated areas

## 💻 Technical Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Project Structure

The code is organized into the following structure:

- `/src` - Main source code
  - `/components` - React components
    - `/modals` - Modal dialog components
  - `/hooks` - Custom React hooks
  - `/utils` - Utility functions and constants
  - `/styles` - Styling modules

Key components:
- `App.js` - Main application component
- `components/GameBoard.js` - Game board rendering and interaction
- `components/Cell.js` - Individual board cell component
- `components/Particles.js` - Particle effects for captured pegs
- `components/Confetti.js` - Celebration effects for victories
- `components/GameControls.js` - Game controls UI
- `components/modals/VictoryModal.js` - Victory celebration and sharing
- `hooks/useGameBoard.js` - Game board state and logic
- `hooks/useDailyChallenge.js` - Daily challenge generation and management
- `hooks/useGameState.js` - Overall game state including limited hints
- `utils/boardConfigs.js` - Board layouts and difficulty settings
- `utils/gameUtils.js` - Game logic and intelligent hint system
- `utils/storageUtils.js` - Local storage caching for persistence

### Performance Optimizations

The code includes several optimizations to ensure smooth gameplay:

1. **Component Memoization** - React.memo is used for all components to prevent unnecessary re-renders
2. **Local Storage Caching** - Daily challenges are cached to avoid regeneration on page refresh
3. **Efficient State Management** - Custom hooks separate concerns and minimize state updates
4. **Optimized Animations** - CSS animations use hardware acceleration and avoid layout thrashing
5. **Batch Updates** - State updates are batched where possible to reduce render cycles
6. **User Preference Persistence** - Settings like difficulty level are saved between sessions
7. **Lazy Initialization** - Heavy calculations are deferred until needed
8. **Throttled Events** - Drag events are throttled to improve performance

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production

## 🤝 Contributing

Interested in contributing? We welcome pull requests! Please check the issues page for current tasks or add your own suggestions.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Pegdle: A new puzzle everyday. How few moves can you solve it in?