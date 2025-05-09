import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Tabs from '../components/ui/Tabs';
import { PaymentStatusBadge } from '../components/ui/StatusBadge';
import { FileDown as FileDollar, CreditCard, Filter, Plus, ChevronRight, Receipt, CheckCircle2, XCircle, Briefcase } from 'lucide-react';
import { mockInvoices, mockCustomers, mockProjects } from '../utils/mockData';
import { Invoice } from '../types';

const AccountingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  // Calculate some summary statistics
  const totalInvoicesAmount = mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const pendingAmount = mockInvoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidAmount = mockInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
    
  // Filter invoices based on selected status and project
  const filteredInvoices = mockInvoices.filter(inv => {
    // Status filter
    if (statusFilter !== 'all' && inv.status !== statusFilter) {
      return false;
    }
    
    // Project filter
    if (projectFilter && inv.projectId !== projectFilter) {
      return false;
    }
    
    return true;
  });

  // Invoice table columns
  const invoiceColumns = [
    {
      key: 'referenceNumber',
      header: 'Référence',
      render: (invoice: Invoice) => (
        <div className="font-medium text-gray-900">{invoice.referenceNumber}</div>
      )
    },
    {
      key: 'project',
      header: 'Projet',
      render: (invoice: Invoice) => {
        const project = mockProjects.find(p => p.id === invoice.projectId);
        return project ? project.name : 'Projet inconnu';
      }
    },
    {
      key: 'customer',
      header: 'Client',
      render: (invoice: Invoice) => {
        const customer = mockCustomers.find(c => c.id === invoice.customerId);
        return customer ? customer.name : 'Client inconnu';
      }
    },
    {
      key: 'date',
      header: 'Date',
      render: (invoice: Invoice) => new Date(invoice.date).toLocaleDateString()
    },
    {
      key: 'dueDate',
      header: 'Échéance',
      render: (invoice: Invoice) => new Date(invoice.dueDate).toLocaleDateString()
    },
    {
      key: 'totalAmount',
      header: 'Montant',
      render: (invoice: Invoice) => `${invoice.totalAmount.toFixed(2)} €`
    },
    {
      key: 'status',
      header: 'Statut',
      render: (invoice: Invoice) => <PaymentStatusBadge status={invoice.status} />
    },
    {
      key: 'actions',
      header: '',
      render: (invoice: Invoice) => (
        <div className="flex space-x-2">
          {invoice.status === 'pending' || invoice.status === 'overdue' ? (
            <Button variant="outline" size="sm" leftIcon={<CheckCircle2 size={14} />}>
              Marquer payée
            </Button>
          ) : null}
          <Button variant="outline" size="sm">
            Détails
          </Button>
        </div>
      )
    }
  ];

  // Project costs table columns
  const projectCostsColumns = [
    {
      key: 'name',
      header: 'Projet',
      render: (project: typeof mockProjects[0]) => (
        <div className="font-medium text-gray-900">{project.name}</div>
      )
    },
    {
      key: 'customer',
      header: 'Client',
      render: (project: typeof mockProjects[0]) => {
        const customerOrder = mockCustomerOrders.find(order => order.id === project.customerOrderId);
        return customerOrder?.customer.name || 'Client inconnu';
      }
    },
    {
      key: 'revenue',
      header: 'Revenus',
      render: (project: typeof mockProjects[0]) => {
        const invoices = mockInvoices.filter(inv => inv.projectId === project.id);
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        return `${totalRevenue.toFixed(2)} €`;
      }
    },
    {
      key: 'expenses',
      header: 'Dépenses',
      render: (project: typeof mockProjects[0]) => {
        // For now, just use transport costs as example expenses
        const transportCosts = project.transportCosts.reduce((sum, t) => {
          return sum + (t.selected ? t.cost : 0);
        }, 0);
        return `${transportCosts.toFixed(2)} €`;
      }
    },
    {
      key: 'transportCosts',
      header: 'Coûts de transport',
      render: (project: typeof mockProjects[0]) => {
        const selectedTransport = project.transportCosts.find(t => t.selected);
        return selectedTransport ? 
          `${selectedTransport.transporterName} (${selectedTransport.cost} €)` : 
          'Non défini';
      }
    },
    {
      key: 'profit',
      header: 'Marge',
      render: (project: typeof mockProjects[0]) => {
        const invoices = mockInvoices.filter(inv => inv.projectId === project.id);
        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
        
        const transportCosts = project.transportCosts.reduce((sum, t) => {
          return sum + (t.selected ? t.cost : 0);
        }, 0);
        
        // This is simplified - in a real app you'd have more expense categories
        const profit = totalRevenue - transportCosts;
        const profitClass = profit >= 0 ? 'text-green-600' : 'text-red-600';
        
        return <span className={`font-medium ${profitClass}`}>{profit.toFixed(2)} €</span>;
      }
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <Button variant="outline" size="sm">
          Détails
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Comptabilité</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
          >
            Filtres avancés
          </Button>
          <Button
            leftIcon={<Plus size={16} />}
          >
            Nouvelle facture
          </Button>
        </div>
      </div>

      {/* Financial summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total facturé</p>
              <p className="text-2xl font-bold">{totalInvoicesAmount.toFixed(2)} €</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <FileDollar size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold">{pendingAmount.toFixed(2)} €</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Receipt size={24} className="text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Payé</p>
              <p className="text-2xl font-bold">{paidAmount.toFixed(2)} €</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle2 size={24} className="text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'invoices', label: 'Factures clients', icon: <FileDollar size={16} /> },
          { id: 'payments', label: 'Paiements fournisseurs', icon: <CreditCard size={16} /> },
          { id: 'project_costs', label: 'Coûts par projet', icon: <Briefcase size={16} /> }
        ]}
        defaultTabId="invoices"
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Invoice status filter */}
      {activeTab === 'invoices' && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Toutes
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('pending')}
          >
            En attente
          </Button>
          <Button
            variant={statusFilter === 'paid' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('paid')}
          >
            Payées
          </Button>
          <Button
            variant={statusFilter === 'overdue' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('overdue')}
          >
            En retard
          </Button>
        </div>
      )}

      {/* Project filter for invoices */}
      {activeTab === 'invoices' && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={projectFilter === null ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setProjectFilter(null)}
          >
            Tous projets
          </Button>
          {mockProjects.map(project => (
            <Button
              key={project.id}
              variant={projectFilter === project.id ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setProjectFilter(project.id)}
            >
              {project.name.length > 20 ? project.name.substring(0, 20) + '...' : project.name}
            </Button>
          ))}
        </div>
      )}

      {/* Main content based on tab */}
      {activeTab === 'invoices' ? (
        <Card>
          <Table
            columns={invoiceColumns}
            data={filteredInvoices}
            keyExtractor={(item) => item.id}
            emptyMessage="Aucune facture trouvée"
          />
        </Card>
      ) : activeTab === 'project_costs' ? (
        <Card>
          <Table
            columns={projectCostsColumns}
            data={mockProjects}
            keyExtractor={(item) => item.id}
            emptyMessage="Aucun projet trouvé"
          />
        </Card>
      ) : (
        <Card>
          <div className="p-6 text-center text-gray-500">
            Contenu à implémenter pour l'onglet Paiements fournisseurs
          </div>
        </Card>
      )}
      
      {/* Recent payments */}
      {activeTab === 'invoices' && mockInvoices.some(inv => inv.status === 'paid') && (
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Paiements récents</h2>
          <Card>
            <div className="divide-y">
              {mockInvoices
                .filter(inv => inv.status === 'paid')
                .map(invoice => {
                  const customer = mockCustomers.find(c => c.id === invoice.customerId);
                  const project = mockProjects.find(p => p.id === invoice.projectId);
                  return (
                    <div key={invoice.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{invoice.referenceNumber}</div>
                        <div className="text-sm text-gray-500">{customer?.name} - {project?.name}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-4">
                          <div className="font-medium">{invoice.totalAmount.toFixed(2)} €</div>
                          <div className="text-sm text-gray-500">
                            Payé le: {invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <CheckCircle2 size={16} className="text-green-600" />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AccountingPage;