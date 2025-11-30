import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/UserNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';

export function TopBar() {
  return (
    <header className="h-14 md:h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
      {/* Left side - empty space for better balance */}
      <div className="flex-1" />

      {/* Right side - all controls */}
      <div className="flex items-center gap-1 md:gap-2">
        <LanguageToggle />
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative h-9 w-9 md:h-10 md:w-10">
          <Bell className="h-4 w-4 md:h-5 md:w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        
        <UserNav />
      </div>
    </header>
  );
}
