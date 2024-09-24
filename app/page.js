// app/page.js
'use client';

import React, { useState } from 'react';
import MapComponent from './components/Map';

export default function Home() {
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleCoordinatesSelect = (coords) => {
    console.log('Coordinates from Parent:', coords);
    setSelectedCoords(coords);
    // You can perform additional actions here, such as sending the coordinates to your backend
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Interactive Street View Selector</h1>
      <MapComponent onCoordinatesSelect={handleCoordinatesSelect} />
      {selectedCoords && (
        <div className="mt-4 p-4 bg-white rounded shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">Selected Coordinates:</h2>
          <p>Latitude: {selectedCoords.lat}</p>
          <p>Longitude: {selectedCoords.lng}</p>
        </div>
      )}
    </div>
  );
}
