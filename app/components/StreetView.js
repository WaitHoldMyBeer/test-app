// app/components/StreetView.js
'use client';

import { GoogleMap, StreetViewPanorama, useLoadScript } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

export default function StreetView({ location }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location}
      zoom={14}
      options={{ disableDefaultUI: true, gestureHandling: 'none', draggable: false }}
    >
      <StreetViewPanorama
        position={location}
        visible={true}
        options={{
          disableDefaultUI: true,
        }}
      />
    </GoogleMap>
  );
}
