// HangmanGame.js
import React from "react";
import Login from "./Login";
import SingleLetterSearchBar from "./SingleLetterSearchBar";

const pics = [
  "noose.png",
  "upperBody.png",
  "upperandlowerbody.png",
  "1arm.png",
  "botharms.png",
  "1leg.png",
  "dead.png"
];

const words = [
  "Morehouse",
  "Spelman",
  "Basketball",
  "Table",
  "Museum",
  "Excellent",
  "Fun",
  "React"
];

class HangmanGame extends React.Component {
  state = {
    wordList: words,
    curWord: 0,
    lifeLeft: 0,
    usedLetters: [],
    correctLetters: [],

    playerName: "",
    wins: 0,
    losses: 0,
    isLoggedIn: false
  };

  componentDidMount() {
    this.startNewGame();
  }

  handleLogin = (playerData) => {
    this.setState({
      playerName: playerData.playerName,
      wins: playerData.wins,
      losses: playerData.losses,
      isLoggedIn: true
    });
  };

  startNewGame = () => {
    this.setState({
      curWord: Math.floor(Math.random() * words.length),
      lifeLeft: 0,
      usedLetters: [],
      correctLetters: []
    });
  };

  handleSearch = (letter) => {
    letter = letter.toLowerCase();
    const { usedLetters, correctLetters, wordList, curWord } = this.state;

    if (usedLetters.includes(letter)) return;

    const word = wordList[curWord].toLowerCase();
    const isCorrect = word.includes(letter);

    this.setState(
      (prev) => ({
        usedLetters: [...prev.usedLetters, letter],
        correctLetters: isCorrect
          ? [...prev.correctLetters, letter]
          : prev.correctLetters,
        lifeLeft: isCorrect ? prev.lifeLeft : prev.lifeLeft + 1
      }),
      this.checkGameStatus
    );
  };

  checkGameStatus = () => {
    const { wordList, curWord, correctLetters, lifeLeft } = this.state;
    const word = wordList[curWord].toLowerCase();
    const uniqueLetters = [...new Set(word)];

    if (lifeLeft >= 6) {
      this.addLoss();
      alert("Game Over!");
      this.startNewGame();
    }

    if (uniqueLetters.every((l) => correctLetters.includes(l))) {
      this.addWin();
      alert("You Win!");
      this.startNewGame();
    }
  };

  addWin = () => {
    this.setState((prev) => ({ wins: prev.wins + 1 }), this.sendStatsToDB);
  };

  addLoss = () => {
    this.setState((prev) => ({ losses: prev.losses + 1 }), this.sendStatsToDB);
  };

  sendStatsToDB = async () => {
    const { playerName, wins, losses } = this.state;

    await fetch("http://localhost:3001/api/player", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName, wins, losses })
    });
  };

  renderLetterButtons = () => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    const { usedLetters, correctLetters } = this.state;

    return alphabet.map((letter) => {
      const used = usedLetters.includes(letter);
      const correct = correctLetters.includes(letter);
      const bg = !used ? "black" : correct ? "green" : "red";

      return (
        <button
          key={letter}
          disabled={used}
          onClick={() => this.handleSearch(letter)}
          style={{
            backgroundColor: bg,
            color: "white",
            margin: "3px",
            padding: "10px",
            borderRadius: "6px",
            cursor: used ? "not-allowed" : "pointer"
          }}
        >
          {letter.toUpperCase()}
        </button>
      );
    });
  };

  render() {
    const { wordList, curWord, lifeLeft, playerName, wins, losses, isLoggedIn } =
      this.state;
    const word = wordList[curWord];

    return (
      <div style={{ textAlign: "center" }}>
        {!isLoggedIn && <Login onLogin={this.handleLogin} />}

        {isLoggedIn && (
          <div>
            <h1 style={{ marginTop: "30px" }}>
              Let's play <span style={{ color: "blue" }}>({playerName})</span>
            </h1>

            <h3>
              Wins: {wins} | Losses: {losses} | Win %:{" "}
              {(wins + losses === 0
                ? 0
                : (wins / (wins + losses)) * 100
              ).toFixed(1)}
              %
            </h3>

            <img
                src={pics[Math.min(lifeLeft, pics.length - 1)]}
                alt="Hangman"
                style={{ width: "200px", marginTop: "20px", marginBottom: "30px" }}
            />


            <button onClick={this.startNewGame} style={{ marginTop: "20px" }}>
              New Game
            </button>

            <p style={{ fontSize: "30px", marginTop: "20px", letterSpacing: "10px" }}>
              {word
                .split("")
                .map((char) =>
                  this.state.correctLetters.includes(char.toLowerCase())
                    ? char.toUpperCase()
                    : "_"
                )
                .join(" ")}
            </p>

            <SingleLetterSearchBar onSearch={this.handleSearch} />

            <div style={{ marginTop: "20px" }}>{this.renderLetterButtons()}</div>
          </div>
        )}
      </div>
    );
  }
}

export default HangmanGame;
