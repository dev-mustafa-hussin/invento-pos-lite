import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';

export function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-background print:h-auto print:block">
      <div className="print:hidden h-full">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden print:h-auto print:overflow-visible print:block">
        <div className="print:hidden">
          <TopBar />
        </div>
        <main className="flex-1 overflow-y-auto p-6 print:h-auto print:overflow-visible print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
