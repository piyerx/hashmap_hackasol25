import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimsAPI } from '../services/api';
import OcrScanner from '../components/OcrScanner';
import MapPicker from '../components/MapPicker';

const SubmitClaim = () => {
  const [formData, setFormData] = useState({
    ownerName: '',
    location: '',
    documentHash: '',
  });
  const [files, setFiles] = useState({
    formB1: null,
    formP2: null,
    aadharCard: null,
    witnessProof: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hashGenerating, setHashGenerating] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOcrScan = (scannedText) => {
    setFormData({
      ...formData,
      ownerName: scannedText,
    });
  };

  const handleLocationSelect = (coords) => {
    setFormData({
      ...formData,
      location: coords,
    });
  };

  const handleFileChange = async (e, fileType) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.type !== 'application/pdf') {
        setError(`${fileType} must be a PDF file`);
        return;
      }
      
      setFiles({
        ...files,
        [fileType]: file,
      });
      
      // Auto-generate hash when all files are uploaded
      const updatedFiles = { ...files, [fileType]: file };
      if (Object.values(updatedFiles).every(f => f !== null)) {
        await generateDocumentHash(updatedFiles);
      }
    }
  };

  const generateDocumentHash = async (filesToHash) => {
    setHashGenerating(true);
    setError('');
    
    try {
      // Combine all file contents for hashing
      const fileContents = await Promise.all(
        Object.values(filesToHash).map(file => file.arrayBuffer())
      );
      
      // Combine all buffers
      const combinedBuffer = new Uint8Array(
        fileContents.reduce((acc, buffer) => acc + buffer.byteLength, 0)
      );
      
      let offset = 0;
      fileContents.forEach(buffer => {
        combinedBuffer.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
      });
      
      // Generate SHA-256 hash
      const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setFormData({
        ...formData,
        documentHash: hashHex,
      });
    } catch (err) {
      setError('Failed to generate document hash');
      console.error('Hash generation error:', err);
    } finally {
      setHashGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all files are uploaded
    if (!files.formB1 || !files.formP2 || !files.aadharCard || !files.witnessProof) {
      setError('Please upload all required documents');
      return;
    }

    if (!formData.documentHash) {
      setError('Document hash not generated. Please ensure all files are uploaded.');
      return;
    }

    setLoading(true);

    try {
      await claimsAPI.submitClaim(formData);
      alert('Land claim submitted successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">Submit Land Claim</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <OcrScanner onScan={handleOcrScan} />
          <MapPicker onLocationSelect={handleLocationSelect} />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border border-primary p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ownerName" className="block text-text-dark font-medium mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter the land owner's name"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-text-dark font-medium mb-2">
                GPS Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 22.123456, 77.654321"
              />
              <p className="text-sm text-gray-500 mt-1">
                Use the map picker above or enter coordinates manually
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-text-dark mb-4">
                Required Documents (PDF only)
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-dark font-medium mb-2">
                    1. Form B1 *
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 'formB1')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {files.formB1 && (
                    <p className="text-sm text-primary mt-1">✓ {files.formB1.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-text-dark font-medium mb-2">
                    2. Form P2 *
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 'formP2')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {files.formP2 && (
                    <p className="text-sm text-primary mt-1">✓ {files.formP2.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-text-dark font-medium mb-2">
                    3. Aadhar Card *
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 'aadharCard')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {files.aadharCard && (
                    <p className="text-sm text-primary mt-1">✓ {files.aadharCard.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-text-dark font-medium mb-2">
                    4. Witness Proof *
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 'witnessProof')}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {files.witnessProof && (
                    <p className="text-sm text-primary mt-1">✓ {files.witnessProof.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="documentHash" className="block text-text-dark font-medium mb-2">
                Document Hash (Auto-generated) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="documentHash"
                  name="documentHash"
                  value={formData.documentHash}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Upload all documents to generate hash..."
                />
                {hashGenerating && (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                SHA-256 hash will be automatically generated after all documents are uploaded
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded text-white font-medium transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Claim'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitClaim;
