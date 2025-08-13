import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function ReviewGrid() {
  const location = useLocation();
  const { batchId, batchData } = location.state || {};
  const [samples, setSamples] = useState(batchData?.samples || []);

  const handleSampleChange = (index, field, value) => {
    const updated = [...samples];
    updated[index][field] = value;
    setSamples(updated);
  };

  const handleSave = async () => {
    if (!batchId) {
      alert("Batch ID missing");
      return;
    }
    const batchRef = doc(db, "companyData/demo/demo/AppleSamples/batches", batchId);
    try {
      await updateDoc(batchRef, { samples });
      alert("Batch updated!");
    } catch (e) {
      alert("Error updating batch: " + e.message);
    }
  };

  if (!batchData) return <p style={{ padding: 20, textAlign: "center" }}>No batch data found.</p>;

  return (
    <div
      style={{
        maxWidth: 600,
        width: "95%",
        margin: "20px auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        color: "#222",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Review Batch</h1>
      <p style={{ textAlign: "center", marginBottom: 30, fontWeight: "bold" }}>
        Variety: <span>{batchData.variety || "N/A"}</span> | Subvariety:{" "}
        <span>{batchData.subvariety || "N/A"}</span> | Block:{" "}
        <span>{batchData.blockNumber || "N/A"}</span>
      </p>

      <div className="review-grid-container">
        {samples.map((sample, idx) => (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: 12 }}>Sample {sample.sampleNumber}</h4>

            <label style={{ display: "block", marginBottom: 8 }}>
              Size:
              <input
                type="number"
                value={sample.size || ""}
                onChange={(e) =>
                  handleSampleChange(idx, "size", e.target.value === "" ? "" : Number(e.target.value))
                }
                style={{
                  width: "100%",
                  padding: 8,
                  fontSize: 16,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  marginTop: 4,
                }}
                inputMode="numeric"
              />
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
              Brix:
              <input
                type="number"
                value={sample.brix || ""}
                onChange={(e) =>
                  handleSampleChange(idx, "brix", e.target.value === "" ? "" : Number(e.target.value))
                }
                style={{
                  width: "100%",
                  padding: 8,
                  fontSize: 16,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  marginTop: 4,
                }}
                inputMode="numeric"
              />
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: 30,
          width: "100%",
          padding: "14px 0",
          fontSize: 18,
          fontWeight: "bold",
          backgroundColor: "#646cff",
          border: "none",
          borderRadius: 8,
          color: "white",
          cursor: "pointer",
        }}
      >
        Save Batch
      </button>

      <style>{`
        .review-grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 600px) {
          .review-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
