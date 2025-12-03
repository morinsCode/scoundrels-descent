import { useState, useEffect } from "react";
/* import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg"; */
/* import "./App.css"; */
import { fetchDbStatus, type DbStatus } from "./api";
import { Button, Container } from "@mui/material";
import sdlogo from "./assets/sdlogo.png";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

function App() {
  /* const [count, setCount] = useState(0); */
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDbStatus()
      .then(setDbStatus)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container>
          <img src={sdlogo} alt="Scoundrels Descent Logo" />
          <Container>
            <Button variant="contained" color="secondary">
              Start New Game
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
          </Container>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}

          {dbStatus ? (
            <p>
              DB status: {dbStatus.status} – {dbStatus.now}
            </p>
          ) : (
            !error && <p>Checking database connection…</p>
          )}
        </Container>
      </ThemeProvider>
      {/*       <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  );
}

export default App;
