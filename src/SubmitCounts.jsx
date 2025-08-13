// SubmitCounts.jsx
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

const canopyOptions = ["Low / Bajo", "Moderate / Moderado", "High / Alto"];
const vigorOptions = ["Weak / Débil", "Normal / Normal"];

export default function SubmitCounts() {
  const [varieties, setVarieties] = useState([]);
  const [loadingVarieties, setLoadingVarieties] = useState(true);

  const [name, setName] = useState("");
  const [variety, setVariety] = useState("");
  const [subvariety, setSubvariety] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const [row, setRow] = useState("");
  const [tree, setTree] = useState("");
  const [canopyType, setCanopyType] = useState("");
  const [totalFruit, setTotalFruit] = useState("");
  const [vigor, setVigor] = useState("");

  const [countsQueue, setCountsQueue] = useState([]);

  useEffect(() => {
    async function fetchVarieties() {
      try {
        const docRef = doc(db, "companyData/demo/assets/presets", "presets");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.appleVarietiesPresets)) {
            setVarieties(data.appleVarietiesPresets);
          } else {
            setVarieties(["Honeycrisp", "Gala", "Fuji", "Granny Smith"]);
          }
        } else {
          setVarieties(["Honeycrisp", "Gala", "Fuji", "Granny Smith"]);
        }
      } catch {
        setVarieties(["Honeycrisp", "Gala", "Fuji", "Granny Smith"]);
      } finally {
        setLoadingVarieties(false);
      }
    }
    fetchVarieties();
  }, []);

  const addCountToQueue = () => {
    if (!name.trim() || !variety || !blockNumber.trim()) {
      alert("Please fill in Name, Variety, and Block Number.");
      return;
    }
    if (!row.trim() || !tree.trim() || !totalFruit.trim()) {
      alert("Please fill in Row, Tree, and Total Fruit.");
      return;
    }
    const totalFruitNum = parseInt(totalFruit, 10);
    if (isNaN(totalFruitNum)) {
      alert("Total Fruit must be a number.");
      return;
    }

    const newCount = {
      id: Date.now(),
      createdBy: name.trim(),
      variety,
      subvariety: subvariety.trim(),
      blockNumber: blockNumber.trim(),
      row: row.trim(),
      tree: tree.trim(),
      canopyType,
      totalFruit: totalFruitNum,
      vigor,
    };

    setCountsQueue((q) => [...q, newCount]);

    // Clear inputs except persistent fields (name, variety, subvariety, blockNumber)
    setRow("");
    setTree("");
    setCanopyType("");
    setTotalFruit("");
    setVigor("");
  };

  const removeCount = (id) => {
    setCountsQueue((q) => q.filter((count) => count.id !== id));
  };

  const submitCountsQueue = async () => {
    if (countsQueue.length === 0) {
      alert("No counts in queue to submit.");
      return;
    }

    try {
      const batchCollection = collection(db, "companyData/demo/demo/AppleCounts/counts");
      for (const count of countsQueue) {
        await addDoc(batchCollection, {
          createdAt: serverTimestamp(),
          createdBy: count.createdBy,
          variety: count.variety,
          subvariety: count.subvariety,
          blockNumber: count.blockNumber,
          row: count.row,
          tree: count.tree,
          canopyType: count.canopyType,
          totalFruit: count.totalFruit,
          vigor: count.vigor,
        });
      }
      alert("All counts submitted successfully!");
      setCountsQueue([]);
    } catch (e) {
      alert("Failed to submit counts: " + e.message);
    }
  };

  return (
    <div className="submit-counts-container">
      <h1>Submit Counts</h1>

      <label>
        Your Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </label>

      <label>
        Variety
        {loadingVarieties ? (
          <em>Loading varieties...</em>
        ) : (
          <select value={variety} onChange={(e) => setVariety(e.target.value)}>
            <option value="">Select variety</option>
            {varieties.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        )}
      </label>

      <label>
        Subvariety
        <input
          type="text"
          value={subvariety}
          onChange={(e) => setSubvariety(e.target.value)}
          placeholder="Enter subvariety"
        />
      </label>

      <label>
        Block Number
        <input
          type="text"
          value={blockNumber}
          onChange={(e) => setBlockNumber(e.target.value)}
          placeholder="Enter block number"
        />
      </label>

      <label>
        Row
        <input
          type="text"
          value={row}
          onChange={(e) => setRow(e.target.value)}
          placeholder="Enter row"
        />
      </label>

      <label>
        Tree
        <input
          type="text"
          value={tree}
          onChange={(e) => setTree(e.target.value)}
          placeholder="Enter tree"
        />
      </label>

      <label>
        Canopy Type
        <select value={canopyType} onChange={(e) => setCanopyType(e.target.value)}>
          <option value="">Select canopy type</option>
          {canopyOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <label>
        Total Fruit
        <input
          type="number"
          value={totalFruit}
          onChange={(e) => setTotalFruit(e.target.value)}
          placeholder="Enter total fruit"
          inputMode="numeric"
        />
      </label>

      <label>
        Vigor
        <select value={vigor} onChange={(e) => setVigor(e.target.value)}>
          <option value="">Select vigor</option>
          {vigorOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      <div className="button-group">
        <button onClick={addCountToQueue}>Add Count to Queue</button>
        <button onClick={submitCountsQueue} disabled={countsQueue.length === 0}>
          Submit All Counts
        </button>
      </div>

      <h2>Queued Counts</h2>
      {countsQueue.length === 0 && <p>No counts added yet.</p>}
      <ul className="counts-list">
        {countsQueue.map((count) => (
          <li key={count.id}>
            <span>
              Block: {count.blockNumber}, Variety: {count.variety}, Row: {count.row}, Tree: {count.tree}, Fruit: {count.totalFruit}, Vigor: {count.vigor}
            </span>
            <button onClick={() => removeCount(count.id)} className="delete-btn">
              Delete
            </button>
          </li>
        ))}
      </ul>

      <style>{`
        .submit-counts-container {
          max-width: 600px;
          margin: 40px auto;
          width: 95%;
          background-color: #1a1a1a;
          color: white;
          padding: 20px;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
        }
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 16px;
          font-weight: 600;
        }
        input[type="text"],
        input[type="number"],
        select {
          width: 100%;
          padding: 10px 12px;
          margin-top: 6px;
          border-radius: 6px;
          border: 1px solid #555;
          background-color: #222;
          color: white;
          font-size: 16px;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }
        input[type="text"]:focus,
        input[type="number"]:focus,
        select:focus {
          outline: none;
          border-color: #646cff;
          background-color: #2a2a2a;
        }
        .button-group {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        button {
          cursor: pointer;
          border-radius: 6px;
          border: none;
          font-weight: 700;
          padding: 12px 24px;
          font-size: 16px;
          transition: background-color 0.2s ease;
          min-width: 140px;
        }
        button:disabled {
          background-color: #444;
          cursor: not-allowed;
          color: #aaa;
        }
        button:not(:disabled) {
          background-color: #646cff;
          color: white;
        }
        button:not(:disabled):hover {
          background-color: #5058e6;
        }
        h2 {
          margin-top: 36px;
          margin-bottom: 16px;
          font-weight: 700;
          text-align: center;
        }
        .counts-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .counts-list li {
          background-color: #222;
          margin-bottom: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          word-break: break-word;
        }
        .counts-list li span {
          flex: 1 1 auto;
        }
        .delete-btn {
          background-color: #d9534f;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
          flex-shrink: 0;
          margin-left: 12px;
          transition: background-color 0.2s ease;
        }
        .delete-btn:hover {
          background-color: #c9302c;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .button-group {
            flex-direction: column;
            gap: 12px;
          }
          button {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
