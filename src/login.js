// Login.js
import React, { useState } from "react";

function Login({ onLogin }) {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      // Check if player exists (GET)
      const res = await fetch(
        `http://localhost:3001/api/player?playerName=${playerName}`
      );

      if (res.status === 404) {
        // Create new player (POST)
        const newPlayer = {
          playerName,
          wins: 0,
          losses: 0
        };

        await fetch("http://localhost:3001/api/player", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPlayer)
        });

        onLogin(newPlayer);
      } else {
        // Returning player
        const playerData = await res.json();
        onLogin(playerData);
      }
    } catch (err) {
      console.log(err);
      setError("Could not connect to API server.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        zIndex: 9999
      }}
    >
      <h2>Enter your name to begin:</h2>

      <input
        type="text"
        placeholder="Player Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        style={{
          padding: "10px",
          width: "240px",
          fontSize: "18px",
          borderRadius: "8px",
          border: "2px solid black"
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "18px",
          borderRadius: "8px",
          background: "black",
          color: "white",
          cursor: "pointer"
        }}
      >
        Login
      </button>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default Login;
