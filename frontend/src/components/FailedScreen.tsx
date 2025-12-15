import { GameState } from "../game-engine/GameState";

type FailedRunScreen = {
  gameState: GameState;
};

export function FailedRunScreen({ gameState }: FailedRunScreen) {
  return (
    <>
      <div>Run Failed</div>
      <div>You died at room {gameState.roomIndex}</div>
      <div>Score: {gameState.scoreRun()}</div>
    </>
  );
}
