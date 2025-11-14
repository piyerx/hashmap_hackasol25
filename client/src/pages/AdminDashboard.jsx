import { useState, useEffect } from 'react';
import { claimsAPI } from '../services/api';

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(null);

  useEffect(() => {
    fetchPendingClaims();
  }, []);

  const fetchPendingClaims = async () => {
    try {
      const response = await claimsAPI.getPendingClaims();
      setClaims(response.data.claims);
    } catch (err) {
      setError('Failed to load pending claims');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClaim = async (claimId) => {
    setApproving(claimId);
    try {
      await claimsAPI.approveClaim(claimId);
      setClaims(claims.filter((claim) => claim._id !== claimId));
      alert('Claim approved and recorded on blockchain successfully!');
    } catch (err) {
      alert('Failed to approve claim: ' + (err.response?.data?.error || err.message));
    } finally {
      setApproving(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-text-dark text-xl">Loading pending claims...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">Gram Sabha Dashboard</h1>
        <p className="text-gray-600 mb-6">Review and approve pending land claims</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {claims.length === 0 ? (
          <div className="bg-white rounded-lg border border-primary p-8 text-center">
            <p className="text-text-dark text-lg">No pending claims to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim._id} className="bg-white rounded-lg border border-primary p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-text-dark">{claim.ownerName}</h3>
                    <p className="text-gray-600">{claim.location}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted by: <span className="font-medium">{claim.submittedBy?.username || 'Unknown'}</span>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                    {claim.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>
                    <span className="font-medium">Document Hash:</span>{' '}
                    <code className="bg-gray-100 px-2 py-1 rounded">{claim.documentHash}</code>
                  </p>
                  <p>
                    <span className="font-medium">Submitted:</span>{' '}
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => handleApproveClaim(claim._id)}
                  disabled={approving === claim._id}
                  className={`px-6 py-2 rounded text-white font-medium transition-colors ${
                    approving === claim._id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark'
                  }`}
                >
                  {approving === claim._id ? 'Approving & Recording...' : 'Approve Claim'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
