import React from "react";

export default function HomeScreen({ onNavigate }) {
  return (
    <div
      style={{
        maxWidth: 900,
        minWidth: 320,
        width:"95%",
        margin: "80px auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
      }}
    >
      <h1 style={{ marginBottom: 40 }}>Canari</h1>

      <button
        onClick={() => onNavigate("submitBatch")}
        style={buttonStyle}
      >
        Submit Batch
      </button>

      <button
        onClick={() => onNavigate("viewBatches")}
        style={buttonStyle}
      >
        View Batches
      </button>

      <button
        onClick={() => onNavigate("submitCounts")}
        style={buttonStyle}
      >
        Submit Counts
      </button>
    </div>
  );
}

const buttonStyle = {
  display: "block",
  width: "100%",
  padding: "16px 0",
  marginBottom: 20,
  fontSize: 18,
  borderRadius: 8,
  backgroundColor: "#646cff",
  border: "none",
  cursor: "pointer",
  color: "white",
};
