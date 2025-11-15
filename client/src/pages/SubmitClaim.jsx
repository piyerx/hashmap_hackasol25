import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { claimsAPI } from '../services/api';
import MapPicker from '../components/MapPicker';

const SubmitClaim = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Verify, 3: Submit
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
  const [verificationResult, setVerificationResult] = useState(null);
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

  const handleLocationSelect = (coords) => {
    setFormData({
      ...formData,
      location: coords,
    });
  };

  const handleFileChange = (e, fileType) => {
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
      setError('');
    }
  };

  // Fake AI verification based on filename
  const handleVerifyDocuments = () => {
    setError('');
    
    // Check if all files are uploaded
    if (!files.formB1 || !files.formP2 || !files.aadharCard || !files.witnessProof) {
      setError('Please upload all 4 required documents');
      return;
    }

    if (!formData.ownerName.trim()) {
      setError('Please enter owner name before verification');
      return;
    }

    setLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Fake verification logic - check filenames
      const b1Valid = files.formB1.name.toLowerCase().includes('form_b1') || 
                      files.formB1.name.toLowerCase().includes('form b1') ||
                      files.formB1.name.toLowerCase().includes('formb1');
      const p2Valid = files.formP2.name.toLowerCase().includes('form_p2') || 
                      files.formP2.name.toLowerCase().includes('form p2') ||
                      files.formP2.name.toLowerCase().includes('formp2');
      const aadharValid = files.aadharCard.name.toLowerCase().includes('aadhar') || 
                          files.aadharCard.name.toLowerCase().includes('aadhaar');
      const witnessValid = files.witnessProof.name.toLowerCase().includes('witness');

      const allValid = b1Valid && p2Valid && aadharValid && witnessValid;

      setVerificationResult({
        success: allValid,
        details: {
          formB1: b1Valid ? 'Verified ✓' : 'Invalid filename - should contain "Form_B1"',
          formP2: p2Valid ? 'Verified ✓' : 'Invalid filename - should contain "Form_P2"',
          aadhar: aadharValid ? 'Verified ✓' : 'Invalid filename - should contain "Aadhar"',
          witness: witnessValid ? 'Verified ✓' : 'Invalid filename - should contain "Witness"',
        },
        message: allValid 
          ? '✅ All documents verified successfully! You can proceed to generate hash and submit.'
          : '❌ Document verification failed. Please ensure filenames match required format.'
      });

      setLoading(false);
      
      if (allValid) {
        setCurrentStep(2);
      }
    }, 2000);
  };

  const generateDocumentHash = async () => {
    setHashGenerating(true);
    setError('');
    
    try {
      const fileContents = await Promise.all(
        Object.values(files).map(file => file.arrayBuffer())
      );
      
      const combinedBuffer = new Uint8Array(
        fileContents.reduce((acc, buffer) => acc + buffer.byteLength, 0)
      );
      
      let offset = 0;
      fileContents.forEach(buffer => {
        combinedBuffer.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
      });
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      setFormData({
        ...formData,
        documentHash: hashHex,
      });
      
      setCurrentStep(3);
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

    if (!formData.documentHash) {
      setError('Please generate document hash before submitting');
      return;
    }

    setLoading(true);

    try {
      const claimData = {
        ...formData,
        uploadedFiles: {
          formB1: files.formB1.name,
          formP2: files.formP2.name,
          aadharCard: files.aadharCard.name,
          witnessProof: files.witnessProof.name
        }
      };
      await claimsAPI.submitClaim(claimData);
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

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center space-x-4">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span className="ml-2 font-medium">Upload Documents</span>
          </div>
          <div className="w-16 h-1 bg-gray-300"></div>
          <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span className="ml-2 font-medium">Verify & Hash</span>
          </div>
          <div className="w-16 h-1 bg-gray-300"></div>
          <div className={`flex items-center ${currentStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <span className="ml-2 font-medium">Submit Claim</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Step 1: Upload Documents */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg border border-primary p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Step 1: Upload Documents & Enter Owner Name</h2>
            
            <div className="mb-6">
              <label htmlFor="ownerName" className="block text-text-dark font-medium mb-2">
                Land Owner Name *
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

            <h3 className="text-lg font-semibold text-text-dark mb-4">Required Documents (PDF only)</h3>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-text-dark font-medium mb-2">
                  1. Form B1 *
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, 'formB1')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
                />
                {files.witnessProof && (
                  <p className="text-sm text-primary mt-1">✓ {files.witnessProof.name}</p>
                )}
              </div>
            </div>

            <button
              onClick={handleVerifyDocuments}
              disabled={loading}
              className={`w-full py-3 px-4 rounded text-white font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Verifying Documents with AI...
                </span>
              ) : (
                '🔍 Scan & Verify Documents'
              )}
            </button>

            {/* Verification Result */}
            {verificationResult && (
              <div className={`mt-6 p-4 rounded border ${
                verificationResult.success 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              }`}>
                <h4 className="font-bold mb-2">{verificationResult.message}</h4>
                <ul className="space-y-1 text-sm">
                  <li>Form B1: {verificationResult.details.formB1}</li>
                  <li>Form P2: {verificationResult.details.formP2}</li>
                  <li>Aadhar Card: {verificationResult.details.aadhar}</li>
                  <li>Witness Proof: {verificationResult.details.witness}</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Generate Hash & GPS */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg border border-primary p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Step 2: Generate Hash & Select Location</h2>

            <div className="mb-6 p-4 bg-green-50 border border-green-500 rounded">
              <h4 className="font-bold text-green-800 mb-2">✅ Documents Verified Successfully!</h4>
              <p className="text-sm text-green-700">Owner: <strong>{formData.ownerName}</strong></p>
            </div>

            <div className="mb-6">
              <label className="block text-text-dark font-medium mb-2">
                GPS Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                placeholder="e.g., 22.123456, 77.654321"
              />
              <MapPicker onLocationSelect={handleLocationSelect} />
            </div>

            <button
              onClick={generateDocumentHash}
              disabled={hashGenerating || !formData.location}
              className={`w-full py-3 px-4 rounded text-white font-medium transition-colors ${
                hashGenerating || !formData.location
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {hashGenerating ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Generating Hash...
                </span>
              ) : (
                '🔐 Generate Document Hash'
              )}
            </button>
          </div>
        )}

        {/* Step 3: Final Submit */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg border border-primary p-8">
            <h2 className="text-2xl font-bold text-text-dark mb-6">Step 3: Review & Submit Claim</h2>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Owner Name</p>
                <p className="font-semibold">{formData.ownerName}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">GPS Location</p>
                <p className="font-semibold">{formData.location}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">Document Hash (SHA-256)</p>
                <p className="font-mono text-xs break-all">{formData.documentHash}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-2">Uploaded Documents</p>
                <ul className="text-sm space-y-1">
                  <li>✓ {files.formB1.name}</li>
                  <li>✓ {files.formP2.name}</li>
                  <li>✓ {files.aadharCard.name}</li>
                  <li>✓ {files.witnessProof.name}</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded text-white font-medium transition-colors ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  {loading ? 'Submitting to Blockchain...' : '📤 Submit Land Claim'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitClaim;
