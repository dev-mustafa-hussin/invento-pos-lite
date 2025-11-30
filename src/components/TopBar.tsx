import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/UserNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { useTranslation } from 'react-i18next';

export function TopBar() {
  const { i18n } = useTranslation();
  
  const getDateString = () => {
    const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US';
    return new Date().toLocaleDateString(locale, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {i18n.language === 'ar' ? 'مرحباً بك!' : 'Welcome back!'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {getDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <UserNav />
      </div>
    </header>
  );
}
