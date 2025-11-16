import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const [selectedCoords, setSelectedCoords] = useState(initialLocation || null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (initialLocation) {
      setSelectedCoords(initialLocation);
    }
  }, [initialLocation]);

  useEffect(() => {
    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
      // Default to Akaltara, India coordinates
      const defaultLat = 22.031474;
      const defaultLng = 82.44137;
      
      const map = L.map(mapRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 17,
        zoomControl: true,
      });

      // Use Esri World Imagery (Satellite) - shows actual land, fields (khet), and terrain
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN',
        maxZoom: 19,
      }).addTo(map);

      // Add labels overlay for better identification
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        maxZoom: 19,
      }).addTo(map);

      // Add click event to place marker
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        const coords = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        // Remove existing marker if any
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        
        // Add new marker
        markerRef.current = L.marker([lat, lng]).addTo(map);
        
        setSelectedCoords(coords);
        onLocationSelect(coords);
      });

      mapInstanceRef.current = map;
    }

    // If there's an initial location, add marker
    if (initialLocation && mapInstanceRef.current) {
      const [lat, lng] = initialLocation.split(',').map(coord => parseFloat(coord.trim()));
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // Remove existing marker
        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
        }
        
        // Add marker at initial location
        markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
        mapInstanceRef.current.setView([lat, lng], 17);
      }
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker when initial location changes
  useEffect(() => {
    if (initialLocation && mapInstanceRef.current) {
      const [lat, lng] = initialLocation.split(',').map(coord => parseFloat(coord.trim()));
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // Remove existing marker
        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
        }
        
        // Add marker at new location
        markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
        mapInstanceRef.current.setView([lat, lng], 17);
      }
    }
  }, [initialLocation]);

  return (
    <div className="bg-white p-4 rounded border border-primary">
      <h3 className="text-lg font-semibold text-text-dark mb-2">GPS Location Picker</h3>
      <p className="text-sm text-gray-600 mb-3">
        Click on the map to select GPS coordinates for the land
      </p>
      <div
        ref={mapRef}
        className="w-full h-96 rounded border-2 border-primary"
        style={{ zIndex: 1 }}
      />
      {selectedCoords && (
        <div className="mt-3 p-3 bg-green-50 border border-green-500 rounded">
          <p className="text-sm text-text-dark">
            <span className="font-semibold">📍 Selected Location:</span> {selectedCoords}
          </p>
          <p className="text-xs text-gray-600 mt-1">Akaltara, Chhattisgarh, India</p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
