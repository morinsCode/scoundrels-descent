import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { fetchDbStatus, type DbStatus } from "./api";

function App() {
  const [count, setCount] = useState(0);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDbStatus()
      .then(setDbStatus)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div>
        <h1>Scoundrels Descent</h1>

        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {dbStatus ? (
          <p>
            DB status: {dbStatus.status} – {dbStatus.now}
          </p>
        ) : (
          !error && <p>Checking database connection…</p>
        )}
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
