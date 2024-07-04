import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(square) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (square[a] && square[a] === square[b] && square[a] === square[c]) {
      return square[a];
    }
  }
  return null;
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [square, setSquare] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [countX, setCountX] = useState(0);
  const [countO, setCountO] = useState(0);

  useEffect(() => {
    if (winner) {
      setXIsNext(winner === "X");
      updateCount(winner);
    }
  }, [winner]);

  const updateCount = useCallback((winner) => {
    if (winner === "X") {
      setCountX((prevCount) => prevCount + 1);
    } else if (winner === "O") {
      setCountO((prevCount) => prevCount + 1);
    }
  }, []);

  const handleClick = useCallback(
    (i) => {
      if (square[i] || winner) {
        return;
      }
      const nextSquare = square.slice();
      nextSquare[i] = xIsNext ? "X" : "O";
      setSquare(nextSquare);
      setXIsNext(!xIsNext);

      const winnerPlayer = calculateWinner(nextSquare);
      if (winnerPlayer) {
        setWinner(winnerPlayer);
      }
    },
    [square, winner, xIsNext]
  );

  const handleClearBoard = useCallback(() => {
    setSquare(Array(9).fill(null));
    setWinner(null);
    setXIsNext(winner === "X" || winner === null);
  }, [winner]);

  const statusClassName = winner ? "status status-winner" : "status";
  const status = winner
    ? `GANADOR: ${winner}`
    : `Siguiente Jugador: ${xIsNext ? "X" : "O"}`;

  return (
    <section className="imagen">
      <div className={statusClassName}>{status}</div>
      <div className="board">
        {Array(3)
          .fill(null)
          .map((_, rowIndex) => (
            <div className="board-row" key={rowIndex}>
              {Array(3)
                .fill(null)
                .map((_, colIndex) => {
                  const index = rowIndex * 3 + colIndex;
                  return (
                    <Square
                      key={index}
                      value={square[index]}
                      onSquareClick={() => handleClick(index)}
                    />
                  );
                })}
            </div>
          ))}
      </div>
      <button className="clear-button" onClick={handleClearBoard}>
        Limpiar Tablero
      </button>
      <div className="counters">
        <div className="counter">
          <h1>Jugador X</h1>
          <p>Juegos ganados: {countX}</p>
        </div>
        <div className="counter">
          <h1>Jugador O</h1>
          <p>Juegos ganados: {countO}</p>
        </div>
      </div>
    </section>
  );
}
