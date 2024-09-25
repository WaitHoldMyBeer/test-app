// app/page.js
'use client';

import React, { useState } from 'react';
import MapComponent from './components/Map';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleCoordinatesSelect = (coords) => {
    console.log('Coordinates from Parent:', coords);
    setSelectedCoords(coords);
  };

  const handleSubmit = () => {
    if (selectedCoords) {
      // Redirect to Panorama Page with coordinates as query parameters
      router.push(
        `/panorama?latitude=${selectedCoords.lat}&longitude=${selectedCoords.lng}`
      );
    } else {
      console.log('No coordinates selected.');
    }
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
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-200"
        >
          Submit Coordinates
        </button>
      </div>
    </div>
  );
}
