import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';
import ProductionPage from './pages/ProductionPage';
import LogisticsPage from './pages/LogisticsPage';
import AccountingPage from './pages/AccountingPage';
import ContactsPage from './pages/ContactsPage';
import ProductsPage from './pages/ProductsPage';
import NotionSettingsPage from './pages/NotionSettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="production" element={<ProductionPage />} />
          <Route path="logistics" element={<LogisticsPage />} />
          <Route path="accounting" element={<AccountingPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="notion-settings" element={<NotionSettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;