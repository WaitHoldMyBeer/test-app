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

  const handleSubmit = () => {
    if (panoramaCoords) {
      console.log('Submitted Coordinates:', panoramaCoords);
      // Additional actions can be performed here, such as sending coordinates to the backend
    } else {
      console.log('No coordinates selected.');
    }
  };

  const handleCloseStreetView = () => {
    setStreetViewVisible(false);
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
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition duration-200"
        >
          Submit Coordinates
        </button>
      </div>
      {panoramaCoords && (
        <div className="mt-4 p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Selected Coordinates:</h2>
          <p className="text-lg text-gray-700">
            <span className="font-medium text-black">Latitude:</span> {panoramaCoords.lat}
          </p>
          <p className="text-lg text-gray-700">
            <span className="font-medium text-black">Longitude:</span> {panoramaCoords.lng}
          </p>
        </div>
      )}
    </div>
  );
}
