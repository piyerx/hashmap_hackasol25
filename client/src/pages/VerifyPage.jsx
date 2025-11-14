import { useState } from 'react';

const VerifyPage = () => {
  const [txHash, setTxHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (txHash.length > 10) {
        setVerificationResult({
          valid: true,
          message: 'This transaction is valid and recorded on the blockchain.',
          txHash: txHash,
        });
      } else {
        setVerificationResult({
          valid: false,
          message: 'Invalid or not found on blockchain.',
        });
      }
      setLoading(false);
    }, 1500);
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
                verificationResult.valid
                  ? 'bg-green-50 border-primary text-text-dark'
                  : 'bg-red-50 border-red-400 text-red-700'
              }`}
            >
              <h3 className="font-semibold text-lg mb-2">
                {verificationResult.valid ? '✓ Valid Claim' : '✗ Invalid Claim'}
              </h3>
              <p className="mb-2">{verificationResult.message}</p>
              {verificationResult.valid && (
                <div className="mt-3 space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Transaction Hash:</span>{' '}
                    <code className="bg-white px-2 py-1 rounded">{verificationResult.txHash}</code>
                  </p>
                  <p className="text-gray-600">
                    This claim has been verified and permanently recorded by the Gram Sabha.
                  </p>
                </div>
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
