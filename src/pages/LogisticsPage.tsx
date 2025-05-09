import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import Tabs from '../components/ui/Tabs';
import { ShipmentStatusBadge } from '../components/ui/StatusBadge';
import { 
  Truck, 
  Package, 
  ArrowRightLeft, 
  Box, 
  Plus, 
  Filter,
  ArrowRight
} from 'lucide-react';
import { mockStockItems, mockShipments, mockStockLocations, mockProducts, mockPackaging } from '../utils/mockData';
import { StockItem, Shipment, Packaging } from '../types';

const LogisticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stock');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Get unique product references for stock data
  const productMap = mockProducts.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {} as Record<string, typeof mockProducts[0]>);

  // Filter stock items by selected location
  const filteredStockItems = selectedLocation 
    ? mockStockItems.filter(item => item.locationId === selectedLocation)
    : mockStockItems;

  // Stock table columns
  const stockColumns = [
    {
      key: 'product',
      header: 'Produit',
      render: (item: StockItem) => (
        <div>
          <div className="font-medium text-gray-900">{productMap[item.productId]?.name || 'Produit inconnu'}</div>
          <div className="text-xs text-gray-500">Réf DIPN: {item.dipnReference || productMap[item.productId]?.referenceNumber || ''}</div>
          <div className="text-xs text-gray-500">Réf Client: {item.clientReference || productMap[item.productId]?.customerReference || ''}</div>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Emplacement',
      render: (item: StockItem) => {
        const location = mockStockLocations.find(loc => loc.id === item.locationId);
        return location ? location.name : 'Inconnu';
      }
    },
    {
      key: 'quantity',
      header: 'Quantité',
      render: (item: StockItem) => (
        <span className={item.quantity > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {item.quantity}
        </span>
      )
    },
    {
      key: 'packaging',
      header: 'Colisage',
      render: (item: StockItem) => {
        const packaging = mockPackaging.find(pkg => pkg.productId === item.productId);
        return packaging ? 
          `${packaging.unitsPerPackage} unités / ${packaging.packagesPerPallet} colis par palette` : 
          'Non défini';
      }
    },
    {
      key: 'lastUpdated',
      header: 'Dernière mise à jour',
      render: (item: StockItem) => new Date(item.lastUpdated).toLocaleDateString()
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Ajuster
          </Button>
          <Button variant="outline" size="sm">
            Historique
          </Button>
        </div>
      )
    }
  ];

  // Shipment table columns
  const shipmentColumns = [
    {
      key: 'id',
      header: 'Référence',
      render: (shipment: Shipment) => (
        <div className="font-medium text-gray-900">EXP-{shipment.id.substring(5)}</div>
      )
    },
    {
      key: 'project',
      header: 'Projet',
      render: (shipment: Shipment) => {
        const relatedProducts = mockStockItems
          .filter(item => item.locationId === shipment.to.id)
          .map(item => productMap[item.productId]?.name)
          .filter(Boolean);
        
        return relatedProducts.length > 0 ? 
          relatedProducts.join(', ') : 
          'Transport non associé à un produit';
      }
    },
    {
      key: 'from',
      header: 'Origine',
      render: (shipment: Shipment) => shipment.from.name
    },
    {
      key: 'to',
      header: 'Destination',
      render: (shipment: Shipment) => shipment.to.name
    },
    {
      key: 'scheduledDate',
      header: 'Date prévue',
      render: (shipment: Shipment) => new Date(shipment.scheduledDate).toLocaleDateString()
    },
    {
      key: 'transporter',
      header: 'Transporteur',
      render: (shipment: Shipment) => shipment.transporter
    },
    {
      key: 'cost',
      header: 'Coût',
      render: (shipment: Shipment) => `${shipment.transportCost} €`
    },
    {
      key: 'status',
      header: 'Statut',
      render: (shipment: Shipment) => <ShipmentStatusBadge status={shipment.status} />
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

  // Packaging table columns
  const packagingColumns = [
    {
      key: 'product',
      header: 'Produit',
      render: (packaging: Packaging) => {
        const product = mockProducts.find(p => p.id === packaging.productId);
        return (
          <div>
            <div className="font-medium text-gray-900">{product?.name || 'Produit inconnu'}</div>
            <div className="text-xs text-gray-500">Réf DIPN: {product?.referenceNumber || ''}</div>
            <div className="text-xs text-gray-500">Réf Client: {product?.customerReference || ''}</div>
          </div>
        );
      }
    },
    {
      key: 'description',
      header: 'Description',
      render: (packaging: Packaging) => packaging.description
    },
    {
      key: 'type',
      header: 'Type',
      render: (packaging: Packaging) => packaging.packagingType
    },
    {
      key: 'unitsPerPackage',
      header: 'Unités par colis',
      render: (packaging: Packaging) => packaging.unitsPerPackage
    },
    {
      key: 'packagesPerPallet',
      header: 'Colis par palette',
      render: (packaging: Packaging) => packaging.packagesPerPallet
    },
    {
      key: 'palletDimensions',
      header: 'Dimensions palette',
      render: (packaging: Packaging) => packaging.palletDimensions
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <Button variant="outline" size="sm">
          Modifier
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Logistique</h1>
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
            {activeTab === 'stock' ? 'Mouvement stock' : 
             activeTab === 'shipments' ? 'Nouvelle expédition' :
             activeTab === 'packaging' ? 'Ajouter colisage' : 'Nouveau'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'stock', label: 'Stocks', icon: <Box size={16} /> },
          { id: 'shipments', label: 'Expéditions', icon: <Truck size={16} /> },
          { id: 'movements', label: 'Mouvements', icon: <ArrowRightLeft size={16} /> },
          { id: 'delivery', label: 'Bons de livraison', icon: <Package size={16} /> },
          { id: 'packaging', label: 'Colisage', icon: <Package size={16} /> }
        ]}
        defaultTabId="stock"
        onChange={(tabId) => setActiveTab(tabId)}
      />

      {/* Stock tab content */}
      {activeTab === 'stock' && (
        <>
          {/* Location filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedLocation === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedLocation(null)}
            >
              Tous les sites
            </Button>
            {mockStockLocations.map(location => (
              <Button
                key={location.id}
                variant={selectedLocation === location.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedLocation(location.id)}
              >
                {location.name}
              </Button>
            ))}
          </div>

          {/* Stock summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockProducts.slice(0, 3).map(product => {
              const totalStock = mockStockItems
                .filter(item => item.productId === product.id)
                .reduce((sum, item) => sum + item.quantity, 0);
              
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.referenceNumber}</p>
                      <p className="text-xs text-gray-500">Réf client: {product.customerReference || 'N/A'}</p>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{totalStock}</div>
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    {mockStockItems
                      .filter(item => item.productId === product.id)
                      .map(item => {
                        const location = mockStockLocations.find(loc => loc.id === item.locationId);
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{location?.name}</span>
                            <span className={`font-medium ${item.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.quantity}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </Card>
              );
            })}
          </div>

          <Card>
            <Table
              columns={stockColumns}
              data={filteredStockItems}
              keyExtractor={(item) => item.id}
              emptyMessage="Aucun stock trouvé"
            />
          </Card>
        </>
      )}

      {/* Shipments tab content */}
      {activeTab === 'shipments' && (
        <>
          {/* Shipment cards for upcoming deliveries */}
          <h2 className="text-lg font-medium text-gray-800 mt-6">Expéditions à venir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockShipments.filter(s => s.status === 'scheduled').map(shipment => (
              <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <h3 className="font-medium">EXP-{shipment.id.substring(5)}</h3>
                  <ShipmentStatusBadge status={shipment.status} />
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="text-gray-600">
                    <div className="font-medium">{shipment.from.name}</div>
                    <div>Origine</div>
                  </div>
                  
                  <ArrowRight className="text-gray-400" size={20} />
                  
                  <div className="text-gray-600 text-right">
                    <div className="font-medium">{shipment.to.name}</div>
                    <div>Destination</div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between text-sm text-gray-600">
                  <div>
                    <div>Date prévue:</div>
                    <div className="font-medium">{new Date(shipment.scheduledDate).toLocaleDateString()}</div>
                  </div>
                  
                  <div>
                    <div>Transporteur:</div>
                    <div className="font-medium">{shipment.transporter}</div>
                  </div>
                  
                  <div>
                    <div>Coût:</div>
                    <div className="font-medium">{shipment.transportCost} €</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button size="sm">Gérer</Button>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <Table
              columns={shipmentColumns}
              data={mockShipments}
              keyExtractor={(item) => item.id}
              emptyMessage="Aucune expédition trouvée"
            />
          </Card>
        </>
      )}

      {/* Packaging tab content */}
      {activeTab === 'packaging' && (
        <Card>
          <Table
            columns={packagingColumns}
            data={mockPackaging}
            keyExtractor={(item) => item.id}
            emptyMessage="Aucune information de colisage trouvée"
          />
        </Card>
      )}

      {/* Placeholder for other tabs */}
      {(activeTab === 'movements' || activeTab === 'delivery') && (
        <Card>
          <div className="p-6 text-center text-gray-500">
            Contenu à implémenter pour l'onglet {activeTab === 'movements' ? 'Mouvements' : 'Bons de livraison'}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LogisticsPage;