import { useState } from 'react';

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState('English');

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'हिंदी' : 'English');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-4 py-2 bg-white text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors"
    >
      {language}
    </button>
  );
};

export default LanguageSwitcher;
