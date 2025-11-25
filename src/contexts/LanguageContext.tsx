import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Login Page
    'login.welcome': 'Welcome to NOC',
    'login.subtitle': 'Empowering Efficiency, Ensuring Reliability',
    'login.email': 'Email',
    'login.emailPlaceholder': 'Mfadel@Noc.com',
    'login.password': 'Password',
    'login.passwordPlaceholder': '•••',
    'login.forgotPassword': 'Forget Password?',
    'login.signIn': 'Sign In',
    'login.signingIn': 'Signing in...',
    'login.success': 'Success',
    'login.loginSuccessful': 'Login successful!',
    'login.error': 'Error',
    'login.loginFailed': 'Login failed. Please check your credentials.',
    'login.networkError': 'Network error. Please try again.',
    'language': 'English',
  },
  ar: {
    // Login Page
    'login.welcome': 'مرحباً بك في NOC',
    'login.subtitle': 'تمكين الكفاءة، ضمان الموثوقية',
    'login.email': 'البريد الإلكتروني',
    'login.emailPlaceholder': 'Mfadel@Noc.com',
    'login.password': 'كلمة المرور',
    'login.passwordPlaceholder': '•••',
    'login.forgotPassword': 'نسيت كلمة المرور؟',
    'login.signIn': 'تسجيل الدخول',
    'login.signingIn': 'جارٍ تسجيل الدخول...',
    'login.success': 'نجاح',
    'login.loginSuccessful': 'تم تسجيل الدخول بنجاح!',
    'login.error': 'خطأ',
    'login.loginFailed': 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.',
    'login.networkError': 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
    'language': 'عربي',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
