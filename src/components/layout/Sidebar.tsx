import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, ClipboardList, Factory, Truck, FileDown as FileDollar, Users, BoxIcon, LayoutDashboard, ChevronRight, Menu, X, Database } from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  to, 
  icon, 
  label, 
  active, 
  collapsed,
  onClick 
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-blue-700 text-white' 
          : 'text-gray-700 hover:bg-blue-50'
      }`}
      onClick={onClick}
    >
      <div className="text-lg">
        {icon}
      </div>
      {!collapsed && (
        <span className="ml-3 text-sm font-medium whitespace-nowrap">{label}</span>
      )}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-md shadow-md md:hidden"
        onClick={toggleMobileMenu}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full bg-white shadow-lg transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center justify-between p-4 border-b ${collapsed ? 'justify-center' : ''}`}>
            {!collapsed && (
              <div className="text-xl font-bold text-blue-900">DIPN ERP</div>
            )}
            <button 
              className={`p-1 rounded-md text-gray-500 hover:bg-gray-100 ${collapsed ? '' : 'ml-auto'}`} 
              onClick={toggleCollapse}
            >
              <ChevronRight size={20} className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <SidebarItem
              to="/"
              icon={<LayoutDashboard size={20} />}
              label="Tableau de bord"
              active={isActive('/')}
              collapsed={collapsed}
              onClick={closeMobileMenu}
            />
            <SidebarItem
              to="/orders"
              icon={<ClipboardList size={20} />}
              label="Commandes"
              active={isActive('/orders')}
              collapsed={collapsed}
              onClick={closeMobileMenu}
            />
            <SidebarItem
              to="/production"
              icon={<Factory size={20} />}
              label="Production"
              active={isActive('/production')}
              collapsed={collapsed}
              onClick={closeMobileMenu}
            />
            <SidebarItem
              to="/logistics"
              icon={<Truck size={20} />}
              label="Logistique"
              active={isActive('/logistics')}
              collapsed={collapsed}
              onClick={closeMobileMenu}
            />
            <SidebarItem
              to="/accounting"
              icon={<FileDollar size={20} />}
              label="Comptabilité"
              active={isActive('/accounting')}
              collapsed={collapsed}
              onClick={closeMobileMenu}
            />
            <SidebarItem
              to="/contacts"
              icon={<Users size={20} />}
              label="Contacts"
              active={isActive('/contacts')}
              collapsed={collapsed}
              onClick={closeMobileMenu}
            />
            <SidebarItem
              to="/products"
              icon={<Package size={20} />}
              label="Produits"
              active={isActive('/products')}
              collapsed={collapsed}
              onClick={closeMobileMenu}
            />
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <SidebarItem
                to="/notion-settings"
                icon={<Database size={20} />}
                label="Config. Notion"
                active={isActive('/notion-settings')}
                collapsed={collapsed}
                onClick={closeMobileMenu}
              />
            </div>
          </nav>

          <div className="p-4 border-t">
            {!collapsed && (
              <div className="text-xs text-gray-500 text-center">
                DIPN ERP v1.0
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;