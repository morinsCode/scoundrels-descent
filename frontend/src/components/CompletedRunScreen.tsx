import { GameState } from "../game-engine/GameState";

type CompletedRunScreen = {
  gameState: GameState;
};

export function CompletedRunScreen({ gameState }: CompletedRunScreen) {
  return (
    <>
      <div>Run Completed!</div>
      <div>Final Score: {gameState.scoreRun()}</div>
    </>
  );
}
