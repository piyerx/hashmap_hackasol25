import { useState, useEffect } from 'react';
import { claimsAPI } from '../services/api';

const UserDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClaims();
    
    // Auto-refresh every 10 seconds to show status updates
    const interval = setInterval(fetchClaims, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await claimsAPI.getMyClaims();
      setClaims(response.data.claims);
      setError('');
    } catch (err) {
      setError('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-text-dark text-xl">Loading your claims...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">My Land Claims</h1>
          <button
            onClick={fetchClaims}
            className="px-4 py-2 text-sm bg-white border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {claims.length === 0 ? (
          <div className="bg-white rounded-lg border border-primary p-8 text-center">
            <p className="text-text-dark text-lg mb-4">You haven't submitted any claims yet.</p>
            <a
              href="/submit-claim"
              className="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Submit Your First Claim
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim._id} className="bg-white rounded-lg border border-primary p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-text-dark">{claim.ownerName}</h3>
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium flex items-center gap-1 ${
                          claim.status === 'Verified'
                            ? 'bg-primary text-white'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {claim.status === 'Verified' ? '✓' : '⏳'}
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-gray-600">📍 {claim.location}</p>
                  </div>
                </div>
                
                {/* Uploaded Files */}
                {claim.uploadedFiles && (
                  <div className="mb-4 p-3 bg-bg-light rounded">
                    <h4 className="font-semibold text-text-dark mb-2 text-sm">Uploaded Documents</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-primary">✓</span>
                        <span className="text-gray-600">Form B1</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-primary">✓</span>
                        <span className="text-gray-600">Form P2</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-primary">✓</span>
                        <span className="text-gray-600">Aadhar Card</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-primary">✓</span>
                        <span className="text-gray-600">Witness Proof</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Document Hash:</span>{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">{claim.documentHash}</code>
                  </p>
                  <p>
                    <span className="font-medium">Submitted:</span>{' '}
                    {new Date(claim.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {claim.status === 'Verified' && claim.onChainTransactionHash && (
                    <div className="mt-3 p-3 bg-primary bg-opacity-10 rounded border border-primary">
                      <p className="font-semibold text-primary mb-1">✓ Verified on Blockchain</p>
                      <p className="text-xs">
                        <span className="font-medium">Transaction Hash:</span>{' '}
                        <code className="bg-white px-2 py-1 rounded text-primary break-all">
                          {claim.onChainTransactionHash}
                        </code>
                      </p>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${claim.onChainTransactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-primary hover:underline text-xs"
                      >
                        View on Etherscan →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
