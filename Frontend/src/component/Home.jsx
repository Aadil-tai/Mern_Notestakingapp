import React, { useState } from "react";


const CHAR_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const LockText = ({ text = "RAHUL" }) => {
    const [rolling, setRolling] = useState(false);
    const [letters, setLetters] = useState(text.split(""));

    const rollToTarget = () => {
        setRolling(true);
        text.split("").forEach((targetChar, i) => {
            const endIndex = CHAR_SET.indexOf(targetChar.toUpperCase());
            let pos = 0;
            const interval = setInterval(() => {
                setLetters((prev) => {
                    const updated = [...prev];
                    updated[i] = CHAR_SET[pos % CHAR_SET.length];
                    return updated;
                });
                pos++;
                if (pos > endIndex + CHAR_SET.length * 2) {
                    // Stop after 2 full cycles + landing
                    clearInterval(interval);
                    setLetters((prev) => {
                        const updated = [...prev];
                        updated[i] = targetChar;
                        return updated;
                    });
                }
            }, 30 + i * 5); // small staggered delay
        });
    };

    return (
        <div
            className="flex gap-1 text-4xl font-mono font-bold cursor-pointer"
            onMouseEnter={rollToTarget}
        >
            {letters.map((char, i) => (
                <span key={i} className="letter-spin">
                    {char}
                </span>
            ))}
        </div>
    );
};

export default LockText;
