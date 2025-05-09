import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import { OrderStatusBadge } from '../components/ui/StatusBadge';
import Tabs from '../components/ui/Tabs';
import { ClipboardList, ClipboardCheck, Plus, Filter, FolderOpen } from 'lucide-react';
import { mockCustomerOrders, mockSupplierOrders, mockProjects } from '../utils/mockData';
import { CustomerOrder, SupplierOrder, Project } from '../types';

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [orderFilter, setOrderFilter] = useState<'all' | 'open' | 'firm'>('all');
  const [projectFilter, setProjectFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all');

  // Filter orders based on selected filter
  const filteredCustomerOrders = mockCustomerOrders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.orderType === orderFilter;
  });

  const filteredSupplierOrders = mockSupplierOrders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.orderType === orderFilter;
  });

  // Filter projects
  const filteredProjects = mockProjects.filter(project => {
    if (projectFilter === 'all') return true;
    return project.status === projectFilter;
  });

  // Project table columns
  const projectColumns = [
    {
      key: 'name',
      header: 'Nom du projet',
      render: (project: Project) => (
        <div className="font-medium text-gray-900">{project.name}</div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (project: Project) => (
        <div className="max-w-xs truncate">{project.description}</div>
      )
    },
    {
      key: 'customer',
      header: 'Client',
      render: (project: Project) => {
        const customerOrder = mockCustomerOrders.find(order => order.id === project.customerOrderId);
        return customerOrder?.customer.name || 'Client inconnu';
      }
    },
    {
      key: 'date',
      header: 'Date de création',
      render: (project: Project) => new Date(project.createdDate).toLocaleDateString()
    },
    {
      key: 'status',
      header: 'Statut',
      render: (project: Project) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          project.status === 'new' ? 'bg-blue-100 text-blue-800' :
          project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {project.status === 'new' ? 'Nouveau' : 
           project.status === 'in_progress' ? 'En cours' : 'Terminé'}
        </span>
      )
    },
    {
      key: 'transport',
      header: 'Transport',
      render: (project: Project) => {
        const selectedTransport = project.transportCosts.find(t => t.selected);
        return selectedTransport ? 
          `${selectedTransport.transporterName} (${selectedTransport.cost} €)` : 
          'Non défini';
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

  // Customer order columns
  const customerOrderColumns = [
    {
      key: 'reference',
      header: 'Référence',
      render: (order: CustomerOrder) => (
        <div className="font-medium text-gray-900">{order.reference}</div>
      )
    },
    {
      key: 'project',
      header: 'Projet',
      render: (order: CustomerOrder) => {
        const project = mockProjects.find(p => p.id === order.projectId);
        return project ? project.name : 'Projet inconnu';
      }
    },
    {
      key: 'customer',
      header: 'Client',
      render: (order: CustomerOrder) => order.customer.name
    },
    {
      key: 'description',
      header: 'Description',
      render: (order: CustomerOrder) => (
        <div className="max-w-xs truncate">
          {order.products.map(p => p.description).join(', ')}
        </div>
      )
    },
    {
      key: 'orderType',
      header: 'Type',
      render: (order: CustomerOrder) => (
        <span className="capitalize">{order.orderType === 'open' ? 'Ouverte' : 'Ferme'}</span>
      )
    },
    {
      key: 'quantity',
      header: 'Quantité',
      render: (order: CustomerOrder) => order.products.reduce((sum, p) => sum + p.quantity, 0)
    },
    {
      key: 'requestedDate',
      header: 'Date souhaitée',
      render: (order: CustomerOrder) => new Date(order.requestedDate).toLocaleDateString()
    },
    {
      key: 'status',
      header: 'Statut',
      render: (order: CustomerOrder) => <OrderStatusBadge status={order.status} />
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

  // Supplier order columns
  const supplierOrderColumns = [
    {
      key: 'reference',
      header: 'Référence',
      render: (order: SupplierOrder) => (
        <div className="font-medium text-gray-900">{order.reference}</div>
      )
    },
    {
      key: 'project',
      header: 'Projet',
      render: (order: SupplierOrder) => {
        const project = mockProjects.find(p => p.id === order.projectId);
        return project ? project.name : 'Projet inconnu';
      }
    },
    {
      key: 'customerOrder',
      header: 'Commande client',
      render: (order: SupplierOrder) => {
        const customerOrder = mockCustomerOrders.find(co => co.id === order.customerOrderId);
        return customerOrder ? customerOrder.reference : 'Non liée';
      }
    },
    {
      key: 'supplier',
      header: 'Fournisseur',
      render: (order: SupplierOrder) => order.supplier.name
    },
    {
      key: 'description',
      header: 'Description',
      render: (order: SupplierOrder) => (
        <div className="max-w-xs truncate">
          {order.products.map(p => p.description).join(', ')}
        </div>
      )
    },
    {
      key: 'orderType',
      header: 'Type',
      render: (order: SupplierOrder) => (
        <span className="capitalize">{order.orderType === 'open' ? 'Ouverte' : 'Ferme'}</span>
      )
    },
    {
      key: 'quantity',
      header: 'Quantité',
      render: (order: SupplierOrder) => order.products.reduce((sum, p) => sum + p.quantity, 0)
    },
    {
      key: 'requestedDate',
      header: 'Date souhaitée',
      render: (order: SupplierOrder) => new Date(order.requestedDate).toLocaleDateString()
    },
    {
      key: 'status',
      header: 'Statut',
      render: (order: SupplierOrder) => <OrderStatusBadge status={order.status} />
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h1>
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
            {activeTab === 'projects' ? 'Nouveau projet' : 'Nouvelle commande'}
          </Button>
        </div>
      </div>

      {/* Tabs for Projects/Customer/Supplier orders */}
      <Tabs
        tabs={[
          { id: 'projects', label: 'Projets', icon: <FolderOpen size={16} /> },
          { id: 'customer', label: 'Commandes clients', icon: <ClipboardList size={16} /> },
          { id: 'supplier', label: 'C. fournisseurs', icon: <ClipboardCheck size={16} /> }
        ]}
        defaultTabId="projects"
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Project filters */}
      {activeTab === 'projects' && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={projectFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setProjectFilter('all')}
          >
            Tous
          </Button>
          <Button
            variant={projectFilter === 'new' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setProjectFilter('new')}
          >
            Nouveaux
          </Button>
          <Button
            variant={projectFilter === 'in_progress' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setProjectFilter('in_progress')}
          >
            En cours
          </Button>
          <Button
            variant={projectFilter === 'completed' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setProjectFilter('completed')}
          >
            Terminés
          </Button>
        </div>
      )}

      {/* Order Type filter */}
      {(activeTab === 'customer' || activeTab === 'supplier') && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={orderFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setOrderFilter('all')}
          >
            Toutes
          </Button>
          <Button
            variant={orderFilter === 'open' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setOrderFilter('open')}
          >
            Commandes ouvertes
          </Button>
          <Button
            variant={orderFilter === 'firm' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setOrderFilter('firm')}
          >
            Commandes fermes
          </Button>
        </div>
      )}

      {/* Project or Orders Table */}
      <Card>
        {activeTab === 'projects' ? (
          <Table
            columns={projectColumns}
            data={filteredProjects}
            keyExtractor={(item) => item.id}
            emptyMessage="Aucun projet trouvé"
          />
        ) : activeTab === 'customer' ? (
          <Table
            columns={customerOrderColumns}
            data={filteredCustomerOrders}
            keyExtractor={(item) => item.id}
            emptyMessage="Aucune commande client trouvée"
          />
        ) : (
          <Table
            columns={supplierOrderColumns}
            data={filteredSupplierOrders}
            keyExtractor={(item) => item.id}
            emptyMessage="Aucune commande fournisseur trouvée"
          />
        )}
      </Card>
    </div>
  );
};

export default OrdersPage;