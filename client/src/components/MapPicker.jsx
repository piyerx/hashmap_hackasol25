import { useState } from 'react';

const MapPicker = ({ onLocationSelect }) => {
  const [selectedCoords, setSelectedCoords] = useState(null);

  const handleMapClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const mockLat = (22.0 + (y / rect.height) * 2).toFixed(6);
    const mockLng = (77.0 + (x / rect.width) * 2).toFixed(6);
    
    const coords = `${mockLat}, ${mockLng}`;
    setSelectedCoords(coords);
    onLocationSelect(coords);
  };

  return (
    <div className="bg-white p-4 rounded border border-primary">
      <h3 className="text-lg font-semibold text-text-dark mb-2">GPS Location Picker</h3>
      <p className="text-sm text-gray-600 mb-3">
        Click on the map to select GPS coordinates
      </p>
      <div
        onClick={handleMapClick}
        className="w-full h-64 bg-gray-200 rounded border-2 border-dashed border-primary cursor-crosshair relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(90deg, #e5e7eb 1px, transparent 1px), linear-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-2 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-sm">Click anywhere on the map</p>
          </div>
        </div>
      </div>
      {selectedCoords && (
        <div className="mt-3 p-2 bg-bg-light rounded">
          <p className="text-sm text-text-dark">
            <span className="font-semibold">Selected:</span> {selectedCoords}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
