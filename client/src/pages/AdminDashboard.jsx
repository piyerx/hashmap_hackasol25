import { useState, useEffect } from 'react';
import { claimsAPI } from '../services/api';

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(null);
  const [expandedClaim, setExpandedClaim] = useState(null);

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

  const toggleExpandClaim = (claimId) => {
    setExpandedClaim(expandedClaim === claimId ? null : claimId);
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
              <div key={claim._id} className="bg-white rounded-lg border border-primary overflow-hidden">
                {/* Claim Header - Always Visible */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpandClaim(claim._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-text-dark">{claim.ownerName}</h3>
                        <span className="px-3 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                          {claim.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">📍 {claim.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted by: <span className="font-medium">{claim.submittedBy?.username || 'Unknown'}</span>
                        {' • '}
                        {new Date(claim.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-primary">
                      {expandedClaim === claim._id ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedClaim === claim._id && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="pt-4 space-y-4">
                      {/* Uploaded Documents */}
                      {claim.uploadedFiles && (
                        <div className="bg-bg-light p-4 rounded-lg">
                          <h4 className="font-semibold text-text-dark mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Uploaded Documents
                          </h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-primary">✓</span>
                              <span className="font-medium">Form B1:</span>
                              <span className="text-gray-600 truncate">{claim.uploadedFiles.formB1 || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-primary">✓</span>
                              <span className="font-medium">Form P2:</span>
                              <span className="text-gray-600 truncate">{claim.uploadedFiles.formP2 || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-primary">✓</span>
                              <span className="font-medium">Aadhar Card:</span>
                              <span className="text-gray-600 truncate">{claim.uploadedFiles.aadharCard || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-primary">✓</span>
                              <span className="font-medium">Witness Proof:</span>
                              <span className="text-gray-600 truncate">{claim.uploadedFiles.witnessProof || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Document Hash */}
                      <div>
                        <h4 className="font-semibold text-text-dark mb-2">Document Hash</h4>
                        <code className="block bg-gray-100 px-3 py-2 rounded text-xs break-all">
                          {claim.documentHash}
                        </code>
                      </div>

                      {/* Claim Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-text-dark mb-1">Owner Name</h4>
                          <p className="text-gray-700">{claim.ownerName}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-text-dark mb-1">GPS Location</h4>
                          <p className="text-gray-700">{claim.location}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-text-dark mb-1">Claim ID</h4>
                          <p className="text-gray-700 text-sm">{claim._id}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-text-dark mb-1">Submission Date</h4>
                          <p className="text-gray-700">
                            {new Date(claim.createdAt).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveClaim(claim._id);
                          }}
                          disabled={approving === claim._id}
                          className={`w-full md:w-auto px-8 py-3 rounded text-white font-medium transition-colors ${
                            approving === claim._id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-primary hover:bg-primary-dark'
                          }`}
                        >
                          {approving === claim._id ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Approving & Recording on Blockchain...
                            </span>
                          ) : (
                            'Approve Claim & Record on Blockchain'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
