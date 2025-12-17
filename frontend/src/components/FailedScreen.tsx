import { GameState } from "../game-engine/GameState";
import { Typography } from "@mui/material";
type FailedRunScreen = {
  gameState: GameState;
};

export function FailedRunScreen({ gameState }: FailedRunScreen) {
  return (
    <>
      <Typography variant="h1">YOU DIED</Typography>
      <Typography variant="h5">
        You reached room {gameState.roomIndex}
      </Typography>
      <Typography variant="h5">
        Monsters Defeated: {gameState.player.monstersDefeated.join(", ")}
      </Typography>
      <Typography variant="h5">
        Points for monsters:{" "}
        {gameState.player.monstersDefeated.reduce(
          (sum, level) => sum + level,
          0
        )}
      </Typography>
      <Typography variant="h5">
        Health lost penalty: -{gameState.player.totalHealthLost}
      </Typography>
      <Typography variant="h5"></Typography>
      <Typography variant="h5">Final Score: {gameState.scoreRun()}</Typography>
    </>
  );
}
