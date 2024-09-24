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

const center = {
  lat: 37.7749, // Default to San Francisco
  lng: -122.4194,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function MapComponent({ onCoordinatesSelect }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [selected, setSelected] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [streetViewVisible, setStreetViewVisible] = useState(false);
  const [panoramaCoords, setPanoramaCoords] = useState(null);

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
    setSelected({ lat, lng });
    setPanoramaCoords({ lat, lng });
    setStreetViewVisible(true);
  };

  const handleStreetViewClose = () => {
    setStreetViewVisible(false);
    setSelected(null);
  };

  const handleSubmit = () => {
    if (panoramaCoords) {
      console.log('Selected Coordinates:', panoramaCoords);
      if (onCoordinatesSelect) {
        onCoordinatesSelect(panoramaCoords);
      }
    } else {
      console.log('No coordinates selected.');
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div className="w-full">
      <div className="mb-4">
        <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Search location..."
            className="w-full p-2 border rounded"
          />
        </Autocomplete>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={handleMapClick}
        onLoad={onMapLoad}
      >
        {selected && <Marker position={{ lat: selected.lat, lng: selected.lng }} />}
        {streetViewVisible && panoramaCoords && (
          <StreetViewPanorama
            position={panoramaCoords}
            visible={streetViewVisible}
            options={{
              disableDefaultUI: true,
              enableCloseButton: true,
            }}
            onCloseclick={handleStreetViewClose}
          />
        )}
      </GoogleMap>
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Coordinates
        </button>
      </div>
    </div>
  );
}
