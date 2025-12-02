import { useState, useEffect } from "react";
/* import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg"; */
import "./App.css";
import { fetchDbStatus, type DbStatus } from "./api";
import { Button, Container } from "@mui/material";
import sdlogo from "./assets/sdlogo.png";

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
      <img src={sdlogo} alt="Scoundrels Descent Logo" />
      <Container maxWidth="md">
        <h1>Scoundrels Descent</h1>
        <Button variant="contained" color="primary">
          Start New Game
        </Button>
        <Button variant="outlined" color="secondary" style={{ marginLeft: 8 }}>
          How To Play
        </Button>
        <Button variant="text" color="inherit" style={{ marginLeft: 8 }}>
          High Scores
        </Button>
        <Button variant="text" color="inherit" style={{ marginLeft: 8 }}>
          About
        </Button>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {dbStatus ? (
          <p>
            DB status: {dbStatus.status} – {dbStatus.now}
          </p>
        ) : (
          !error && <p>Checking database connection…</p>
        )}
      </Container>
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
