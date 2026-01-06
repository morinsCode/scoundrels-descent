import { useState } from "react";
import { GameState } from "../game-engine/GameState";
import { Typography, TextField, Button } from "@mui/material";

type CompletedRunScreenProps = {
  gameState: GameState;
};

export function CompletedRunScreen({ gameState }: CompletedRunScreenProps) {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const finalScore = gameState.scoreRun();

  async function handleSave() {
    if (!name.trim()) return;

    setIsSaving(true);
    setSaved(false);
    setSaveError(null);

    try {
      const res = await fetch("/api/highscores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: name.trim(),
          score: finalScore
        })
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      setSaved(true);
    } catch (err) {
      console.error(err);
      setSaveError("Could not save highscore.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Typography variant="h1">YOU SURVIVED</Typography>
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
      <Typography variant="h5">Final Score: {finalScore}</Typography>

      <TextField
        id="player-name"
        label="Enter your name"
        variant="filled"
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{
          "& .MuiInputBase-input": { color: "white" },
          "& .MuiInputLabel-root": { color: "gray" }
        }}
      />

      <Button
        sx={{ mt: 2 }}
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={!name.trim() || isSaving || saved}
      >
        {isSaving ? "Saving..." : saved ? "Highscore saved" : "Save Highscore"}
      </Button>

      {saved && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Highscore saved!
        </Typography>
      )}
      {saveError && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {saveError}
        </Typography>
      )}
    </>
  );
}
