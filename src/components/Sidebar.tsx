import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  BarChart3,
  Settings,
  Users,
  Clock,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { t } = useTranslation();

  const navigation = [
    { name: t('app.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('app.products'), href: '/products', icon: Package },
    { name: t('app.sales'), href: '/sales', icon: ShoppingCart },
    { name: t('app.invoices'), href: '/invoices', icon: FileText },
    { name: t('app.reports'), href: '/reports', icon: BarChart3 },
    { name: 'Employees', href: '/hr/employees', icon: Users },
    { name: 'Attendance', href: '/hr/attendance', icon: Clock },
    { name: 'Payroll', href: '/hr/payroll', icon: DollarSign },
    { name: 'Projects', href: '/projects', icon: Briefcase },
    { name: t('app.settings'), href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-sidebar-border">
        <h1 className="text-lg md:text-xl font-bold text-sidebar-foreground">{t('app.title')}</h1>
        <p className="text-xs md:text-sm text-sidebar-foreground/60 mt-1">Inventory & Sales</p>
      </div>
      
      <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors text-sm md:text-base"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 md:p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2024 Invento</p>
        </div>
      </div>
    </aside>
  );
}
