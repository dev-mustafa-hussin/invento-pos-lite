import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <div className="flex h-screen w-full bg-background print:h-auto print:block">
      {/* Mobile hamburger button - position changes based on RTL/LTR */}
      <Button
        variant="ghost"
        size="icon"
        className={`
          fixed top-4 z-50 lg:hidden print:hidden
          ${isRTL ? 'right-4' : 'left-4'}
        `}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - slides from correct side based on RTL/LTR */}
      <div
        className={`
          fixed lg:static inset-y-0 z-40
          transform lg:transform-none transition-transform duration-300 ease-in-out
          print:hidden h-full
          ${isRTL ? 'right-0' : 'left-0'}
          ${sidebarOpen 
            ? 'translate-x-0' 
            : isRTL 
              ? 'translate-x-full lg:translate-x-0' 
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden print:h-auto print:overflow-visible print:block">
        <div className="print:hidden">
          <TopBar />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 print:h-auto print:overflow-visible print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
