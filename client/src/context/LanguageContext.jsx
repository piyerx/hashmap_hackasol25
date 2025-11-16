import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navbar
    appName: 'Adhikar',
    tagline: 'Decentralized Land Registry',
    welcome: 'Welcome',
    myClaims: 'My Claims',
    submitClaim: 'Submit Claim',
    adminDashboard: 'Admin Dashboard',
    councilDashboard: 'Council Dashboard',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    verify: 'Verify',
    
    // Submit Claim Page
    submitLandClaim: 'Submit Land Claim',
    step1Title: 'Step 1: Upload Documents & Enter Owner Name',
    step2Title: 'Step 2: Generate Hash & Select Location',
    step3Title: 'Step 3: Review & Submit Claim',
    uploadDocuments: 'Upload Documents',
    verifyHash: 'Verify & Hash',
    landOwnerName: 'Land Owner Name',
    enterOwnerName: "Enter the land owner's name",
    requiredDocuments: 'Required Documents (PDF only)',
    formB1: 'Form B1',
    formP2: 'Form P2',
    aadharCard: 'Aadhar Card',
    witnessProof: 'Witness Proof',
    scanVerifyDocs: '🔍 Scan & Verify Documents',
    verifyingDocs: 'Verifying Documents with AI...',
    docsVerifiedSuccess: '✅ Documents Verified Successfully!',
    owner: 'Owner',
    gpsLocation: 'GPS Location',
    enterCoordinates: 'e.g., 22.123456, 77.654321',
    generateHash: '🔐 Generate Document Hash',
    generatingHash: 'Generating Hash...',
    documentHash: 'Document Hash (SHA-256)',
    uploadedDocuments: 'Uploaded Documents',
    submitClaimBtn: '📤 Submit Land Claim',
    submittingBlockchain: 'Submitting to Blockchain...',
    cancel: 'Cancel',
    
    // Dashboard
    dashboard: 'Dashboard',
    pendingClaims: 'Pending Claims',
    approvedClaims: 'Approved Claims',
    rejectedClaims: 'Rejected Claims',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // HomePage
    homeTitle: 'Adhikar',
    homeSubtitle: 'Decentralized Tribal Land Registry',
    homeTagline: 'Empowering tribal communities through blockchain-based land ownership',
    aboutAdhikar: 'About Adhikar',
    aboutDescription: 'Adhikar is a blockchain-powered platform designed to help tribal communities securely register and verify land ownership claims. Our system combines traditional governance (Gram Sabha) with modern technology to ensure transparency and immutability.',
    submitClaims: 'Submit land claims with supporting documents',
    gramSabhaVerification: 'Gram Sabha verification and approval process',
    blockchainRecord: 'Permanent blockchain record of verified claims',
    publicVerification: 'Public verification of ownership',
    forCommunityMembers: 'For Community Members',
    communityDescription: 'Register your land claims and track their verification status.',
    getStarted: 'Get Started',
    forGramSabha: 'For Gram Sabha',
    gramSabhaDescription: 'Review and approve land claims, recording them permanently on blockchain.',
    adminLogin: 'Admin Login',
    verifyClaimLink: 'Verify a claim on the blockchain →',
  },
  hi: {
    // Navbar
    appName: 'अधिकार',
    tagline: 'विकेंद्रीकृत भूमि रजिस्ट्री',
    welcome: 'स्वागत है',
    myClaims: 'मेरे दावे',
    submitClaim: 'दावा जमा करें',
    adminDashboard: 'प्रशासक डैशबोर्ड',
    councilDashboard: 'परिषद डैशबोर्ड',
    logout: 'लॉगआउट',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    verify: 'सत्यापित करें',
    
    // Submit Claim Page
    submitLandClaim: 'भूमि दावा जमा करें',
    step1Title: 'चरण 1: दस्तावेज़ अपलोड करें और मालिक का नाम दर्ज करें',
    step2Title: 'चरण 2: हैश जनरेट करें और स्थान चुनें',
    step3Title: 'चरण 3: समीक्षा करें और दावा जमा करें',
    uploadDocuments: 'दस्तावेज़ अपलोड करें',
    verifyHash: 'सत्यापन और हैश',
    landOwnerName: 'भूमि मालिक का नाम',
    enterOwnerName: 'भूमि मालिक का नाम दर्ज करें',
    requiredDocuments: 'आवश्यक दस्तावेज़ (केवल PDF)',
    formB1: 'फॉर्म B1',
    formP2: 'फॉर्म P2',
    aadharCard: 'आधार कार्ड',
    witnessProof: 'गवाह प्रमाण',
    scanVerifyDocs: '🔍 दस्तावेज़ स्कैन और सत्यापित करें',
    verifyingDocs: 'AI के साथ दस्तावेज़ सत्यापित कर रहे हैं...',
    docsVerifiedSuccess: '✅ दस्तावेज़ सफलतापूर्वक सत्यापित!',
    owner: 'मालिक',
    gpsLocation: 'जीपीएस स्थान',
    enterCoordinates: 'उदा., 22.123456, 77.654321',
    generateHash: '🔐 दस्तावेज़ हैश जनरेट करें',
    generatingHash: 'हैश जनरेट हो रहा है...',
    documentHash: 'दस्तावेज़ हैश (SHA-256)',
    uploadedDocuments: 'अपलोड किए गए दस्तावेज़',
    submitClaimBtn: '📤 भूमि दावा जमा करें',
    submittingBlockchain: 'ब्लॉकचेन पर जमा हो रहा है...',
    cancel: 'रद्द करें',
    
    // Dashboard
    dashboard: 'डैशबोर्ड',
    pendingClaims: 'लंबित दावे',
    approvedClaims: 'स्वीकृत दावे',
    rejectedClaims: 'अस्वीकृत दावे',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    
    // HomePage
    homeTitle: 'अधिकार',
    homeSubtitle: 'विकेंद्रीकृत आदिवासी भूमि रजिस्ट्री',
    homeTagline: 'ब्लॉकचेन-आधारित भूमि स्वामित्व के माध्यम से आदिवासी समुदायों को सशक्त बनाना',
    aboutAdhikar: 'अधिकार के बारे में',
    aboutDescription: 'अधिकार एक ब्लॉकचेन-संचालित प्लेटफ़ॉर्म है जो आदिवासी समुदायों को भूमि स्वामित्व दावों को सुरक्षित रूप से पंजीकृत और सत्यापित करने में मदद करने के लिए डिज़ाइन किया गया है। हमारी प्रणाली पारदर्शिता और अपरिवर्तनीयता सुनिश्चित करने के लिए पारंपरिक शासन (ग्राम सभा) को आधुनिक तकनीक के साथ जोड़ती है।',
    submitClaims: 'सहायक दस्तावेजों के साथ भूमि दावे जमा करें',
    gramSabhaVerification: 'ग्राम सभा सत्यापन और अनुमोदन प्रक्रिया',
    blockchainRecord: 'सत्यापित दावों का स्थायी ब्लॉकचेन रिकॉर्ड',
    publicVerification: 'स्वामित्व का सार्वजनिक सत्यापन',
    forCommunityMembers: 'समुदाय के सदस्यों के लिए',
    communityDescription: 'अपने भूमि दावे पंजीकृत करें और उनकी सत्यापन स्थिति को ट्रैक करें।',
    getStarted: 'शुरू करें',
    forGramSabha: 'ग्राम सभा के लिए',
    gramSabhaDescription: 'भूमि दावों की समीक्षा और अनुमोदन करें, उन्हें ब्लॉकचेन पर स्थायी रूप से रिकॉर्ड करें।',
    adminLogin: 'प्रशासक लॉगिन',
    verifyClaimLink: 'ब्लॉकचेन पर दावे को सत्यापित करें →',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    toggleLanguage,
    t,
    isHindi: language === 'hi'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
