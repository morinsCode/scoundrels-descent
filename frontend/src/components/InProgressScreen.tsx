import { GameState } from "../game-engine/GameState";
import { GameDeck } from "../game-engine/GameDeck";
import { Room } from "../game-engine/Room";
import type { InProgressScreenProps } from "../game-engine/types";
import { Typography, Box, Button, Container } from "@mui/material";
import { useState } from "react";

export function InProgressScreen({
  gameState,
  gameDeck,
  onUpdate
}: InProgressScreenProps) {
  const [useWeapon, setUseWeapon] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasWeapon = gameState.player.weaponCarried !== null;
  const isArmed = hasWeapon && useWeapon;

  const handleResolveCard = (card: any) => {
    setErrorMessage(null);

    if (
      card.cardType === "monster" &&
      isArmed &&
      gameState.player.weaponCarried
    ) {
      const monsterLevel = card.level;
      const maxKilled = gameState.player.weaponMaxMonsterValue;

      if (maxKilled !== null && monsterLevel > maxKilled) {
        setErrorMessage(
          `Monsters armor (${monsterLevel}) to strong. Weapon  (${maxKilled}) to dull. Fight unarmed`
        );
        return;
      }
    }

    gameState.playerChooseCard(card, isArmed);
    onUpdate();
  };

  return (
    <>
      <Typography variant="h4">Game Screen</Typography>
      <Typography variant="h6">Room: {gameState.roomIndex}</Typography>
      <Typography variant="h6">
        Health: {gameState.player.currentHealth} / {gameState.player.maxHealth}
      </Typography>
      <Typography variant="h6">
        {/* TODO hardcoded total cards in deck for now */}
        {/* TODO GameDeck needs Total Cards value, or does it? Total cards are always 44 */}
        Cards remaining: {gameDeck?.remainingCards()} / 44{" "}
      </Typography>
      <Typography variant="h6">
        Weapon Carried: {gameState.player.weaponCarried?.name || "None"}
        {gameState.player.weaponCarried &&
          ` (Level ${gameState.player.weaponCarried.level})`}
        {gameState.player.weaponMaxMonsterValue !== null &&
          ` - Max Monster Killed: ${gameState.player.weaponMaxMonsterValue}`}
      </Typography>
      <Button
        variant="outlined"
        onClick={() => setUseWeapon(!useWeapon)}
        disabled={!hasWeapon}
      >
        Toggle Weapon
      </Button>
      {isArmed && <Typography variant="h6">Armed</Typography>}
      {!isArmed && <Typography variant="h6">Unarmed</Typography>}

      {errorMessage && (
        <Typography
          variant="body1"
          color="primary"
          sx={{ mt: 2, p: 2, border: "1px solid purple", borderRadius: "20px" }}
        >
          {errorMessage}
        </Typography>
      )}

      <Button
        variant="outlined"
        onClick={() => {
          gameState.avoidRoom();
          onUpdate();
        }}
        disabled={gameState.avoidedPreviousRoom}
      >
        Flee To Next Room
      </Button>
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="h5">Current Room Cards:</Typography>
        <Box sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {gameState.currentRoom?.cards.map((card) => (
            <Box key={card.id}>
              <div
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
                  style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/150x200/png?text=Card+Image";
                  }}
                />
                <h4>{card.name}</h4>
                <p>Type: {card.cardType}</p>
                <p>Level: {card.level}</p>
                <p style={{ fontSize: "12px" }}>{card.description}</p>
              </div>
              <Button
                variant="outlined"
                onClick={() => handleResolveCard(card)}
              >
                Resolve Card
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
