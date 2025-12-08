// === STYLING
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./../theme";

import { Button, Container } from "@mui/material";
import { useState } from "react";

type GameScreenProps = {
  onExitToMenu: () => void;
};

const drawDeck = async () => {
  // Implement the drawDeck functionality here
  console.log("Draw Deck button clicked");
  // GET /api/draw-deck
  try {
    const response = await fetch("/api/cards/deck");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Deck drawn:", data);
  } catch (error) {
    console.error("Error drawing deck:", error);
  }
};

export function GameScreen({ onExitToMenu }: GameScreenProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 4
          }}
        >
          <div>Game Screen (under construction)</div>
          <Button variant="contained" color="secondary" onClick={drawDeck}>
            Draw Deck
          </Button>
          <Button variant="contained" color="secondary" onClick={onExitToMenu}>
            Quit Game
          </Button>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
