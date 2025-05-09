import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import { ProductionStatusBadge } from '../components/ui/StatusBadge';
import Tabs from '../components/ui/Tabs';
import { 
  Calendar, 
  List, 
  Grid, 
  Factory, 
  ArrowRight, 
  Users, 
  Filter,
  Settings,
  ChevronDown
} from 'lucide-react';
import { mockProductions, mockSuppliers, mockCustomers, mockProjects } from '../utils/mockData';
import { Production } from '../types';

const ProductionPage: React.FC = () => {
  const [viewType, setViewType] = useState<'list' | 'kanban' | 'calendar'>('list');
  const [filter, setFilter] = useState<{
    status: 'all' | 'scheduled' | 'in_progress' | 'completed' | 'blocked';
    supplier: string | null;
    project: string | null;
  }>({
    status: 'all',
    supplier: null,
    project: null
  });

  // Filter productions based on selected filters
  const filteredProductions = mockProductions.filter(production => {
    // Filter by status
    if (filter.status !== 'all' && production.status !== filter.status) {
      return false;
    }
    
    // Filter by supplier
    if (filter.supplier && production.supplier.id !== filter.supplier) {
      return false;
    }
    
    // Filter by project
    if (filter.project && production.projectId !== filter.project) {
      return false;
    }
    
    return true;
  });
  
  // Production table columns
  const productionColumns = [
    {
      key: 'project',
      header: 'Projet',
      render: (production: Production) => {
        const project = mockProjects.find(p => p.id === production.projectId);
        return (
          <div className="font-medium text-gray-900">
            {project?.name || 'Projet inconnu'}
          </div>
        );
      }
    },
    {
      key: 'supplierOrderId',
      header: 'Commande',
      render: (production: Production) => (
        <div className="text-sm text-gray-600">
          {production.supplierOrderId.replace('ord-s-', 'CMD-')}
        </div>
      )
    },
    {
      key: 'supplier',
      header: 'Fournisseur',
      render: (production: Production) => production.supplier.name
    },
    {
      key: 'machine',
      header: 'Machine',
      render: (production: Production) => production.machine || 'Non définie'
    },
    {
      key: 'startDate',
      header: 'Date de début',
      render: (production: Production) => new Date(production.startDate).toLocaleDateString()
    },
    {
      key: 'estimatedEndDate',
      header: 'Date de fin est.',
      render: (production: Production) => new Date(production.estimatedEndDate).toLocaleDateString()
    },
    {
      key: 'status',
      header: 'Statut',
      render: (production: Production) => <ProductionStatusBadge status={production.status} />
    },
    {
      key: 'progress',
      header: 'Avancement',
      render: (production: Production) => (
        <div className="w-full max-w-xs">
          <div className="bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ 
                width: production.status === 'completed' 
                  ? '100%' 
                  : production.status === 'in_progress' 
                    ? '40%' 
                    : '0%' 
              }}
            ></div>
          </div>
        </div>
      )
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
        <h1 className="text-2xl font-bold text-gray-800">Suivi de Production</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            leftIcon={<Filter size={16} />}
          >
            Filtres avancés
          </Button>
          <Button>
            Ajouter production
          </Button>
        </div>
      </div>

      {/* View type selector */}
      <Tabs
        tabs={[
          { id: 'list', label: 'Liste', icon: <List size={16} /> },
          { id: 'kanban', label: 'Kanban', icon: <Grid size={16} /> },
          { id: 'calendar', label: 'Calendrier', icon: <Calendar size={16} /> }
        ]}
        defaultTabId="list"
        onChange={(tabId) => setViewType(tabId as 'list' | 'kanban' | 'calendar')}
      />

      {/* Filter buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter.status === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter({ ...filter, status: 'all' })}
          >
            Toutes
          </Button>
          <Button
            variant={filter.status === 'scheduled' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter({ ...filter, status: 'scheduled' })}
          >
            Planifiées
          </Button>
          <Button
            variant={filter.status === 'in_progress' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter({ ...filter, status: 'in_progress' })}
          >
            En cours
          </Button>
          <Button
            variant={filter.status === 'completed' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter({ ...filter, status: 'completed' })}
          >
            Terminées
          </Button>
          <Button
            variant={filter.status === 'blocked' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter({ ...filter, status: 'blocked' })}
          >
            Bloquées
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Project filter */}
          <div className="dropdown inline-block relative">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Factory size={14} />}
              rightIcon={<ChevronDown className="ml-1" size={14} />}
            >
              {filter.project ? mockProjects.find(p => p.id === filter.project)?.name.substring(0, 15) + '...' : 'Tous projets'}
            </Button>
            <div className="dropdown-content hidden absolute bg-white min-w-[200px] shadow-lg z-10 rounded-md mt-1">
              <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => setFilter({ ...filter, project: null })}>
                Tous projets
              </div>
              {mockProjects.map(project => (
                <div 
                  key={project.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setFilter({ ...filter, project: project.id })}
                >
                  {project.name}
                </div>
              ))}
            </div>
          </div>

          {/* Supplier filter */}
          <Button
            variant={filter.supplier === null ? 'secondary' : 'outline'}
            size="sm"
            leftIcon={<Factory size={14} />}
            onClick={() => setFilter({ ...filter, supplier: null })}
          >
            Tous fournisseurs
          </Button>
          {mockSuppliers.slice(0, 2).map(supplier => (
            <Button
              key={supplier.id}
              variant={filter.supplier === supplier.id ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setFilter({ ...filter, supplier: supplier.id })}
            >
              {supplier.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Production data based on selected view */}
      {viewType === 'list' && (
        <Card>
          <Table
            columns={productionColumns}
            data={filteredProductions}
            keyExtractor={(item) => item.id}
            emptyMessage="Aucune production trouvée"
          />
        </Card>
      )}

      {viewType === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scheduled column */}
          <Card title="Planifiées" className="bg-blue-50">
            <div className="space-y-3">
              {filteredProductions
                .filter(p => p.status === 'scheduled')
                .map(production => (
                  <KanbanCard key={production.id} production={production} />
                ))}
              {filteredProductions.filter(p => p.status === 'scheduled').length === 0 && (
                <div className="text-center text-gray-500 py-6">Aucune production planifiée</div>
              )}
            </div>
          </Card>
          
          {/* In Progress column */}
          <Card title="En cours" className="bg-yellow-50">
            <div className="space-y-3">
              {filteredProductions
                .filter(p => p.status === 'in_progress')
                .map(production => (
                  <KanbanCard key={production.id} production={production} />
                ))}
              {filteredProductions.filter(p => p.status === 'in_progress').length === 0 && (
                <div className="text-center text-gray-500 py-6">Aucune production en cours</div>
              )}
            </div>
          </Card>
          
          {/* Completed column */}
          <Card title="Terminées" className="bg-green-50">
            <div className="space-y-3">
              {filteredProductions
                .filter(p => p.status === 'completed')
                .map(production => (
                  <KanbanCard key={production.id} production={production} />
                ))}
              {filteredProductions.filter(p => p.status === 'completed').length === 0 && (
                <div className="text-center text-gray-500 py-6">Aucune production terminée</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {viewType === 'calendar' && (
        <Card>
          <div className="p-4 text-center text-gray-500">
            Vue calendrier à implémenter
          </div>
        </Card>
      )}
    </div>
  );
};

// Kanban card component for production items
interface KanbanCardProps {
  production: Production;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ production }) => {
  const project = mockProjects.find(p => p.id === production.projectId);
  
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="font-medium text-gray-800">
          {project?.name || 'Projet inconnu'}
        </div>
        <ProductionStatusBadge status={production.status} />
      </div>
      
      <div className="flex items-center mt-2 text-sm text-gray-600">
        <Factory size={14} className="mr-1" />
        <span>{production.supplier.name}</span>
      </div>
      
      {production.machine && (
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <Settings size={14} className="mr-1" />
          <span>{production.machine}</span>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2 flex justify-between">
        <span>Début: {new Date(production.startDate).toLocaleDateString()}</span>
        <ArrowRight size={12} />
        <span>Fin: {new Date(production.estimatedEndDate).toLocaleDateString()}</span>
      </div>
      
      {production.status === 'in_progress' && (
        <div className="mt-2">
          <div className="bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: '40%' }}
            ></div>
          </div>
          <div className="text-xs text-right mt-1 text-gray-500">40%</div>
        </div>
      )}
    </div>
  );
};

export default ProductionPage;