import { useEffect } from "react";

export function HighcoresScreen() {
  useEffect(() => {
    // This effect could be used to fetch highscore data when the component mounts
    async function fetchHighscores() {
      try {
        const response = await fetch("/api/highscores");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const highscores = await response.json();
        // Handle the fetched highscores (e.g., set state)
        console.log("Fetched highscores:", highscores);
      } catch (err) {
        console.error("Failed to fetch highscores:", err);
      }
    }

    fetchHighscores();
  }, []);
  return (
    <>
      <div>Highscores</div>
      {/* Highscore list would be rendered here */}
    </>
  );
}
