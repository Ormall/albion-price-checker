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

export default function App() {
  const [itemId, setItemId] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const locations = CITIES.join(",");
      const response = await fetch(
        `https://www.albion-online-data.com/api/v2/stats/prices/${itemId}?locations=${locations}`
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
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter item ID (e.g. T4_Claymore@1)"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        />
        <Button onClick={fetchPrices} disabled={loading}>
          {loading ? "Loading..." : "Check Prices"}
        </Button>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {data.map((entry) => (
          <Card key={`${entry.city}-${entry.item_id}`}>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{entry.city}</h2>
              <p><strong>Sell Price Min:</strong> {entry.sell_price_min}</p>
              <p><strong>Sell Price Max:</strong> {entry.sell_price_max}</p>
              <p><strong>Buy Price Min:</strong> {entry.buy_price_min}</p>
              <p><strong>Buy Price Max:</strong> {entry.buy_price_max}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}