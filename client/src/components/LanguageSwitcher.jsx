import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-white text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors"
    >
      {language === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
};

export default LanguageSwitcher;
