// components/common/LocationPicker.jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LocationPicker({ onLocationSelect }) {
  const LocationFinder = () => {
    useMapEvents({
      click(e) {
        onLocationSelect([e.latlng.lng, e.latlng.lat]);
      },
    });
    return null;
  };

  return (
    <MapContainer 
      center={[51.505, -0.09]} 
      zoom={13} 
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationFinder />
    </MapContainer>
  );
}