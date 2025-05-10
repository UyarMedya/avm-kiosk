import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const floors = ["B2 Otopark", "B1 Otopark", "Zemin Kat", "1. Kat", "2. Kat"];
const storesPerFloor = 20;
const escalators = [
  { name: "Yürüyen Merdiven A", location: "Sol Orta", x: 200, y: 200 },
  { name: "Yürüyen Merdiven B", location: "Sağ Orta", x: 400, y: 200 }
];
const entrances = [
  { name: "Ana Giriş", location: "Zemin Kat - Kuzey" },
  { name: "Yan Giriş", location: "Zemin Kat - Güney" }
];
const parkingEntrances = [
  { name: "Otopark Girişi A", location: "B2 - Doğu" },
  { name: "Otopark Girişi B", location: "B1 - Batı" }
];

const storeCoordinates = {
  "Zemin Kat": {
    "Mağaza 1": { x: 100, y: 100 },
    "Mağaza 2": { x: 200, y: 120 },
    "Mağaza 3": { x: 300, y: 180 }
  },
  "1. Kat": {
    "Mağaza 21": { x: 150, y: 200 },
    "Mağaza 22": { x: 250, y: 240 }
  }
};

const entranceCoord = { x: 50, y: 250 };

export default function AVMNavigator() {
  const [selectedFloor, setSelectedFloor] = useState("Zemin Kat");
  const [selectedStore, setSelectedStore] = useState(null);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
  };

  const getCoordinates = () => {
    return storeCoordinates[selectedFloor]?.[selectedStore] || null;
  };

  const getRoute = () => {
    const dest = getCoordinates();
    if (!dest) return [];
    const steps = [entranceCoord];
    if (selectedFloor !== "Zemin Kat") {
      steps.push(escalators[0]);
    }
    steps.push(dest);
    return steps.map((pt) => `${pt.x},${pt.y}`).join(" ");
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Kat Seçimi</h1>
        <div className="grid grid-cols-3 gap-2">
          {floors.map((floor) => (
            <Button
              key={floor}
              variant={selectedFloor === floor ? "default" : "outline"}
              onClick={() => {
                setSelectedFloor(floor);
                setSelectedStore(null);
              }}
            >
              {floor}
            </Button>
          ))}
        </div>
        <h2 className="text-xl font-semibold mt-4">Mağazalar ({selectedFloor})</h2>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: storesPerFloor }, (_, i) => {
            const storeName = `Mağaza ${i + 1 + floors.indexOf(selectedFloor) * storesPerFloor}`;
            return (
              <Button
                key={i}
                onClick={() => handleStoreSelect(storeName)}
                variant="secondary"
              >
                M{i + 1}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Kat Planı Önizleme</h1>
        <Card className="p-4 relative min-h-[300px]">
          <CardContent className="space-y-4 relative">
            <div className="relative">
              <img
                src="/kiosk.png"
                alt="AVM Kat Planı"
                className="w-full h-auto rounded-xl shadow"
              />
              {selectedStore && getCoordinates() && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg z-10"
                    style={{
                      top: getCoordinates().y,
                      left: getCoordinates().x,
                      transform: 'translate(-50%, -50%)',
                      position: 'absolute'
                    }}
                  />

                  <motion.div
                    className="absolute w-4 h-4 bg-blue-600 rounded-full border border-white z-10"
                    style={{
                      top: entranceCoord.y,
                      left: entranceCoord.x,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />

                  {selectedFloor !== "Zemin Kat" && (
                    <motion.div
                      className="absolute w-4 h-4 bg-green-600 rounded-full border border-white z-10"
                      style={{
                        top: escalators[0].y,
                        left: escalators[0].x,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  )}

                  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <polyline
                      points={getRoute()}
                      fill="none"
                      stroke="orange"
                      strokeWidth="4"
                      strokeDasharray="8,4"
                    />
                  </svg>
                </>
              )}
            </div>

            {selectedStore ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <p className="text-lg font-semibold">{selectedStore}</p>
                <p>Kat: {selectedFloor}</p>
                <p>Yönlendirme: {escaltorPath()}</p>
              </motion.div>
            ) : (
              <p>Bir mağaza seçin.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Card>
            <CardContent className="p-2">
              <h3 className="font-semibold">Yürüyen Merdivenler</h3>
              <ul className="list-disc pl-4">
                {escalators.map((e) => (
                  <li key={e.name}>{e.name} - {e.location}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2">
              <h3 className="font-semibold">Giriş Kapıları</h3>
              <ul className="list-disc pl-4">
                {entrances.map((e) => (
                  <li key={e.name}>{e.name} - {e.location}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2">
              <h3 className="font-semibold">Otopark Girişleri</h3>
              <ul className="list-disc pl-4">
                {parkingEntrances.map((e) => (
                  <li key={e.name}>{e.name} - {e.location}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  function escaltorPath() {
    if (selectedFloor.includes("Otopark")) {
      return "En yakın otopark girişi ve yürüyen merdiven kullanılarak zemin kata çıkılabilir.";
    }
    if (selectedFloor === "Zemin Kat") {
      return "Ana girişlerden yürüyerek ulaşım sağlanabilir.";
    }
    return "Zemin kattan yürüyen merdiven ile çıkılabilir.";
  }
}
