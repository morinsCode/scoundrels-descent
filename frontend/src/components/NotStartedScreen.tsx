import { Button } from "@mui/material";
import { GameState } from "../game-engine/GameState";

type NotStartedScreen = {
  gameState: GameState;
  onStart: () => void;
};

export function NotStartedScreen({ gameState, onStart }: NotStartedScreen) {
  return (
    <>
      <div>Ready to Start</div>
      <Button variant="contained" color="primary" onClick={onStart}>
        Start Run
      </Button>
    </>
  );
}
