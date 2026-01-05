import { useState } from "react";
import { StartScreen } from "./components/StartScreen";
import { GameScreen } from "./components/GameScreen";
import { HighcoresScreen } from "./components/HighcoresScreen";

type Screen = "start" | "game" | "highscores";

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");

  function handleStartNewGame() {
    setScreen("game");
  }

  function handleBackToMenu() {
    setScreen("start");
  }

  function handleViewHighscores() {
    setScreen("highscores");
  }

  return (
    // # OPTIONAL SCREEN RENDERING
    <>
      {screen === "start" && (
        <StartScreen
          onStartNewGame={handleStartNewGame}
          onViewHighscores={handleViewHighscores}
        />
      )}
      {screen === "highscores" && (
        <HighcoresScreen onBackToMenu={handleBackToMenu} />
      )}
      {screen === "game" && <GameScreen onExitToMenu={handleBackToMenu} />}
    </>
  );
}
