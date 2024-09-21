// app/page.js
'use client';

import { useState } from 'react';

export default function Home() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [panoramaUrl, setPanoramaUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPanoramaUrl('');

    // Validate inputs
    if (!latitude || !longitude) {
      setError('Please enter both latitude and longitude.');
      return;
    }

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: latitude,
          longitude: longitude,
        }),
      });
      console.log("trying")
      const data = await response.json();

      if (response.ok) {
        setPanoramaUrl(data.panoramaUrl);
      } else {
        setError(data.error || 'An error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch panorama.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Google Street View Panorama</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="latitude" className="block text-gray-700">
            Latitude:
          </label>
          <input
            type="text"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            placeholder="e.g., 37.7749"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="longitude" className="block text-gray-700">
            Longitude:
          </label>
          <input
            type="text"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            placeholder="e.g., -122.4194"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>

      {panoramaUrl && (
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Panorama Image:</h2>
          <img src={panoramaUrl} alt="Street View Panorama" className="rounded shadow-md" />
        </div>
      )}
    </div>
  );
}
