// Login.js
import React, { useState } from 'react';

function Login({ onLogin }) {
  const [playerName, setPlayerName] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setPlayerName(event.target.value);
  };

  const login = async () => {
    if (!playerName.trim()) {
      setError("Please enter a name");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/player?playerName=${playerName}`
      );

      if (response.status === 404) {
        const newPlayer = {
          playerName,
          wins: 0,
          losses: 0
        };

        await fetch(`http://localhost:3001/api/player`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPlayer)
        });

        onLogin(newPlayer);
      } else {
        const playerData = await response.json();
        onLogin(playerData);
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to server.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "rgba(255,255,255,0.9)",
        zIndex: 10
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Player Login</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter player name"
          value={playerName}
          onChange={handleInputChange}
          style={{
            padding: "10px",
            fontSize: "18px",
            borderRadius: "6px",
            width: "260px",
            border: "2px solid black"
          }}
        />

        <button
          onClick={login}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: "black",
            color: "white"
          }}
        >
          Login
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: "12px", fontWeight: "bold" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default Login;
