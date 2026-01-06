import { Typography, Button } from "@mui/material";
import { ScreenLayout } from "../ScreenLayout";
import sdlogo from "../assets/sdlogo.png";
import { Box } from "@mui/system";

type AboutScreenProps = {
  onBackToMenu: () => void;
};

export function AboutScreen({ onBackToMenu }: AboutScreenProps) {
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
      <Typography variant="h4" sx={{ mb: 2 }}>
        About Scoundrels Descent
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Inspired by Scoundrel (Solitaire Card Game) This project is based on the
        solitaire card game Scoundrel and keeps the same core vibe: simple
        components (a standard deck), high tension, and lots of “one more room”
        decision-making. What’s different here Scoundrels Descent is not a 1:1
        copy. It includes small tweaks and additions that support a digital
        format, such as: UI-driven presentation (rooms, stats, scoring
        breakdowns) extra feedback and clarity on rules and outcomes
        quality-of-life adjustments that make repeated runs smoother
        Acknowledgement / Ownership Scoundrel is © 2011 Zach Gage and Kurt Bieg.
        Scoundrels Descent is an independent fan-made project inspired by their
        original design and is not affiliated with, endorsed by, or produced by
        the original creators.
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        This version is a work in progress. Rules, balance, and content may
        change as the game evolves.
      </Typography>

      <Button variant="contained" color="secondary" onClick={onBackToMenu}>
        Back to Menu
      </Button>
    </ScreenLayout>
  );
}
