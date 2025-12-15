// === STYLING
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./../theme";

import { GameState } from "../game-engine/GameState";
import { GameDeck } from "../game-engine/GameDeck";
import { Player } from "../game-engine/Player";
import { Room } from "../game-engine/Room";

import type { Card } from "../game-engine/types";

import { Button, Container } from "@mui/material";
import { useState, useEffect } from "react";

import { NotStartedScreen } from "./NotStartedScreen";
import { InProgressScreen } from "./InProgressScreen";
import { CompletedRunScreen } from "./CompletedRunScreen";
import { FailedRunScreen } from "./FailedScreen";

type GameScreenProps = {
  onExitToMenu: () => void;
};

export function GameScreen({ onExitToMenu }: GameScreenProps) {
  const [gameDeck, setGameDeck] = useState<GameDeck | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

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

        // TODO : Remove
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

  useEffect(() => {
    console.log("GameState initialization effect triggered");
    console.log("gameDeck:", gameDeck);

    if (gameDeck) {
      console.log("Creating new GameState with drawPile:", gameDeck.drawPile);
      const state = new GameState(gameDeck.drawPile);
      // TODO Remove logs
      console.log("GameState created:", state);
      console.log("Player health:", state.player.currentHealth);

      console.log("State of run:", state.stateOfRun);
      setGameState(state);
    } else {
      console.log("gameDeck is null, skipping GameState creation");
    }
  }, [gameDeck]);

  if (isLoading) {
    return <div>Loading deck...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!gameState) {
    return <div>Initializing game...</div>;
  }

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
          {gameState.stateOfRun === "not_started" && (
            <NotStartedScreen
              gameState={gameState}
              onStart={() => {
                gameState.startRun();
                forceUpdate((prev) => prev + 1);
              }}
            />
          )}

          {gameState.stateOfRun === "in_progress" && (
            <InProgressScreen
              gameState={gameState}
              gameDeck={gameDeck}
              onUpdate={() => forceUpdate((prev) => prev + 1)}
            />
          )}

          {gameState.stateOfRun === "completed" && (
            <CompletedRunScreen gameState={gameState} />
          )}

          {gameState.stateOfRun === "failed" && (
            <FailedRunScreen gameState={gameState} />
          )}

          <Button variant="contained" color="secondary" onClick={onExitToMenu}>
            Quit Game
          </Button>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
