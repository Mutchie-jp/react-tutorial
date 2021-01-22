import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = ({value, onClick, winLine}) => {
  return (
    <button className={winLine} onClick={onClick}>
      {value}
    </button>
  );
}

const Board = ({ squares, onClick, winLine}) => {
  const renderSquare = (i) => {
    return (
      <Square
        value={squares[i]}
        onClick={() => onClick(i)}
        winLine={winLine && winLine.includes(i) ? "square highlight" : "square"}
      />
    );
  };

  return (
    <div>
      {
        Array(3).fill(0).map((row, i) => {
          return <div className="board-row">
            {
              Array(3).fill(0).map((col, j) => {
                return renderSquare(i * 3 + j)
              })
            }
          </div>
        })
      }
    </div>
  );
}

const Game = () => {
  const [history, setHistory] = useState([{
    squares: Array(9).fill(null),
    clickedLocate: null,
    winLine: null,
  }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [ascending, setAscending] = useState(true);

  const handleClick = (i) => {
    const historyCurrent = history.slice(0, stepNumber + 1);
    const current = historyCurrent[historyCurrent.length - 1];
    const squares = [...current.squares];
    const clickedLocate = i;
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    setHistory([...historyCurrent, {squares, clickedLocate, winLine}]);
    setStepNumber(historyCurrent.length);
    setXIsNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0)
  };
 
  const current = history[stepNumber];
  const winLine = calculateWinner(current.squares).winLine || null
  const winner = calculateWinner(current.squares).winner;
  const moves = history.map((step, move) => {
    const col = Math.floor(step.clickedLocate / 3 + 1);
    const row = Math.ceil(step.clickedLocate % 3 + 1);
    const desc = move ?
      'Go to move #' + move + '(col: ' + col + ', row: ' + row + ')':
      'Go to game start';
    return (
      <li key={move}>
        <button className={move === stepNumber ? 'bold' : ''} onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (history.length === 10 && stepNumber === 9 && !winner){
    status = "draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={handleClick}
          winLine={winLine}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={() => setAscending(!ascending)}>{ascending ? "降順に切り替え" : "昇順に切り替え"}</button>
        <ol>{ascending ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
};

// ========================================

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winLine: lines[i]};
    }
  }
  return {winner: null, winLine: null};
}

ReactDOM.render(<Game />, document.getElementById("root"));