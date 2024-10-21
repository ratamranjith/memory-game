import { useEffect, useState } from "react";

const MainPanel = () => {
  const [grids, setGrids] = useState(2); // Default to a valid number

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(30);
  const [won, setWon] = useState(false);

  // Function to create grid boxes based on the input value
  const createGridBoxes = (e) => {
    const value = e.target.value;
    const newGridCount = value === "" ? "" : parseInt(value);

    if (newGridCount === "" || (newGridCount >= 2 && newGridCount <= 10)) {
      setGrids(newGridCount);
    } else {
      setGrids(2);
    }
  };

  useEffect(() => {
    if (time > 0) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      // Cleanup function to clear the interval
      return () => clearInterval(intervalId);
    } else {
      setWon(false);
    }
  }, [time]);

  const initializeGame = () => {
    const totalCards = grids * grids;

    // Generate pairs and one extra card
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    console.log(numbers);

    // Create shuffled cards array with an extra card if needed
    const shuffledCards = [...numbers, ...numbers];

    // Add one extra card if totalCards is odd
    if (totalCards % 2 === 1) {
      shuffledCards.push(pairCount + 1); // Add a unique extra card
    }

    // Shuffle the cards
    const finalCards = shuffledCards
      .sort(() => Math.random() - 0.5)
      .map((number, index) => ({ id: index, number }));

    setCards(finalCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
  };

  useEffect(() => {
    if (grids > 0) {
      initializeGame();
    }
  }, [grids]);

  const handleClick = (id) => {
    if (disabled || won) return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
        setCount(count + 1);
      }, 1000);
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-black">{time}</div>
        <div>
          <input
            type="number"
            min={2}
            max={10}
            value={grids}
            className="border border-gray-600 rounded-md"
            onChange={createGridBoxes}
            placeholder="Enter number of grids"
          />
        </div>
        <div
          className="grid gap-2 mb-4"
          style={{
            gridTemplateColumns: `repeat(${grids}, minmax(0, 1fr))`,
            width: `min(100%, ${grids * 5.5}rem)`,
          }}
        >
          {console.log(cards)}
          {cards?.map((card) => (
            <div
              key={card.id}
              className={`bg-blue-200 aspect-square cursor-pointer transition-all rounded m-2 flex items-center justify-center ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-400"
                    : "bg-blue-400"
                  : "bg-gray-400 "
              }`}
              onClick={() => handleClick(card.id)}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          ))}
        </div>

        <div>
          {won && (
            <div
              className={`mt-4 text-4xl font-bold animate-bounce ${
                won ? " text-green-500" : "text-red-500"
              }`}
              onClick={initializeGame}
            >
              {won ? "You Won" : "Try Again"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainPanel;
