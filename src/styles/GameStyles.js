/**
 * Game styles for the Pegdle game
 * Contains all CSS styles that were originally in the style tag
 */
export const GameStyles = `
.peg-solitaire-game {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  background-color: #2c2c2c;
  color: #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #444;
}

h1 {
  color: #f0d080; /* Dark gold color */
  margin-bottom: 10px;
  font-size: 2.2rem;
  letter-spacing: 0.05em;
}

.subtitle {
  color: #aaa;
  font-style: italic;
}

.game-modes {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.mode-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #444;
  color: #e0e0e0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.mode-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.mode-btn.active {
  background-color: #f0d080;
  color: #2c2c2c;
  box-shadow: 0 2px 8px rgba(240, 208, 128, 0.4);
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

.board-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  position: relative;
}

.hole {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3c3c3c;
  margin: 5px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
}

.hole.active {
  background-color: #555;
  box-shadow: 0 0 12px rgba(240, 208, 128, 0.6), inset 0 2px 5px rgba(0,0,0,0.4);
  transform: scale(1.05);
}

.hole.valid-move {
  background-color: #584d29;
  box-shadow: 0 0 15px rgba(240, 208, 128, 0.6);
  animation: pulse-subtle 1.5s infinite;
}

.hole.hint {
  animation: pulse 1s infinite;
}

@keyframes pulse-subtle {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.peg {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #f0d080, #c8a050);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4);
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.peg:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
}

.peg.celebrate {
  animation: celebrate 0.7s ease-in-out 3;
}

@keyframes celebrate {
  0% { transform: scale(1); }
  25% { transform: scale(1.2) rotate(-5deg); background: radial-gradient(circle at 30% 30%, #f1c40f, #f39c12); }
  50% { transform: scale(1.1) rotate(5deg); }
  75% { transform: scale(1.2) rotate(-5deg); background: radial-gradient(circle at 30% 30%, #f1c40f, #f39c12); }
  100% { transform: scale(1); }
}

.peg.hidden {
  opacity: 0;
}

.peg.dragged-source {
  opacity: 0.5; /* Semi-transparent to show it's being dragged */
}

.peg.capturing {
  animation: capture 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes capture {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(0); opacity: 0; }
}

.peg.animating {
  opacity: 0;
}

@keyframes particle-fade {
  0% { 
    transform: scale(1); 
    opacity: 0.9;
  }
  100% { 
    transform: scale(0); 
    opacity: 0;
  }
}

@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0); }
  100% { transform: translateY(100vh) rotate(0); }
}

@keyframes confetti-shake {
  0% { margin-left: 0; }
  100% { margin-left: 15px; }
}

.game-info {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 20px 0;
  font-weight: 600;
  background-color: #3c3c3c;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.info-item {
  text-align: center;
}

.info-item span {
  color: #f0d080;
  font-size: 1.1em;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin: 15px 0;
}

.control-btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background-color: #4a4a4a;
  color: #e0e0e0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.control-btn:hover {
  background-color: #5a5a5a;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.control-btn:active {
  transform: translateY(1px);
}

.control-btn:disabled {
  background-color: #333;
  color: #666;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.control-select {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: #f0d080;
  color: #2c2c2c;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.control-select:hover {
  background-color: #d9bc73;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.control-select:disabled {
  background-color: #555;
  color: #888;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.difficulty-select {
  margin: 15px 0;
}

.difficulty-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
}

.difficulty-select {
  margin: 20px 0;
  background-color: #3c3c3c;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.difficulty-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.difficulty-btn {
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  background-color: #4a4a4a;
  color: #e0e0e0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  font-size: 1.05em;
}

.difficulty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.difficulty-btn.active {
  background-color: #f0d080;
  color: #2c2c2c;
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(240, 208, 128, 0.4);
}

.difficulty-btn.active:hover {
  transform: scale(1.05) translateY(-2px);
}

.high-score {
  background-color: #584d29;
  color: #f0d080;
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 25px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.high-score:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(240, 208, 128, 0.3);
}

.high-score h3 {
  margin: 0;
  margin-bottom: 8px;
  font-size: 1.2em;
  color: #f0d080;
}

.instructions {
  background-color: #3c3c3c;
  padding: 25px;
  border-radius: 10px;
  margin: 25px 0;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.instructions h2 {
  color: #f0d080;
  margin-bottom: 15px;
  text-align: center;
}

.instructions ol {
  margin-left: 20px;
  color: #e0e0e0;
}

.instructions li {
  margin: 10px 0;
  line-height: 1.5;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: #2c2c2c;
  color: #e0e0e0;
  padding: 35px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-content.game-over {
  border-top: 5px solid #c0392b;
}

.modal-content.victory {
  border-top: 5px solid #f0d080;
}

.modal-content.daily-challenge {
  border-top: 5px solid #f0d080;
}

.modal h2 {
  color: #f0d080;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.modal p {
  margin-bottom: 25px;
  font-size: 1.1em;
  line-height: 1.5;
  color: #e0e0e0;
}

.new-record {
  color: #f0d080;
  font-weight: bold;
  font-size: 1.3em;
  animation: pulse 1s infinite;
}

.daily-results {
  background-color: #3c3c3c;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 10px;
  margin: 15px 0;
}

.result-box {
  background-color: #584d29;
  color: #f0d080;
  font-weight: bold;
  font-size: 1.2em;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.result-label {
  font-size: 0.9em;
  color: #aaa;
  text-align: center;
}

.share-btn {
  background-color: #584d29;
  color: #f0d080;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}

.share-btn:hover {
  background-color: #6a5d39;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(240, 208, 128, 0.3);
}

.play-again-btn {
  background-color: #f0d080;
  color: #2c2c2c;
  border: none;
  padding: 12px 25px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.3);
}

.play-again-btn:hover {
  background-color: #d9bc73;
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(240, 208, 128, 0.3);
}

.start-btn {
  background-color: #f0d080;
  color: #2c2c2c;
}

.start-btn:hover {
  background-color: #d9bc73;
}

.cancel-btn {
  background-color: #5a5a5a;
}

.cancel-btn:hover {
  background-color: #6a6a6a;
}


.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

footer {
  text-align: center;
  margin-top: 30px;
  color: #aaa;
  font-size: 14px;
  padding-top: 20px;
  border-top: 1px solid #444;
}

footer a {
  color: #f0d080;
  text-decoration: none;
  transition: color 0.2s;
}

footer a:hover {
  color: #d9bc73;
  text-decoration: underline;
}

@media (max-width: 600px) {
  .hole {
    width: 35px;
    height: 35px;
  }
  
  .peg {
    width: 25px;
    height: 25px;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .game-info {
    flex-direction: column;
    gap: 10px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}
`;

export default GameStyles;