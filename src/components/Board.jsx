import React from "react";
import Cell from "./Cell";

const Board = ({ snake, food, gridSize }) => {
    const cells = [];
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            let type = "empty";
            if (snake.some((seg, i) => seg.x === x && seg.y === y)) {
                type = snake[0].x === x && snake[0].y === y ? "head" : "snake";
            }
            if (food.x === x && food.y === y) type = "food";
            cells.push(<Cell key={`${x}-${y}`} type={type} />);
        }
    }

    return <div className="board">{cells}</div>;
};

export default Board;
