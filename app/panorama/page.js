// app/panorama/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function PanoramaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');

  const [panoramaUrl, setPanoramaUrl] = useState('');
  const [imageArray, setImageArray] = useState([]);
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch panorama data from Cloud Function
  useEffect(() => {
    if (latitude && longitude) {
      setLoading(true);
      setError('');
      fetch(process.env.NEXT_PUBLIC_CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude, longitude }),
      })
        .then((res) => {
          res.json()
          console.log(res)
        })
        .then((data) => {
          if (data.panoramaUrl) {
            setPanoramaUrl(data.panoramaUrl);
          }
          if (data.imageArray) {
            setImageArray(data.imageArray);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching panorama:', err);
          setError('Failed to fetch panorama. Please try again.');
          setLoading(false);
        });
    }
  }, [latitude, longitude]);

  const onLoad = useCallback((img) => {
    setImageRef(img);
  }, []);

  const handleNext = () => {
    if (completedCrop && imageRef) {
      const { x, y, width, height } = completedCrop;
      console.log('Selected Box Coordinates:', { x, y, width, height });
      // Future: Send these coordinates to the backend or process them as needed
    } else {
      console.log('No area selected.');
      setError('Please select an area on the panorama before proceeding.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Select Area on Panorama</h1>
      {loading ? (
        <p className="text-blue-500">Loading Panorama...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {panoramaUrl ? (
            <div className="relative">
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  src={panoramaUrl}
                  alt="Street View Panorama"
                  className="max-w-full h-auto rounded-lg shadow-md"
                  onLoad={onLoad}
                />
              </ReactCrop>
            </div>
          ) : (
            <p className="text-gray-700">Panorama not available.</p>
          )}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleBack}
              className="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600 transition duration-200"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition duration-200"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
