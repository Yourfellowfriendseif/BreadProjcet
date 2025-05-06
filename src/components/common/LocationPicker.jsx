import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

const defaultCenter = {
  lat: 36.8016,
  lng: 10.1234 // Tunisia coordinates as default
};

export default function LocationPicker({
  value,
  onChange,
  error,
  required
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [marker, setMarker] = useState(null);
  const mapRef = useRef();

  // Convert GeoJSON to Google Maps LatLng
  useEffect(() => {
    if (value?.coordinates) {
      setMarker({
        lat: value.coordinates[1],
        lng: value.coordinates[0]
      });
    }
  }, [value]);

  const handleMapClick = (event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarker(newMarker);

    // Convert to GeoJSON Point format
    if (onChange) {
      onChange({
        type: 'Point',
        coordinates: [newMarker.lng, newMarker.lat]
      });
    }
  };

  if (loadError) {
    return <div className="text-red-600">Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg" />;
  }

  return (
    <div className="space-y-2">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={marker || defaultCenter}
        onClick={handleMapClick}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true
        }}
        onLoad={map => {
          mapRef.current = map;
        }}
      >
        {marker && (
          <Marker
            position={marker}
            animation={google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {required && !marker && (
        <p className="text-sm text-gray-500">
          Click on the map to set your location
        </p>
      )}
    </div>
  );
}