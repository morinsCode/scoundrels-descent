import { GameState } from "../game-engine/GameState";
import { GameDeck } from "../game-engine/GameDeck";
import { Room } from "../game-engine/Room";
import type { InProgressScreenProps } from "../game-engine/types";
import { Typography, Box, Button, Container } from "@mui/material";

export function InProgressScreen({
  gameState,
  gameDeck,
  onUpdate
}: InProgressScreenProps) {
  return (
    <>
      <Typography variant="h4">Game Screen</Typography>
      <Typography variant="h6">Room: {gameState.roomIndex}</Typography>
      <Typography variant="h6">
        Health: {gameState.player.currentHealth} / {gameState.player.maxHealth}
      </Typography>
      <Typography variant="h6">
        Cards remaining: {gameDeck?.remainingCards()} / 44{" "}
        {/* TODO hardcoded total cards in deck for now */}
      </Typography>
      <Typography variant="h6">
        Weapon Carried: {gameState.player.weaponCarried}
      </Typography>
      <Button variant="outlined">Equip Weapon</Button>
      <Button variant="outlined">Flee To Next Room</Button>

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
                onClick={() => {
                  gameState.playerChooseCard(card, false);
                  onUpdate();
                }}
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
