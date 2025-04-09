import React from "react";
import './DiceD20.css';

function DiceD20({ rolledValue}) {
    return (
        <div className="dice-wrapper">
            <svg
                className="dice"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <polygon
                    points="50,5 95,30 95,70 50,95 5,70 5,30"
                    fill="#7f1d1d"
                    stroke="#fff"
                    strokeWidth="2"
                />
                <text
                    x="50%"
                    y="55%"
                    textAnchor="middle"
                    fill="white"
                    fontSize="24"
                    fontWeight="bold"
                    dominantBaseline="middle"
                >
                    {rolledValue}
                </text>
            </svg>
        </div>
    );
}

export default DiceD20;