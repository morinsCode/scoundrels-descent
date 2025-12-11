// === STYLING
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./../theme";

import { GameDeck } from "../game-engine/GameDeck";
import type { Card } from "../game-engine/types";

import { Button, Container } from "@mui/material";
import { useState, useEffect } from "react";

type GameScreenProps = {
  onExitToMenu: () => void;
};

export function GameScreen({ onExitToMenu }: GameScreenProps) {
  const [gameDeck, setGameDeck] = useState<GameDeck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cards and create GameDeck on component mount
  useEffect(() => {
    async function initializeDeck() {
      try {
        const response = await fetch("/api/cards/deck");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cards: Card[] = await response.json();
        const deck = new GameDeck(cards);
        setGameDeck(deck);

        //console.log with entire deck for debugging
        console.log("Initialized deck:", deck);
        console.log("Total cards:", deck.remainingCards());

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load deck");
        setIsLoading(false);
      }
    }

    initializeDeck();
  }, []);

  /* // Test for drawing cards
  const handleDrawCards = () => {
    if (!gameDeck) return;

    const drawnCards = gameDeck.drawCards(5); // Draw 5 cards
    console.log("Drew cards:", drawnCards);
    console.log("Remaining:", gameDeck.remainingCards());

    // Force re-render by creating new instance
    setGameDeck(new GameDeck(gameDeck.drawPile));
  };

  if (isLoading) {
    return <div>Loading deck...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  } */

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
          <div>Game Screen</div>
          <div>Cards remaining: {gameDeck?.remainingCards()}</div>

          {/*           <Button
            variant="contained"
            color="secondary"
            onClick={handleDrawCards}
            disabled={!gameDeck || gameDeck.remainingCards() === 0}
          >
            Draw 5 Cards
          </Button>
 */}
          <Button variant="contained" color="secondary" onClick={onExitToMenu}>
            Quit Game
          </Button>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
