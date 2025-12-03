// === STYLING
import { Button } from "@mui/material";

type GameScreenProps = {
  onExitToMenu: () => void;
};

export function GameScreen({ onExitToMenu }: GameScreenProps) {
  return (
    <>
      <div>Game Screen (under construction)</div>
      <Button onClick={onExitToMenu}>Back to Menu</Button>
    </>
  );
}
