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
        className="w-full h-64 rounded border-2 border-primary cursor-crosshair relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #a8e0c4 0%, #c8e8d6 50%, #e8f4ec 100%)',
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(76, 175, 80, 0.15) 0%, transparent 50%),
            repeating-linear-gradient(0deg, rgba(76, 175, 80, 0.05) 0px, transparent 1px, transparent 40px, rgba(76, 175, 80, 0.05) 41px),
            repeating-linear-gradient(90deg, rgba(76, 175, 80, 0.05) 0px, transparent 1px, transparent 40px, rgba(76, 175, 80, 0.05) 41px)
          `
        }}
      >
        {/* Map roads */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
        </svg>
        
        {/* Trees/landmarks */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-green-700 rounded-full" style={{ pointerEvents: 'none' }} />
        <div className="absolute top-12 right-8 w-4 h-4 bg-green-600 rounded-full" style={{ pointerEvents: 'none' }} />
        <div className="absolute bottom-8 left-16 w-3 h-3 bg-green-700 rounded-full" style={{ pointerEvents: 'none' }} />
        <div className="absolute bottom-4 right-12 w-4 h-4 bg-green-600 rounded-full" style={{ pointerEvents: 'none' }} />
        
        {selectedCoords && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${((parseFloat(selectedCoords.split(',')[1]) - 77) / 2) * 100}%`,
              top: `${((parseFloat(selectedCoords.split(',')[0]) - 22) / 2) * 100}%`
            }}
          >
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        )}
        
        {!selectedCoords && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-white bg-opacity-90 px-4 py-2 rounded-lg">
              <svg
                className="w-12 h-12 mx-auto mb-2 text-primary"
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
              <p className="text-sm font-medium text-text-dark">Click to select location</p>
            </div>
          </div>
        )}
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
