import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-bg-light">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-4">
            {t('homeTitle')}
          </h1>
          <p className="text-2xl text-text-dark mb-2">
            {t('homeSubtitle')}
          </p>
          <p className="text-lg text-gray-600">
            {t('homeTagline')}
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 mb-8 border border-primary">
          <h2 className="text-2xl font-semibold text-text-dark mb-4">
            {t('aboutAdhikar')}
          </h2>
          <p className="text-gray-700 mb-4">
            {t('aboutDescription')}
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>{t('submitClaims')}</li>
            <li>{t('gramSabhaVerification')}</li>
            <li>{t('blockchainRecord')}</li>
            <li>{t('publicVerification')}</li>
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 border border-primary">
            <h3 className="text-xl font-semibold text-primary mb-3">
              {t('forCommunityMembers')}
            </h3>
            <p className="text-gray-700 mb-4">
              {t('communityDescription')}
            </p>
            <Link
              to="/register"
              className="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              {t('getStarted')}
            </Link>
          </div>

          <div className="bg-white rounded-lg p-6 border border-primary">
            <h3 className="text-xl font-semibold text-primary mb-3">
              {t('forGramSabha')}
            </h3>
            <p className="text-gray-700 mb-4">
              {t('gramSabhaDescription')}
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-2 bg-text-dark text-white rounded hover:bg-gray-800 transition-colors"
            >
              {t('adminLogin')}
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/verify"
            className="text-primary hover:text-primary-dark underline text-lg"
          >
            {t('verifyClaimLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
