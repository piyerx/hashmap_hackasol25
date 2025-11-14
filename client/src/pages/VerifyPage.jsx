import { useState } from 'react';
import axios from 'axios';

const VerifyPage = () => {
  const [txHash, setTxHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerificationResult(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/verify/transaction/${txHash}`);
      setVerificationResult(response.data);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        valid: false,
        message: error.response?.data?.message || 'Failed to verify transaction. Please check the hash and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Verify Land Claim</h1>
        <p className="text-gray-600 mb-6">
          Enter a blockchain transaction hash to verify a land claim record
        </p>

        <div className="bg-white rounded-lg border border-primary p-8">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="txHash" className="block text-text-dark font-medium mb-2">
                Transaction Hash
              </label>
              <input
                type="text"
                id="txHash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0x..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded text-white font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify on Blockchain'}
            </button>
          </form>

          {verificationResult && (
            <div
              className={`mt-6 p-4 rounded border ${
                verificationResult.valid && verificationResult.isLandClaim
                  ? 'bg-green-50 border-primary text-text-dark'
                  : 'bg-red-50 border-red-400 text-red-700'
              }`}
            >
              <h3 className="font-semibold text-lg mb-2">
                {verificationResult.valid && verificationResult.isLandClaim ? '✓ Valid Claim' : '✗ Invalid Claim'}
              </h3>
              <p className="mb-2">{verificationResult.message}</p>
              
              {verificationResult.valid && verificationResult.isLandClaim && verificationResult.claimData && (
                <div className="mt-4 space-y-3">
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-sm text-gray-600">Owner Name</p>
                    <p className="font-semibold text-lg text-primary">{verificationResult.claimData.ownerName}</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-sm text-gray-600">Location (GPS Coordinates)</p>
                    <p className="font-mono text-text-dark">{verificationResult.claimData.location}</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-sm text-gray-600">Claim ID</p>
                    <p className="font-mono text-sm text-text-dark break-all">{verificationResult.claimData.claimId}</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-sm text-gray-600">Verified By (Gram Sabha)</p>
                    <p className="font-mono text-sm text-text-dark break-all">{verificationResult.claimData.verifiedBy}</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-sm text-gray-600">Verification Time</p>
                    <p className="text-text-dark">
                      {verificationResult.claimData.timestamp 
                        ? new Date(verificationResult.claimData.timestamp).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-sm text-gray-600">Block Number</p>
                    <p className="text-text-dark">{verificationResult.blockNumber}</p>
                  </div>
                  
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-3"
                  >
                    View on Etherscan ↗
                  </a>
                </div>
              )}
              
              {verificationResult.valid && !verificationResult.isLandClaim && (
                <div className="mt-3">
                  <p className="text-gray-600 text-sm">This transaction exists on the blockchain but is not a land claim verification.</p>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                  >
                    View on Etherscan ↗
                  </a>
                </div>
              )}
              
              {!verificationResult.valid && (
                <p className="text-sm mt-2">{verificationResult.error || 'Please check the transaction hash and try again.'}</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg border border-primary p-6">
          <h2 className="text-xl font-semibold text-text-dark mb-3">
            About Public Verification
          </h2>
          <p className="text-gray-700">
            Anyone can verify land claims using the blockchain transaction hash. This ensures
            complete transparency and allows community members to independently confirm
            ownership records without relying on a central authority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
