import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import BatchDetail from "./BatchDetail";

export default function ViewBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    blockNumber: "",
    name: "",
    variety: "",
    subvariety: "",
  });
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    async function fetchBatches() {
      setLoading(true);
      try {
        const batchesCol = collection(db, "companyData/demo/demo/AppleSamples/batches");
        const batchesSnapshot = await getDocs(batchesCol);
        const batchesData = batchesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBatches(batchesData);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
      setLoading(false);
    }
    fetchBatches();
  }, []);

  const handleFilterChange = (field) => (e) => {
    setFilters(prev => ({ ...prev, [field]: e.target.value }));
  };

  const matchesFilter = (value, filter) =>
    value?.toString().toLowerCase().includes(filter.toLowerCase());

  const filteredBatches = batches.filter(batch => {
    return (
      matchesFilter(batch.blockNumber || "", filters.blockNumber) &&
      matchesFilter(batch.createdBy || "", filters.name) &&
      matchesFilter(batch.variety || "", filters.variety) &&
      matchesFilter(batch.subvariety || "", filters.subvariety)
    );
  });

  if (selectedBatch) {
    return (
      <div className="container">
        <button
          onClick={() => setSelectedBatch(null)}
          className="back-button"
        >
          ← Back to Batches
        </button>
        <BatchDetail batch={selectedBatch} />
        <style>{`
          .container {
            max-width: 600px;
            margin: 20px auto;
            color: white;
            font-family: Arial, sans-serif;
            padding: 0 10px;
          }
          .back-button {
            margin-bottom: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 6px 0;
          }
          .back-button:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>View Batches</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Block #"
          value={filters.blockNumber}
          onChange={handleFilterChange("blockNumber")}
          className="filter-input"
          autoComplete="off"
        />
        <input
          type="text"
          placeholder="Filter by Name"
          value={filters.name}
          onChange={handleFilterChange("name")}
          className="filter-input"
          autoComplete="off"
        />
        <input
          type="text"
          placeholder="Filter by Variety"
          value={filters.variety}
          onChange={handleFilterChange("variety")}
          className="filter-input"
          autoComplete="off"
        />
        <input
          type="text"
          placeholder="Filter by Subvariety"
          value={filters.subvariety}
          onChange={handleFilterChange("subvariety")}
          className="filter-input"
          autoComplete="off"
        />
      </div>

      {loading ? (
        <div className="loading">Loading batches...</div>
      ) : filteredBatches.length === 0 ? (
        <div className="no-results">No batches found</div>
      ) : (
        <div className="grid">
          {filteredBatches.map(batch => (
            <div
              key={batch.id}
              onClick={() => setSelectedBatch(batch)}
              className="batch-card"
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === "Enter") setSelectedBatch(batch); }}
            >
              <h2>{batch.variety || "No Variety"}</h2>
              <p><b>Block #:</b> {batch.blockNumber || "N/A"}</p>
              <p><b>Subvariety:</b> {batch.subvariety || "N/A"}</p>
              <p><b>Name:</b> {batch.createdBy || "N/A"}</p>
              <p><b>Samples:</b> {batch.samples?.length || 0}</p>
              <p><b>Created At:</b>{" "}
                {batch.createdAt?.toDate
                  ? batch.createdAt.toDate().toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .container {
          max-width: 600px;
          margin: 20px auto;
          width: 95%;
          color: white;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          padding: 0 10px;
        }
        h1 {
          text-align: center;
          margin-bottom: 24px;
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-bottom: 24px;
        }
        .filter-input {
          padding: 10px 12px;
          border-radius: 6px;
          border: 1px solid #555;
          background-color: #121212;
          color: white;
          font-size: 16px;
          min-width: 140px;
          flex-grow: 1;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }
        .filter-input:focus {
          outline: none;
          border-color: #646cff;
          background-color: #222;
        }
        .loading, .no-results {
          text-align: center;
          font-size: 18px;
          margin-top: 20px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }
        .batch-card {
          background-color: #1a1a1a;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 0 10px rgba(0,0,0,0.7);
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s ease;
        }
        .batch-card:hover,
        .batch-card:focus {
          background-color: #292929;
          outline: none;
        }
        .batch-card h2 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        .batch-card p {
          margin: 4px 0;
          font-size: 14px;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
