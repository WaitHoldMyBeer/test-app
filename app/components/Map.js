// app/components/Map.js
'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  StreetViewPanorama,
  Autocomplete,
} from '@react-google-maps/api';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 37.7749, // San Francisco
  lng: -122.4194,
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

export default function MapComponent({ onCoordinatesSelect }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [mapRef, setMapRef] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [streetViewVisible, setStreetViewVisible] = useState(false);
  const [panoramaCoords, setPanoramaCoords] = useState(null);
  const panoramaRef = useRef(null);

  const onMapLoad = useCallback((map) => {
    setMapRef(map);
  }, []);

  const onAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        mapRef.panTo(place.geometry.location);
        mapRef.setZoom(14);
        setStreetViewVisible(true);
        setPanoramaCoords({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        onCoordinatesSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      } else {
        alert('No details available for input: \'' + place.name + '\'');
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPanoramaCoords({ lat, lng });
    setStreetViewVisible(true);
    onCoordinatesSelect({ lat, lng });
  };

  const handlePanoramaPositionChanged = () => {
    if (panoramaRef.current) {
      const position = panoramaRef.current.position;
      if (position) {
        const lat = position.lat();
        const lng = position.lng();
        setPanoramaCoords({ lat, lng });
        if (onCoordinatesSelect) {
          onCoordinatesSelect({ lat, lng });
        }
      }
    }
  };

  const handleCloseStreetView = () => {
    setStreetViewVisible(false);
    setPanoramaCoords(null);
    onCoordinatesSelect(null);
  };

  if (loadError) return <div className="text-red-500">Error loading maps</div>;
  if (!isLoaded) return <div className="text-blue-500">Loading Maps...</div>;

  return (
    <div className="w-full">
      <div className="mb-4">
        <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search location..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Autocomplete>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={defaultCenter}
        options={options}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {panoramaCoords && <Marker position={panoramaCoords} />}
        {streetViewVisible && panoramaCoords && (
          <StreetViewPanorama
            ref={panoramaRef}
            position={panoramaCoords}
            visible={streetViewVisible}
            options={{
              disableDefaultUI: false,
              enableCloseButton: true,
              linksControl: true,
              panControl: true,
              zoomControl: true,
            }}
            onPositionChanged={handlePanoramaPositionChanged}
            onCloseclick={handleCloseStreetView}
          />
        )}
      </GoogleMap>
    </div>
  );
}
