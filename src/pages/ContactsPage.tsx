import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Tabs from '../components/ui/Tabs';
import { UserCircle2, Users, Building2, Search, Plus, Mail, Phone } from 'lucide-react';
import { mockCustomers, mockSuppliers } from '../utils/mockData';
import { Customer, Supplier } from '../types';

const ContactsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter contacts based on search query
  const filteredCustomers = mockCustomers.filter(
    customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuppliers = mockSuppliers.filter(
    supplier => 
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Customer table columns
  const customerColumns = [
    {
      key: 'name',
      header: 'Nom',
      render: (customer: Customer) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Building2 size={20} className="text-gray-500" />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{customer.name}</div>
            <div className="text-sm text-gray-500">{customer.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (customer: Customer) => (
        <div>
          <div className="flex items-center text-sm text-gray-500">
            <Mail size={14} className="mr-1" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Phone size={14} className="mr-1" />
            <span>{customer.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'address',
      header: 'Adresse',
      render: (customer: Customer) => (
        <div className="text-sm text-gray-500 max-w-xs truncate">
          {customer.address}
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Modifier
          </Button>
          <Button variant="outline" size="sm">
            Détails
          </Button>
        </div>
      )
    }
  ];

  // Supplier table columns
  const supplierColumns = [
    {
      key: 'name',
      header: 'Nom',
      render: (supplier: Supplier) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Building2 size={20} className="text-gray-500" />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{supplier.name}</div>
            <div className="text-sm text-gray-500">{supplier.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (supplier: Supplier) => (
        <div>
          <div className="flex items-center text-sm text-gray-500">
            <Mail size={14} className="mr-1" />
            <span>{supplier.email}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <Phone size={14} className="mr-1" />
            <span>{supplier.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'specialties',
      header: 'Spécialités',
      render: (supplier: Supplier) => (
        <div className="flex flex-wrap gap-1">
          {supplier.specialties.map((specialty, index) => (
            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {specialty}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'address',
      header: 'Adresse',
      render: (supplier: Supplier) => (
        <div className="text-sm text-gray-500 max-w-xs truncate">
          {supplier.address}
        </div>
      )
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Modifier
          </Button>
          <Button variant="outline" size="sm">
            Détails
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Contacts</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un contact..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            leftIcon={<Plus size={16} />}
          >
            Ajouter un contact
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'customers', label: 'Clients', icon: <UserCircle2 size={16} /> },
          { id: 'suppliers', label: 'Fournisseurs', icon: <Users size={16} /> }
        ]}
        defaultTabId="customers"
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Contact cards for quick access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeTab === 'customers' 
          ? mockCustomers.slice(0, 3).map(customer => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 size={24} className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone size={16} className="mr-2 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-500">
                    <Building2 size={16} className="mr-2 mt-0.5 text-gray-400" />
                    <span>{customer.address}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button size="sm" variant="outline">Voir détails</Button>
                </div>
              </Card>
            ))
          : mockSuppliers.slice(0, 3).map(supplier => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 size={24} className="text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                    <p className="text-sm text-gray-500">{supplier.email}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone size={16} className="mr-2 text-gray-400" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {supplier.specialties.map((specialty, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button size="sm" variant="outline">Voir détails</Button>
                </div>
              </Card>
            ))
        }
      </div>

      {/* Main contact table */}
      <Card>
        {activeTab === 'customers' ? (
          <Table
            columns={customerColumns}
            data={filteredCustomers}
            keyExtractor={(item) => item.id}
            emptyMessage="Aucun client trouvé"
          />
        ) : (
          <Table
            columns={supplierColumns}
            data={filteredSuppliers}
            keyExtractor={(item) => item.id}
            emptyMessage="Aucun fournisseur trouvé"
          />
        )}
      </Card>
    </div>
  );
};

export default ContactsPage;