import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CITIES = [
  "Bridgewatch",
  "Lymhurst",
  "Martlock",
  "Fort Sterling",
  "Thetford",
  "Caerleon",
  "BlackMarket",
];

// List of items with labels and actual Albion item IDs
const ITEM_OPTIONS = [
  { label: "Arctic Staff (T4.3)", id: "T4_MAIN_FROSTCRYSTALSTAFF@3" },
  { label: "Claymore (T4.1)", id: "T4_CLAYMORE@1" },
  { label: "Black Hands (T8)", id: "T8_MAIN_DAGGERPAIR" },
  { label: "Great Nature Staff (T6)", id: "T6_MAIN_NATURESTAFF" },
  { label: "Custom (manual input)", id: "" },
];

export default function AlbionPriceChecker() {
  const [itemId, setItemId] = useState("");
  const [selectedOption, setSelectedOption] = useState(ITEM_OPTIONS[0].id);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDropdownChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    if (selected !== "") {
      setItemId(selected);
    } else {
      setItemId(""); // Allow manual input
    }
  };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const locations = CITIES.join(",");
      const response = await fetch(
        `https://www.albion-online-data.com/api/v2/stats/prices/${itemId}?locations=${locations}&qualities=3`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setData([]);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Albion Online Price Checker</h1>

      {/* Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Select an item:</label>
        <select
          value={selectedOption}
          onChange={handleDropdownChange}
          className="w-full border rounded px-3 py-2"
        >
          {ITEM_OPTIONS.map((item) => (
            <option key={item.id || "custom"} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Input field (optional) */}
      {selectedOption === "" && (
        <div className="mb-4">
          <Input
            placeholder="Enter custom item ID (e.g. T4_MAIN_FROSTCRYSTALSTAFF@3)"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          />
        </div>
      )}

      <Button onClick={fetchPrices} disabled={loading}>
        {loading ? "Loading..." : "Check Prices"}
      </Button>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-6">
        {data.map((entry) => (
          <Card key={`${entry.city}-${entry.item_id}`}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{entry.city}</h2>
              <p>
                <strong>Sell Price Min:</strong> {entry.sell_price_min}
              </p>
              <p>
                <strong>Sell Price Max:</strong> {entry.sell_price_max}
              </p>
              <p>
                <strong>Buy Price Min:</strong> {entry.buy_price_min}
              </p>
              <p>
                <strong>Buy Price Max:</strong> {entry.buy_price_max}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
