import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

const SAMPLE_COUNT = 10;

const emptyAppleSample = {
  isExposed: false,
  isInternal: false,
  isSplit: false,
  row: "",
  weightInGrams: "",
  colorPercentage: "",
  backgroundColorPercentage: "",
  pressure1: "",
  pressure2: "",
  brix: "",
  starch: "",
};

const aspects = [
  {
    key: "isExposed",
    label: "Is Exposed",
    type: "checkbox",
    group: "single",
  },
  {
    key: "isInternalAndSplit",
    label: "Internal and Split",
    type: "checkbox-group",
    group: "double",
  },
  {
    key: "row",
    label: "Row",
    type: "text",
    group: "single",
  },
  {
    key: "weightInGrams",
    label: "Weight (g)",
    type: "number",
    group: "single",
  },
  {
    key: "colorPercentage",
    label: "Color %",
    type: "number",
    group: "single",
  },
  {
    key: "backgroundColorPercentage",
    label: "Background Color %",
    type: "number",
    group: "single",
  },
  {
    key: "pressure",
    label: "Pressure 1 & 2",
    type: "pressure",
    group: "double",
  },
  {
    key: "brix",
    label: "Brix",
    type: "number",
    group: "single",
  },
  {
    key: "starch",
    label: "Starch",
    type: "number",
    group: "single",
  },
];

// Reusable container style for all main screens
const containerStyle = {
  maxWidth: 900,
  minWidth: 320,
  width: "95%",
  margin: "40px auto",
  backgroundColor: "#1a1a1a",
  color: "white",
  padding: 20,
  borderRadius: 8,
  fontFamily: "Arial, sans-serif",
  boxSizing: "border-box",
};

const inputStyle = {
  fontSize: 16, // Fixes mobile zoom on input focus
  flexGrow: 1,
  maxWidth: 120,
  padding: 6,
  borderRadius: 4,
  border: "1px solid #555",
  backgroundColor: "#222",
  color: "white",
  marginTop: 4,
};

export default function BulkSampleInput() {
  const [name, setName] = useState("");
  const [varieties, setVarieties] = useState([]);
  const [variety, setVariety] = useState("");
  const [subvariety, setSubvariety] = useState("");
  const [blockNumber, setBlockNumber] = useState("");
  const [loadingVarieties, setLoadingVarieties] = useState(true);

  const [appleSamples, setAppleSamples] = useState(
    Array(SAMPLE_COUNT)
      .fill()
      .map(() => ({ ...emptyAppleSample }))
  );

  const [step, setStep] = useState(0);
  const [selectedAppleIndex, setSelectedAppleIndex] = useState(null);

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

  const updateAppleField = (index, field, value) => {
    setAppleSamples((samples) => {
      const copy = [...samples];
      const apple = { ...copy[index] };
      if (field === "isInternalAndSplit") {
        apple.isInternal = value.isInternal;
        apple.isSplit = value.isSplit;
      } else if (field === "pressure") {
        apple.pressure1 = value.pressure1;
        apple.pressure2 = value.pressure2;
      } else {
        apple[field] = value;
      }
      copy[index] = apple;
      return copy;
    });
  };

  const appleHasData = (apple) => {
  // Only consider numeric or text fields that actually matter
  return (
    (apple.row && apple.row.trim() !== "") ||
    (apple.weightInGrams && apple.weightInGrams !== "") ||
    (apple.colorPercentage && apple.colorPercentage !== "") ||
    (apple.backgroundColorPercentage && apple.backgroundColorPercentage !== "") ||
    (apple.pressure1 && apple.pressure1 !== "") ||
    (apple.pressure2 && apple.pressure2 !== "") ||
    (apple.brix && apple.brix !== "") ||
    (apple.starch && apple.starch !== "")
  );
};


  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    if (!variety) {
      alert("Please select an apple variety.");
      return;
    }
    if (!blockNumber.trim()) {
      alert("Please enter a block number.");
      return;
    }

    const filteredSamples = appleSamples
      .map((apple, idx) => ({ ...apple, sampleNumber: idx + 1 }))
      .filter(appleHasData)
      .map((apple) => ({
        sampleNumber: apple.sampleNumber,
        isExposed: !!apple.isExposed,
        isInternal: !!apple.isInternal,
        isSplit: !!apple.isSplit,
        row: apple.row || "",
        size: apple.weightInGrams || "",
        colorPercentage: apple.colorPercentage || "",
        backgroundColorPercentage: apple.backgroundColorPercentage || "",
        pressure1: apple.pressure1 || "",
        pressure2: apple.pressure2 || "",
        brix: apple.brix || "",
        starch: apple.starch || "",
        medida: apple.weightInGrams || "",
        subvariety: subvariety || "",
        variety: variety,
      }));

    if (filteredSamples.length === 0) {
      alert("Please enter data for at least one apple.");
      return;
    }

    try {
      await addDoc(collection(db, "companyData/demo/demo/AppleSamples/batches"), {
        createdAt: serverTimestamp(),
        createdBy: name.trim(),
        blockNumber: blockNumber.trim(),
        variety,
        subvariety: subvariety.trim(),
        samples: filteredSamples,
      });
      alert("Batch submitted successfully!");
      setName("");
      setVariety("");
      setSubvariety("");
      setBlockNumber("");
      setAppleSamples(Array(SAMPLE_COUNT).fill().map(() => ({ ...emptyAppleSample })));
      setStep(0);
      setSelectedAppleIndex(null);
    } catch (e) {
      alert("Failed to submit batch: " + e.message);
    }
  };

  const renderCurrentAspectInputs = () => {
    const aspectIndex = step - 1;
    if (aspectIndex < 0 || aspectIndex >= aspects.length) return null;
    const aspect = aspects[aspectIndex];

    switch (aspect.key) {
      case "isExposed":
        return appleSamples.map((apple, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <label>
              Apple {i + 1}:&nbsp;
              <input
                type="checkbox"
                checked={apple.isExposed}
                onChange={(e) =>
                  updateAppleField(i, "isExposed", e.target.checked)
                }
                style={{ cursor: "pointer", fontSize: 16 }}
              />
            </label>
          </div>
        ));

      case "isInternalAndSplit":
        return appleSamples.map((apple, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <span>Apple {i + 1}:&nbsp;</span>
            <label style={{ marginRight: 12 }}>
              Internal&nbsp;
              <input
                type="checkbox"
                checked={apple.isInternal}
                onChange={(e) =>
                  updateAppleField(i, "isInternalAndSplit", {
                    isInternal: e.target.checked,
                    isSplit: apple.isSplit,
                  })
                }
                style={{ cursor: "pointer", fontSize: 16 }}
              />
            </label>
            <label>
              Split&nbsp;
              <input
                type="checkbox"
                checked={apple.isSplit}
                onChange={(e) =>
                  updateAppleField(i, "isInternalAndSplit", {
                    isInternal: apple.isInternal,
                    isSplit: e.target.checked,
                  })
                }
                style={{ cursor: "pointer", fontSize: 16 }}
              />
            </label>
          </div>
        ));

      case "pressure":
        return appleSamples.map((apple, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              display: "flex",
              gap: 12,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ minWidth: 80 }}>Apple {i + 1}:</span>
            <label style={{ flexGrow: 1 }}>
              Pressure 1&nbsp;
              <input
                type="number"
                value={apple.pressure1}
                onChange={(e) =>
                  updateAppleField(i, "pressure", {
                    pressure1: e.target.value,
                    pressure2: apple.pressure2,
                  })
                }
                style={inputStyle}
              />
            </label>
            <label style={{ flexGrow: 1 }}>
              Pressure 2&nbsp;
              <input
                type="number"
                value={apple.pressure2}
                onChange={(e) =>
                  updateAppleField(i, "pressure", {
                    pressure1: apple.pressure1,
                    pressure2: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </label>
          </div>
        ));

      default:
        return appleSamples.map((apple, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ minWidth: 80 }}>Apple {i + 1}:</span>
              <input
                type={aspect.type}
                value={apple[aspect.key] || ""}
                onChange={(e) =>
                  updateAppleField(i, aspect.key, e.target.value)
                }
                style={inputStyle}
              />
            </label>
          </div>
        ));
    }
  };

  const renderReviewGrid = () => (
    <div style={containerStyle}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        Review Apple Samples
      </h1>

      <p style={{ textAlign: "center", marginBottom: 20 }}>
        Batch: <b>{variety}</b> | Subvariety: <b>{subvariety || "N/A"}</b> | Block:{" "}
        <b>{blockNumber}</b> | Entered by: <b>{name}</b>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 16,
        }}
      >
        {appleSamples.map((_, i) => (
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

      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <button
          onClick={() => setStep(1)}
          style={{
            flexGrow: 1,
            minWidth: 120,
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
            backgroundColor: "#555",
            border: "none",
            color: "white",
          }}
        >
          Back to Trait Input
        </button>

        <button
          onClick={handleSubmit}
          style={{
            flexGrow: 1,
            minWidth: 120,
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
            backgroundColor: "#646cff",
            border: "none",
            color: "white",
          }}
        >
          Upload Batch
        </button>
      </div>

      {/* Detail modal */}
      {selectedAppleIndex !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 16,
            boxSizing: "border-box",
          }}
          onClick={() => setSelectedAppleIndex(null)}
        >
          <div
            style={{
              backgroundColor: "#222",
              padding: 20,
              borderRadius: 8,
              maxWidth: 900,
              width: "90%",
              color: "white",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Apple {selectedAppleIndex + 1} Details</h2>

            {Object.keys(emptyAppleSample).map((key) => {
              if (typeof emptyAppleSample[key] === "boolean") {
                return (
                  <label key={key} style={{ display: "block", marginBottom: 8 }}>
                    <input
                      type="checkbox"
                      checked={appleSamples[selectedAppleIndex][key]}
                      onChange={(e) =>
                        updateAppleField(selectedAppleIndex, key, e.target.checked)
                      }
                      style={{ cursor: "pointer", fontSize: 16 }}
                    />{" "}
                    {key}
                  </label>
                );
              }

              return (
                <label key={key} style={{ display: "block", marginBottom: 8 }}>
                  {key}
                  <input
                    type={
                      key.toLowerCase().includes("weight") ||
                      key.toLowerCase().includes("pressure") ||
                      key.toLowerCase().includes("brix") ||
                      key.toLowerCase().includes("starch") ||
                      key.toLowerCase().includes("percentage")
                        ? "number"
                        : "text"
                    }
                    value={appleSamples[selectedAppleIndex][key] || ""}
                    onChange={(e) =>
                      updateAppleField(selectedAppleIndex, key, e.target.value)
                    }
                    style={{
                      fontSize: 16,
                      width: "100%",
                      marginTop: 4,
                      padding: 6,
                      borderRadius: 4,
                      border: "1px solid #555",
                      backgroundColor: "#111",
                      color: "white",
                    }}
                  />
                </label>
              );
            })}

            <div style={{ marginTop: 20, textAlign: "right" }}>
              <button
                onClick={() => setSelectedAppleIndex(null)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  cursor: "pointer",
                  backgroundColor: "#646cff",
                  border: "none",
                  color: "white",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (step === 0) {
    return (
      <div style={containerStyle}>
        <h1 style={{ textAlign: "center", marginBottom: 20 }}>Batch Info</h1>

        <label style={{ display: "block", marginBottom: 12 }}>
          Your Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            placeholder="Your name"
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Apple Variety
          <br />
          {loadingVarieties ? (
            <em>Loading varieties...</em>
          ) : (
            <select
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              style={{
                fontSize: 16,
                width: "100%",
                padding: 8,
                marginTop: 4,
                borderRadius: 4,
                border: "1px solid #555",
                backgroundColor: "#222",
                color: "white",
              }}
            >
              <option value="">Select variety</option>
              {varieties.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          )}
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Subvariety
          <input
            type="text"
            value={subvariety}
            onChange={(e) => setSubvariety(e.target.value)}
            style={inputStyle}
            placeholder="Subvariety"
          />
        </label>

        <label style={{ display: "block", marginBottom: 20 }}>
          Block Number
          <input
            type="text"
            value={blockNumber}
            onChange={(e) => setBlockNumber(e.target.value)}
            style={inputStyle}
            placeholder="Block number"
          />
        </label>

        <button
          onClick={() => setStep(1)}
          disabled={!name.trim() || !variety || !blockNumber.trim()}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 6,
            backgroundColor:
              !name.trim() || !variety || !blockNumber.trim()
                ? "#444"
                : "#646cff",
            border: "none",
            color: "white",
            cursor:
              !name.trim() || !variety || !blockNumber.trim()
                ? "not-allowed"
                : "pointer",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Next: Input Apple Traits
        </button>
      </div>
    );
  }

  if (step >= 1 && step <= aspects.length) {
    const aspectIndex = step - 1;
    const aspect = aspects[aspectIndex];
    return (
      <div style={containerStyle}>
        <h1 style={{ textAlign: "center" }}>{aspect.label}</h1>
        <div style={{ marginTop: 20 }}>{renderCurrentAspectInputs()}</div>
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            style={{
              flexGrow: 1,
              minWidth: 120,
              padding: "10px 20px",
              borderRadius: 6,
              cursor: step === 1 ? "not-allowed" : "pointer",
              backgroundColor: step === 1 ? "#444" : "#555",
              border: "none",
              color: "white",
              fontSize: 16,
            }}
          >
            Back
          </button>

          <button
            onClick={() => setStep(step + 1)}
            style={{
              flexGrow: 1,
              minWidth: 120,
              padding: "10px 20px",
              borderRadius: 6,
              cursor: "pointer",
              backgroundColor: "#646cff",
              border: "none",
              color: "white",
              fontSize: 16,
            }}
          >
            {step === aspects.length ? "Review Samples" : "Next"}
          </button>
        </div>
      </div>
    );
  }

  if (step === aspects.length + 1) {
    return renderReviewGrid();
  }

  return null;
}
