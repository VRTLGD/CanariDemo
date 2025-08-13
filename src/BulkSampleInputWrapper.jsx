import React, { useEffect, useState } from "react";
import BulkSampleInput from "./BulkSampleInput";
import { db, doc, getDoc } from "./firebase";

export default function BulkSampleInputWrapper() {
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVarieties() {
      try {
        // Firestore doc path: companyData/demo/assets/presets
        const docRef = doc(db, "companyData", "demo", "assets", "presets");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.appleVarietiesPresets && Array.isArray(data.appleVarietiesPresets)) {
            setVarieties(data.appleVarietiesPresets);
          } else {
            console.warn("appleVarietiesPresets field missing or not array");
          }
        } else {
          console.warn("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching apple varieties:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVarieties();
  }, []);

  if (loading) {
    return <div style={{textAlign:"center", marginTop:"2rem"}}>Loading apple varieties...</div>;
  }

  return <BulkSampleInput varieties={varieties} />;
}
