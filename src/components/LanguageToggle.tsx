import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    // Update document direction based on language
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-10 px-3 font-semibold"
    >
      {currentLang === 'ar' ? (
        <span className="flex items-center gap-2">
          <span className="text-lg">🇺🇸</span>
          <span>EN</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="text-lg">🇸🇦</span>
          <span>AR</span>
        </span>
      )}
    </Button>
  );
}
