# Pegdle Project Guide

## Build & Development Commands
- `npm start` - Run development server
- `npm test` - Run all tests
- `npm test -- -t "test name"` - Run specific test
- `npm run build` - Create production build
- `npm run eject` - Eject from Create React App (avoid this)

## Code Style Guidelines
- **React Components**: Use functional components with hooks
- **State Management**: Use useState/useEffect for component state
- **Naming**: 
  - Components: PascalCase
  - Functions/variables: camelCase
  - CSS classes: kebab-case
- **Files**: Group related components in same directory
- **Error Handling**: Use try/catch for async operations
- **Imports**: Group React imports first, then third-party, then local
- **CSS**: Component-specific styles using scoped CSS-in-JS
- **TypeChecking**: Use prop-types for component props

## Project Structure
- React application built with Create React App
- Game components in src/ directory
- Main game logic in PegSolitaire component
- Uses functional components with React hooks