import { useState } from "react";
import { StartScreen } from "./components/StartScreen";
import { GameScreen } from "./components/GameScreen";
import { HighcoresScreen } from "./components/HighcoresScreen";
import { HowToPlayScreen } from "./components/HowToPlayScreen";

type Screen = "start" | "game" | "highscores" | "howtoplay";

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

  function handleViewHowToPlay() {
    setScreen("howtoplay");
  }

  return (
    // # OPTIONAL SCREEN RENDERING
    <>
      {screen === "start" && (
        <StartScreen
          onStartNewGame={handleStartNewGame}
          onViewHighscores={handleViewHighscores}
          onViewHowToPlay={handleViewHowToPlay}
        />
      )}
      {screen === "highscores" && (
        <HighcoresScreen onBackToMenu={handleBackToMenu} />
      )}
      {screen === "howtoplay" && (
        <HowToPlayScreen onBackToMenu={handleBackToMenu} />
      )}
      {screen === "game" && <GameScreen onExitToMenu={handleBackToMenu} />}
    </>
  );
}
