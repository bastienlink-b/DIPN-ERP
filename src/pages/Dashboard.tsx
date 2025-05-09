import React from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ChevronRight, ClipboardList, Factory, Truck, FileDown as FileDollar, AlertCircle } from 'lucide-react';
import { OrderStatusBadge, ProductionStatusBadge } from '../components/ui/StatusBadge';
import { mockCustomerOrders, mockSupplierOrders, mockProductions, mockInvoices, mockProjects } from '../utils/mockData';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  // Get only recent or important data for dashboard
  const recentCustomerOrders = mockCustomerOrders.slice(0, 3);
  const pendingProductions = mockProductions.filter(p => p.status === 'in_progress' || p.status === 'scheduled');
  const overdueInvoices = mockInvoices.filter(
    i => i.status === 'pending' && new Date(i.dueDate) < new Date()
  );

  // Calculate some summary statistics
  const totalCustomerOrders = mockCustomerOrders.length;
  const totalSupplierOrders = mockSupplierOrders.length;
  const ongoingProductions = mockProductions.filter(p => p.status === 'in_progress').length;
  const pendingInvoices = mockInvoices.filter(i => i.status === 'pending').length;
  const activeProjects = mockProjects.filter(p => p.status === 'in_progress' || p.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header with welcome message */}
      <div className="bg-blue-600 -mx-6 -mt-6 px-6 py-8 md:rounded-xl">
        <h1 className="text-2xl font-bold text-white">Bienvenue sur l'ERP DIPN</h1>
        <p className="text-blue-100 mt-2">Gérez vos commandes, production et logistique en un seul endroit</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Projets actifs" 
          value={activeProjects.toString()} 
          icon={<ClipboardList className="text-blue-500" />} 
          to="/orders"
        />
        <StatCard 
          title="Commandes clients" 
          value={totalCustomerOrders.toString()} 
          icon={<ClipboardList className="text-blue-500" />} 
          to="/orders"
        />
        <StatCard 
          title="C. fournisseurs" 
          value={totalSupplierOrders.toString()} 
          icon={<Factory className="text-green-500" />} 
          to="/production"
        />
        <StatCard 
          title="En production" 
          value={ongoingProductions.toString()} 
          icon={<Truck className="text-orange-500" />} 
          to="/logistics"
        />
        <StatCard 
          title="Factures en attente" 
          value={pendingInvoices.toString()} 
          icon={<FileDollar className="text-purple-500" />} 
          to="/accounting"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders/Projects */}
        <Card title="Projets récents" className="h-full">
          <div className="space-y-4">
            {mockProjects.map(project => {
              const customerOrder = mockCustomerOrders.find(order => order.id === project.customerOrderId);
              return (
                <div key={project.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-500">
                      {customerOrder?.customer.name || 'Client inconnu'} - {new Date(project.createdDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {project.status === 'new' ? 'Nouveau' : 
                       project.status === 'in_progress' ? 'En cours' : 'Terminé'}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
            <Link to="/orders">
              <Button 
                variant="outline" 
                rightIcon={<ChevronRight size={16} />}
                className="mt-2"
              >
                Voir tous les projets
              </Button>
            </Link>
          </div>
        </Card>

        {/* Production Status */}
        <Card title="Production en cours" className="h-full">
          <div className="space-y-4">
            {pendingProductions.map(production => {
              const project = mockProjects.find(p => p.id === production.projectId);
              return (
                <div key={production.id} className="flex flex-col border-b pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{project?.name || 'Projet inconnu'}</div>
                    <ProductionStatusBadge status={production.status} />
                  </div>
                  <div className="text-sm text-gray-500">Fournisseur: {production.supplier.name}</div>
                  {production.machine && (
                    <div className="text-xs text-gray-500">Machine: {production.machine}</div>
                  )}
                  <div className="mt-2 bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: production.status === 'in_progress' ? '40%' : '0%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Début: {new Date(production.startDate).toLocaleDateString()} • 
                    Fin prévue: {new Date(production.estimatedEndDate).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
            <Link to="/production">
              <Button 
                variant="outline" 
                rightIcon={<ChevronRight size={16} />}
                className="mt-2"
              >
                Voir toute la production
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Alerts section */}
      {overdueInvoices.length > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <div className="flex items-start">
            <div className="mr-4">
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <div>
              <h3 className="font-medium">Attention: {overdueInvoices.length} factures en retard de paiement</h3>
              <p className="text-sm text-gray-600 mt-1">
                Plusieurs factures ont dépassé leur date d'échéance et nécessitent une action immédiate.
              </p>
              <Link to="/accounting">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2"
                >
                  Gérer les factures
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  to: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, to }) => {
  return (
    <Link to={to}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gray-100">{icon}</div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-500 whitespace-nowrap">{title}</div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default Dashboard;