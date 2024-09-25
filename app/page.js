// app/page.js
'use client';

import React, { useState } from 'react';
import MapComponent from './components/Map';

export default function Home() {
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleCoordinatesSelect = (coords) => {
    console.log('Coordinates from Parent:', coords);
    setSelectedCoords(coords);
    // Additional actions can be performed here, such as sending the coordinates to your backend
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 to-purple-200 p-6">
      <h1 className="text-5xl font-bold mb-8 text-gray-800">Interactive Street View Selector</h1>
      <div className="w-full max-w-4xl">
        <MapComponent onCoordinatesSelect={handleCoordinatesSelect} />
      </div>
      {selectedCoords && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-md w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Selected Coordinates:</h2>
          <p className="text-lg text-gray-700">
            <span className="font-medium text-black">Latitude:</span> {selectedCoords.lat}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-medium text-black">Longitude:</span> {selectedCoords.lng}
          </p>
        </div>
      )}
    </div>
  );
}
