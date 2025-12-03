import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./../theme";
import { Button, Container, Box } from "@mui/material";
import sdlogo from "../assets/sdlogo.png"; // note one fewer "./"
import { useState, useEffect } from "react";
import { fetchDbStatus, type DbStatus } from "./../api";

type StartScreenProps = {
  onStartNewGame: () => void;
};

export function StartScreen({ onStartNewGame }: StartScreenProps) {
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDbStatus()
      .then(setDbStatus)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
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
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 4
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={onStartNewGame} // <-- actually use the prop
          >
            New Game
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginLeft: 8 }}
          >
            How To Play
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginLeft: 8 }}
          >
            High Scores
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginLeft: 8 }}
          >
            About
          </Button>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {dbStatus ? (
            <p>
              Data Base status: {dbStatus.status} – {dbStatus.now}
            </p>
          ) : (
            !error && <p>Checking database connection…</p>
          )}
        </Container>
      </Container>
    </ThemeProvider>
  );
}
