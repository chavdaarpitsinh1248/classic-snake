import React from "react";

const Cell = ({ type }) => (
    <div className={`cell ${type}`}></div>
);

export default React.memo(Cell);
