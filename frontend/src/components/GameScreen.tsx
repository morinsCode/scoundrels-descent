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

type GameScreenProps = {
  onExitToMenu: () => void;
};

export function GameScreen({ onExitToMenu }: GameScreenProps) {
  const [gameDeck, setGameDeck] = useState<GameDeck | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, forceUpdate] = useState(0); // Add this line

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

  useEffect(() => {
    console.log("GameState initialization effect triggered");
    console.log("gameDeck:", gameDeck);

    if (gameDeck) {
      console.log("Creating new GameState with drawPile:", gameDeck.drawPile);
      const state = new GameState(gameDeck.drawPile);
      console.log("GameState created:", state);
      console.log("Player health:", state.player.currentHealth);
      /*  console.log("Current room cards:", state.currentRoom.cards); */
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
            <>
              <div>Ready to Start</div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  gameState.startRun();
                  forceUpdate((prev) => prev + 1); // Force re-render
                }}
              >
                Start Run
              </Button>
            </>
          )}

          {gameState.stateOfRun === "in_progress" && (
            <>
              <div>Game Screen</div>
              <div>Room: {gameState.roomIndex}</div>
              <div>Health: {gameState.player.currentHealth}</div>
              <div>Cards remaining: {gameDeck?.remainingCards()}</div>

              <div style={{ marginTop: "20px" }}>
                <h3>Current Room Cards:</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {gameState.currentRoom?.cards.map((card) => (
                    <div
                      key={card.id}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px",
                        width: "150px",
                        textAlign: "center"
                      }}
                    >
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "4px"
                        }}
                      />
                      <h4>{card.name}</h4>
                      <p>Type: {card.cardType}</p>
                      <p>Level: {card.level}</p>
                      <p style={{ fontSize: "12px" }}>{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {gameState.stateOfRun === "completed" && (
            <>
              <div>Run Completed!</div>
              <div>Final Score: {gameState.scoreRun()}</div>
            </>
          )}

          {gameState.stateOfRun === "failed" && (
            <>
              <div>Run Failed</div>
              <div>You died at room {gameState.roomIndex}</div>
              <div>Score: {gameState.scoreRun()}</div>
            </>
          )}

          <Button variant="contained" color="secondary" onClick={onExitToMenu}>
            Quit Game
          </Button>
        </Container>
      </Container>
    </ThemeProvider>
  );
}
