// app/components/PanoramaViewer.js
'use client';

import React from 'react';
import { Pannellum } from 'react-pannellum';
import 'react-pannellum/lib/react-pannellum.css';

export default function PanoramaViewer({ panoramaArray, onNext, onBack }) {
  // Convert the array back to an image
  const reconstructImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Assuming panoramaArray is [height][width][3]
    const height = panoramaArray.length;
    const width = panoramaArray[0].length;

    canvas.width = width;
    canvas.height = height;

    // Create ImageData
    const imageData = ctx.createImageData(width, height);
    let dataIndex = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const [r, g, b] = panoramaArray[y][x];
        imageData.data[dataIndex++] = r;
        imageData.data[dataIndex++] = g;
        imageData.data[dataIndex++] = b;
        imageData.data[dataIndex++] = 255; // Alpha channel
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg');
  };

  const panoramaImage = reconstructImage();

  return (
    <div className="w-full max-w-4xl bg-gray-200 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-4 text-center text-blue-800">Your Selected Panorama</h2>
      <div className="h-96">
        <Pannellum
          width="100%"
          height="100%"
          image={panoramaImage}
          pitch={10}
          yaw={180}
          hfov={110}
          autoLoad
          showControls={true}
        >
          {/* You can add hotspots or other features here */}
        </Pannellum>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
