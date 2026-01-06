import { useState } from "react";
import { StartScreen } from "./components/StartScreen";
import { GameScreen } from "./components/GameScreen";
import { HighcoresScreen } from "./components/HighcoresScreen";
import { HowToPlayScreen } from "./components/HowToPlayScreen";
import { AboutScreen } from "./components/AboutScreen";

type Screen = "start" | "game" | "highscores" | "howtoplay" | "about";

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

  function handleViewAbout() {
    setScreen("about");
  }

  return (
    <>
      {screen === "start" && (
        <StartScreen
          onStartNewGame={handleStartNewGame}
          onViewHighscores={handleViewHighscores}
          onViewHowToPlay={handleViewHowToPlay}
          onViewAbout={handleViewAbout}
        />
      )}
      {screen === "highscores" && (
        <HighcoresScreen onBackToMenu={handleBackToMenu} />
      )}
      {screen === "howtoplay" && (
        <HowToPlayScreen onBackToMenu={handleBackToMenu} />
      )}
      {screen === "about" && <AboutScreen onBackToMenu={handleBackToMenu} />}
      {screen === "game" && <GameScreen onExitToMenu={handleBackToMenu} />}
    </>
  );
}
