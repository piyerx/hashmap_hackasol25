import { useState } from 'react';

const OcrScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    
    setTimeout(() => {
      const mockScannedText = 'Rajesh Kumar';
      onScan(mockScannedText);
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-4 rounded border border-primary">
      <h3 className="text-lg font-semibold text-text-dark mb-2">AI OCR Scanner</h3>
      <p className="text-sm text-gray-600 mb-3">
        Use AI to extract text from paper documents
      </p>
      <button
        onClick={handleScan}
        disabled={scanning}
        className={`w-full px-4 py-2 rounded text-white transition-colors ${
          scanning
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark'
        }`}
      >
        {scanning ? 'Scanning Document...' : 'Scan Paper Document'}
      </button>
      {scanning && (
        <div className="mt-3 text-center text-sm text-primary">
          Processing with Tesseract.js...
        </div>
      )}
    </div>
  );
};

export default OcrScanner;
