import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Map routes to page titles
  const getTitleFromRoute = (pathname: string): string => {
    const routes: Record<string, string> = {
      '/': 'Tableau de bord',
      '/orders': 'Gestion des Commandes',
      '/production': 'Suivi de Production',
      '/logistics': 'Logistique',
      '/accounting': 'Comptabilité',
      '/contacts': 'Contacts',
      '/products': 'Produits'
    };
    
    return routes[pathname] || 'DIPN ERP';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col md:ml-64">
        <Header title={getTitleFromRoute(location.pathname)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;