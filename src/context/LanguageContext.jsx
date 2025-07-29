import { createContext, useContext, useEffect, useState } from 'react';
import en from '../i18n/en.json';
import uk from '../i18n/uk.json';

const LanguageContext = createContext();

const translations = {
  en,
  uk
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('uk');

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      setLanguage(storedLang);
    } else {
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          const lang = data?.country_code === 'UA' ? 'uk' : 'en';
          setLanguage(lang);
          localStorage.setItem('language', lang);
        })
        .catch(() => {
          setLanguage('en');
          localStorage.setItem('language', 'en');
        });
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key) => translations[language]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);