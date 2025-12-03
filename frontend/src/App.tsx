import { useState } from "react";
import { StartScreen } from "./components/StartScreen";

/* import { GameScreen } from "./GameScreen"; */

type Screen = "start" | "game";

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");

  function handleStartNewGame() {
    setScreen("game");
  }

  /*   function handleBackToMenu() {
    setScreen("start");
  } */

  return (
    <>
      {screen === "start" && (
        <StartScreen onStartNewGame={handleStartNewGame} />
      )}
      {/*       {screen === "game" && <GameScreen onExitToMenu={handleBackToMenu} />} */}
    </>
  );
}
