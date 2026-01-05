import { useEffect } from "react";
import { Typography } from "@mui/material";

type HighcoresScreenProps = {
  onBackToMenu: () => void;
};

export function HighcoresScreen({ onBackToMenu }: HighcoresScreenProps) {
  useEffect(() => {
    // This effect could be used to fetch highscore data when the component mounts
    async function fetchHighscores() {
      try {
        const response = await fetch("/api/highscores");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const highscores = await response.json();
        // Handle the fetched highscores (e.g., set state)
        console.log("Fetched highscores:", highscores);
      } catch (err) {
        console.error("Failed to fetch highscores:", err);
      }
    }

    fetchHighscores();
  }, []);
  return (
    <>
      <Typography variant="h4">Highscores</Typography>
      {/* Highscore list would be rendered here */}
      <button onClick={onBackToMenu}>Back to Menu</button>
    </>
  );
}
