import { Typography, Button } from "@mui/material";
import { ScreenLayout } from "../ScreenLayout";
import sdlogo from "../assets/sdlogo.png";
import { Box } from "@mui/system";

type HowToPlayScreenProps = {
  onBackToMenu: () => void;
};

export function HowToPlayScreen({ onBackToMenu }: HowToPlayScreenProps) {
  return (
    <>
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
        <Typography variant="h4">How To Play Scoundrels Descent</Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
          Scoundrels Descent is a single-player, run-based card dungeon. You
          push through the deck one “room” at a time, trying to survive long
          enough to clear the dungeon. Each room presents a unique challenge
          that you must overcome using your cards and abilities.
        </Typography>

        <Typography variant="h5">Your goal</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Win: clear the dungeon deck. Lose: your Health (HP) hits 0. Either
          way, you’ll get an end screen with a score breakdown (and name
          submission, if enabled).
        </Typography>

        <Typography variant="h5">Card types</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Monsters They deal damage equal to their value. Weapons A weapon’s
          value is how much it reduces monster damage. Weapons are binding: if
          you take a new weapon, you must equip it and replace your old one. Aid
          Restores HP equal to its value. You can’t heal above your max HP (20).
        </Typography>

        <Typography variant="h5">Rooms</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Each turn is about dealing with a “room” of cards. Each room contains
          4 cards. You may avoid the room: These cards goes to the bottom of the
          dungeon deck. You cannot avoid two rooms in a row. If you don’t avoid
          the room: You must resolve exactly 3 of the 4 cards, in any order you
          choose. The 4th card stays and becomes part of the next room.
        </Typography>

        <Typography variant="h5">Combat</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          When you choose a monster, you fight it either: Unarmed: take the
          monster’s full value as damage. With a weapon: damage = monster value
          − weapon value. The “weapon lock” rule (important) After your weapon
          kills a monster, it can only be used on a monster of equal or lower
          value than the last monster it killed.
        </Typography>

        <Typography variant="h5">Aid</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          When you choose an aid card, you heal HP equal to its value. You can’t
          heal above your max HP (20).
        </Typography>

        <Typography variant="h5">End of run</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          When you die or clear the dungeon, the game shows your results +
          scoring breakdown (and typically lets you submit your name to the high
          score list).
        </Typography>

        <Typography variant="h5"></Typography>
        <Typography variant="body1" sx={{ mb: 2 }}></Typography>

        <Button variant="contained" color="secondary" onClick={onBackToMenu}>
          Back to Menu
        </Button>
      </ScreenLayout>
    </>
  );
}
