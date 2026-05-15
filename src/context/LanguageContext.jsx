import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const languages = [
  { name: 'English', code: 'en' },
  { name: 'Spanish', code: 'es' },
  { name: 'French', code: 'fr' },
  { name: 'German', code: 'de' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Tamil', code: 'ta' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Korean', code: 'ko' },
];

export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
