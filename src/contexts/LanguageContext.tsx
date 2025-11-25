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
    // Dashboard Page
    'dashboard.hello': 'Hello,',
    'dashboard.dashboard': 'Dashboard',
    'dashboard.attendance': 'Attendance',
    'dashboard.quickCheckIn': 'Quick Check-In',
    'dashboard.scanQR': 'Scan QR to clock in/out',
    'dashboard.todaysHours': "Today's Hours",
    'dashboard.checkedIn': 'Checked In',
    'dashboard.notStarted': 'Not Started',
    'dashboard.checkOut': 'Check Out',
    'dashboard.checkIn': 'Check In',
    'dashboard.shift': 'Shift: 09:00 AM - 06:00 PM',
    'dashboard.modules': 'Modules',
    'dashboard.seeAll': 'See All',
    'dashboard.timeTracker': 'Time Tracker',
    'dashboard.timeOff': 'Time Off',
    'dashboard.courses': 'Courses',
    'dashboard.ongoingTasks': 'Ongoing Tasks',
    'dashboard.recentProjects': 'Recent Projects',
    'dashboard.welcome': 'Welcome',
    'dashboard.checkedInToast': 'Checked In',
    'dashboard.checkedInDesc': 'Your attendance has been recorded.',
    'dashboard.checkedOutToast': 'Checked Out',
    'dashboard.checkedOutDesc': 'Have a great day!',
    'dashboard.timeOffCount': '4 Time Off',
    'dashboard.requestsCount': '0 Requests',
    'dashboard.expensesCount': '16 Expenses',
    'dashboard.tasksCount': '18 Tasks',
    // More Page
    'more.myProfile': 'My Profile',
    'more.myDashboard': 'My Dashboard',
    'more.language': 'Language',
    'more.myCourses': 'My Courses',
    'more.privacyPolicy': 'Privacy Policy',
    'more.termsAndConditions': 'Terms And Conditions',
    'more.logOut': 'Log Out',
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
    // Dashboard Page
    'dashboard.hello': 'مرحباً،',
    'dashboard.dashboard': 'لوحة التحكم',
    'dashboard.attendance': 'الحضور',
    'dashboard.quickCheckIn': 'تسجيل حضور سريع',
    'dashboard.scanQR': 'امسح رمز QR لتسجيل الدخول/الخروج',
    'dashboard.todaysHours': 'ساعات اليوم',
    'dashboard.checkedIn': 'تم تسجيل الحضور',
    'dashboard.notStarted': 'لم يبدأ',
    'dashboard.checkOut': 'تسجيل الخروج',
    'dashboard.checkIn': 'تسجيل الدخول',
    'dashboard.shift': 'الوردية: 09:00 صباحاً - 06:00 مساءً',
    'dashboard.modules': 'الوحدات',
    'dashboard.seeAll': 'عرض الكل',
    'dashboard.timeTracker': 'متتبع الوقت',
    'dashboard.timeOff': 'الإجازات',
    'dashboard.courses': 'الدورات',
    'dashboard.ongoingTasks': 'المهام الجارية',
    'dashboard.recentProjects': 'المشاريع الأخيرة',
    'dashboard.welcome': 'مرحباً',
    'dashboard.checkedInToast': 'تم تسجيل الحضور',
    'dashboard.checkedInDesc': 'تم تسجيل حضورك.',
    'dashboard.checkedOutToast': 'تم تسجيل الخروج',
    'dashboard.checkedOutDesc': 'أتمنى لك يوماً سعيداً!',
    'dashboard.timeOffCount': '4 إجازة',
    'dashboard.requestsCount': '0 طلب',
    'dashboard.expensesCount': '16 مصروف',
    'dashboard.tasksCount': '18 مهمة',
    // More Page
    'more.myProfile': 'ملفي الشخصي',
    'more.myDashboard': 'لوحة التحكم',
    'more.language': 'اللغة',
    'more.myCourses': 'دوراتي',
    'more.privacyPolicy': 'سياسة الخصوصية',
    'more.termsAndConditions': 'الشروط والأحكام',
    'more.logOut': 'تسجيل الخروج',
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
