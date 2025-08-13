import React, { useState } from "react";

export default function BatchDetail({ batch }) {
  const [selectedAppleIndex, setSelectedAppleIndex] = useState(null);

  if (!batch) return null;

  const apples = batch.samples || [];

  if (selectedAppleIndex !== null) {
    const apple = apples[selectedAppleIndex];

    return (
      <div
        style={{
          maxWidth: 900,
          width: "95%",
          margin: "40px auto",
          backgroundColor: "#1a1a1a",
          color: "white",
          padding: 20,
          borderRadius: 8,
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>
          Apple {selectedAppleIndex + 1} Details
        </h1>

        {apple ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>
              Is Exposed: <input type="checkbox" checked={apple.isExposed} readOnly />
            </label>
            <label>
              Is Internal: <input type="checkbox" checked={apple.isInternal} readOnly />
            </label>
            <label>
              Is Split: <input type="checkbox" checked={apple.isSplit} readOnly />
            </label>
            <label>Row: {apple.row || "N/A"}</label>
            <label>Weight (g): {apple.weightInGrams || apple.medida || "N/A"}</label>
            <label>Color %: {apple.colorPercentage || "N/A"}</label>
            <label>Background Color %: {apple.backgroundColorPercentage || "N/A"}</label>
            <label>Pressure 1: {apple.pressure1 || "N/A"}</label>
            <label>Pressure 2: {apple.pressure2 || "N/A"}</label>
            <label>Brix: {apple.brix || "N/A"}</label>
            <label>Starch: {apple.starch || "N/A"}</label>
            <label>Sample Number: {apple.sampleNumber || "N/A"}</label>
            <label>Size: {apple.size || "N/A"}</label>
          </div>
        ) : (
          <p>No data available</p>
        )}

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            onClick={() => setSelectedAppleIndex(null)}
            style={{ padding: "8px 16px" }}
          >
            Back to Batch
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Batch: {batch.variety || "No Variety"}</h2>
      <h3 style={{ textAlign: "center" }}>Click an Apple to view details</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",  // <-- Changed here
          gap: 12,
          maxWidth: 600,
          margin: "20px auto",
        }}
      >
        {apples.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedAppleIndex(i)}
            style={{
              backgroundColor: "#333",
              color: "white",
              padding: 20,
              borderRadius: 8,
              cursor: "pointer",
              border: "none",
              fontWeight: "bold",
              fontSize: "1.1em",
            }}
          >
            Apple {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
