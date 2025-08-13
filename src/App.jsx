import React, { useState, useEffect } from "react";
import HomeScreen from "./HomeScreen";
import BulkSampleInput from "./BulkSampleInput";
import ViewBatches from "./ViewBatches";
import SubmitCounts from "./SubmitCounts"; // your SubmitCounts component
import { db, doc, getDoc } from "./firebase";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [appleVarieties, setAppleVarieties] = useState([]);

  useEffect(() => {
    async function fetchVarieties() {
      try {
        const docRef = doc(db, "companyData", "demo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const varieties =
            data.assets?.presets?.appleVarietiesPresets || [];
          setAppleVarieties(varieties);
        }
      } catch (e) {
        console.error("Error fetching apple varieties:", e);
      }
    }
    fetchVarieties();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        padding: 20,
      }}
    >
      {screen === "home" && <HomeScreen onNavigate={setScreen} />}

      {screen === "submitBatch" && (
        <>
          <button
            onClick={() => setScreen("home")}
            style={{ marginBottom: 20, color: "white" }}
          >
            ← Back to Home
          </button>
          <BulkSampleInput appleVarieties={appleVarieties} />
        </>
      )}

      {screen === "viewBatches" && (
        <>
          <button
            onClick={() => setScreen("home")}
            style={{ marginBottom: 20, color: "white" }}
          >
            ← Back to Home
          </button>
          <ViewBatches appleVarieties={appleVarieties} />
        </>
      )}

      {screen === "submitCounts" && (
        <>
          <button
            onClick={() => setScreen("home")}
            style={{ marginBottom: 20, color: "white" }}
          >
            ← Back to Home
          </button>
          <SubmitCounts appleVarieties={appleVarieties} />
        </>
      )}
    </div>
  );
}
