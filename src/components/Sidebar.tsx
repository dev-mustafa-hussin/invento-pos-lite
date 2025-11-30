import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  BarChart3,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function Sidebar() {
  const { t } = useTranslation();

  const navigation = [
    { name: t('app.dashboard'), href: '/', icon: LayoutDashboard },
    { name: t('app.products'), href: '/products', icon: Package },
    { name: t('app.sales'), href: '/sales', icon: ShoppingCart },
    { name: t('app.invoices'), href: '/invoices', icon: FileText },
    { name: t('app.reports'), href: '/reports', icon: BarChart3 },
    { name: t('app.settings'), href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">{t('app.title')}</h1>
        <p className="text-sm text-sidebar-foreground/60 mt-1">Inventory & Sales</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2024 Invento</p>
        </div>
      </div>
    </aside>
  );
}
