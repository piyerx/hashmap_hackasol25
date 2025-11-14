import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-bg-light">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            Adhikar
          </h1>
          <p className="text-2xl text-text-dark mb-2">
            Decentralized Tribal Land Registry
          </p>
          <p className="text-lg text-gray-600">
            Empowering tribal communities through blockchain-based land ownership
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 mb-8 border border-primary">
          <h2 className="text-2xl font-semibold text-text-dark mb-4">
            About Adhikar
          </h2>
          <p className="text-gray-700 mb-4">
            Adhikar is a blockchain-powered platform designed to help tribal communities
            securely register and verify land ownership claims. Our system combines
            traditional governance (Gram Sabha) with modern technology to ensure
            transparency and immutability.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Submit land claims with supporting documents</li>
            <li>Gram Sabha verification and approval process</li>
            <li>Permanent blockchain record of verified claims</li>
            <li>Public verification of ownership</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-primary">
            <h3 className="text-xl font-semibold text-primary mb-3">
              For Community Members
            </h3>
            <p className="text-gray-700 mb-4">
              Register your land claims and track their verification status.
            </p>
            <Link
              to="/register"
              className="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="bg-white rounded-lg p-6 border border-primary">
            <h3 className="text-xl font-semibold text-primary mb-3">
              For Gram Sabha
            </h3>
            <p className="text-gray-700 mb-4">
              Review and approve land claims, recording them permanently on blockchain.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-2 bg-text-dark text-white rounded hover:bg-gray-800 transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/verify"
            className="text-primary hover:text-primary-dark underline text-lg"
          >
            Verify a claim on the blockchain →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
