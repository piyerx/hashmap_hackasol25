import { useState, useEffect } from 'react';
import { claimsAPI } from '../services/api';

const UserDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await claimsAPI.getMyClaims();
      setClaims(response.data.claims);
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
        <h1 className="text-3xl font-bold text-primary mb-6">My Land Claims</h1>

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
                  <div>
                    <h3 className="text-xl font-semibold text-text-dark">{claim.ownerName}</h3>
                    <p className="text-gray-600">{claim.location}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      claim.status === 'Verified'
                        ? 'bg-primary text-white'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Document Hash:</span>{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">{claim.documentHash}</code>
                  </p>
                  <p>
                    <span className="font-medium">Submitted:</span>{' '}
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                  {claim.onChainTransactionHash && (
                    <p>
                      <span className="font-medium">Blockchain TX:</span>{' '}
                      <code className="bg-primary bg-opacity-10 px-2 py-1 rounded text-primary">
                        {claim.onChainTransactionHash}
                      </code>
                    </p>
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
