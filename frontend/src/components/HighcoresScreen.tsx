import { useEffect, useState } from "react";
import { Typography, Button, Box, TextField } from "@mui/material";
import { ScreenLayout } from "../ScreenLayout";
import sdlogo from "../assets/sdlogo.png";

type HighcoresScreenProps = {
  onBackToMenu: () => void;
};

export function HighcoresScreen({ onBackToMenu }: HighcoresScreenProps) {
  const [highscores, setHighscores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHighscores() {
      try {
        const response = await fetch("/api/highscores");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setHighscores(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
        setIsLoading(false);
      }
    }

    fetchHighscores();
  }, []);

  return (
    <ScreenLayout>
      <Box
        component="img"
        src={sdlogo}
        alt="Scoundrels Descent Logo"
        sx={{
          width: "100%",
          maxWidth: 600,
          height: "auto",
          mx: "auto",
          display: "block",
          mb: 4
        }}
      />
      <Typography variant="h4">Highscores</Typography>

      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error: {error}</Typography>}

      {highscores.map((score, index) => (
        <Typography key={index}>
          {score.playerName} - {score.score} -{" "}
          {new Date(score.achievedAt).toLocaleString()}
        </Typography>
      ))}

      <Button variant="contained" color="secondary" onClick={onBackToMenu}>
        Back to Menu
      </Button>
    </ScreenLayout>
  );
}
