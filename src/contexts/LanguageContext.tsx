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
    // Profile Page
    'profile.title': 'Profile',
    'profile.resume': 'Resume',
    'profile.workInfo': 'Work Info',
    'profile.privateInfo': 'Private Info',
    'profile.myAchievement': 'My Achievement',
    'profile.competencies': 'Competencies',
    'profile.workExperience': 'Work Experience',
    'profile.skills': 'Skills',
    'profile.privateContact': 'Private Contact',
    'profile.workAddress': 'Work Address',
    'profile.workLocation': 'Work Location',
    'profile.approvers': 'Approvers',
    'profile.expenses': 'Expenses',
    'profile.timeOff': 'Time Off',
    'profile.timeSheet': 'Time Sheet',
    'profile.attendance': 'Attendance',
    'profile.schedule': 'Schedule',
    'profile.workingHours': 'Working Hours',
    'profile.workLocationPlan': 'Work Location Plan',
    'profile.timeZone': 'Time Zone',
    'profile.planning': 'Planning',
    'profile.roles': 'Roles',
    'profile.noRoles': 'No Roles',
    'profile.organizationChart': 'Organization Chart',
    'profile.seeAll': 'See All',
    'profile.reportingStructure': 'Reporting Structure',
    'profile.manager': 'Manager',
    'profile.jobDescription': 'Job Description',
    'profile.noJobDescription': 'No job description available',
    'profile.privateAddress': 'Private Address',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.bankAccountNumber': 'Bank Account Number',
    'profile.language': 'Language',
    'profile.homeWorkDistance': 'Home Work Distance',
    'profile.privateCarPlate': 'Private Car Plate',
    'profile.familyStatus': 'Family Status',
    'profile.maritalStatus': 'Marital Status',
    'profile.maritalStatus.title': 'Marital Status',
    'profile.maritalStatus.single': 'Single',
    'profile.maritalStatus.married': 'Married',
    'profile.maritalStatus.cohabitant': 'Legal Cohabitant',
    'profile.maritalStatus.widower': 'Widower',
    'profile.maritalStatus.divorced': 'Divorced',
    'profile.numberOfChildren': 'Number of Children',
    'profile.emergency': 'Emergency',
    'profile.contactName': 'Contact Name',
    'profile.contactPhone': 'Contact Phone',
    'profile.education': 'Education',
    'profile.certificateLevel': 'Certificate Level',
    'profile.certificateLevel.graduate': 'Graduate',
    'profile.certificateLevel.bachelor': 'Bachelor',
    'profile.certificateLevel.master': 'Master',
    'profile.certificateLevel.doctor': 'Doctor',
    'profile.fieldOfStudy': 'Field of Study',
    'profile.school': 'School',
    'profile.getLevelUp': 'Get',
    'profile.xpToLevelUp': 'xp to level up!',
    'profile.badges': 'Badges',
    'profile.noBadges': 'No badges earned yet',
    'profile.current': 'Current',
    'common.save': 'Save',
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
    // Profile Page
    'profile.title': 'الملف الشخصي',
    'profile.resume': 'السيرة الذاتية',
    'profile.workInfo': 'معلومات العمل',
    'profile.privateInfo': 'المعلومات الخاصة',
    'profile.myAchievement': 'إنجازاتي',
    'profile.competencies': 'الكفاءات',
    'profile.workExperience': 'الخبرة العملية',
    'profile.skills': 'المهارات',
    'profile.privateContact': 'جهة الاتصال الخاصة',
    'profile.workAddress': 'عنوان العمل',
    'profile.workLocation': 'موقع العمل',
    'profile.approvers': 'الموافقون',
    'profile.expenses': 'المصروفات',
    'profile.timeOff': 'الإجازات',
    'profile.timeSheet': 'ورقة الوقت',
    'profile.attendance': 'الحضور',
    'profile.schedule': 'الجدول الزمني',
    'profile.workingHours': 'ساعات العمل',
    'profile.workLocationPlan': 'خطة موقع العمل',
    'profile.timeZone': 'المنطقة الزمنية',
    'profile.planning': 'التخطيط',
    'profile.roles': 'الأدوار',
    'profile.noRoles': 'لا توجد أدوار',
    'profile.organizationChart': 'الهيكل التنظيمي',
    'profile.seeAll': 'عرض الكل',
    'profile.reportingStructure': 'هيكل التقارير',
    'profile.manager': 'المدير',
    'profile.jobDescription': 'الوصف الوظيفي',
    'profile.noJobDescription': 'لا يوجد وصف وظيفي',
    'profile.privateAddress': 'العنوان الخاص',
    'profile.email': 'البريد الإلكتروني',
    'profile.phone': 'الهاتف',
    'profile.bankAccountNumber': 'رقم الحساب البنكي',
    'profile.language': 'اللغة',
    'profile.homeWorkDistance': 'المسافة بين المنزل والعمل',
    'profile.privateCarPlate': 'لوحة السيارة الخاصة',
    'profile.familyStatus': 'الحالة العائلية',
    'profile.maritalStatus': 'الحالة الاجتماعية',
    'profile.maritalStatus.title': 'الحالة الاجتماعية',
    'profile.maritalStatus.single': 'أعزب',
    'profile.maritalStatus.married': 'متزوج',
    'profile.maritalStatus.cohabitant': 'ساكن قانوني',
    'profile.maritalStatus.widower': 'أرمل',
    'profile.maritalStatus.divorced': 'مطلق',
    'profile.numberOfChildren': 'عدد الأطفال',
    'profile.emergency': 'الطوارئ',
    'profile.contactName': 'اسم جهة الاتصال',
    'profile.contactPhone': 'هاتف جهة الاتصال',
    'profile.education': 'التعليم',
    'profile.certificateLevel': 'مستوى الشهادة',
    'profile.certificateLevel.graduate': 'خريج',
    'profile.certificateLevel.bachelor': 'بكالوريوس',
    'profile.certificateLevel.master': 'ماجستير',
    'profile.certificateLevel.doctor': 'دكتوراه',
    'profile.fieldOfStudy': 'مجال الدراسة',
    'profile.school': 'المدرسة',
    'profile.getLevelUp': 'احصل على',
    'profile.xpToLevelUp': 'نقطة خبرة للارتقاء!',
    'profile.badges': 'الشارات',
    'profile.noBadges': 'لم يتم الحصول على شارات بعد',
    'profile.current': 'حالياً',
    'common.save': 'حفظ',
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
