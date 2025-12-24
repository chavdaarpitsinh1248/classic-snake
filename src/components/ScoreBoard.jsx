import React from "react";

const ScoreBoard = ({ score, highScore }) => (
    <div className="scoreboard">
        <div>Score: {score}</div>
        <div>High Score: {highScore.current}</div>
    </div>
);

export default ScoreBoard;
