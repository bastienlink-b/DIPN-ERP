import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import { Package, Search, Plus, ExternalLink, ChevronDown, ChevronUp, Box } from 'lucide-react';
import { mockProducts, mockPackaging } from '../utils/mockData';
import { Product, Component } from '../types';

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  // Toggle product expansion
  const toggleProductExpansion = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  // Filter products based on search query
  const filteredProducts = mockProducts.filter(
    product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.customerReference && product.customerReference.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Product table columns
  const productColumns = [
    {
      key: 'expand',
      header: '',
      className: 'w-12',
      render: (product: Product) => (
        <button
          onClick={() => toggleProductExpansion(product.id)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {expandedProduct === product.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )
    },
    {
      key: 'name',
      header: 'Produit',
      render: (product: Product) => (
        <div>
          <div className="font-medium text-gray-900">{product.name}</div>
          <div className="text-xs text-gray-500">Réf DIPN: {product.referenceNumber}</div>
          {product.customerReference && (
            <div className="text-xs text-gray-500">Réf client: {product.customerReference}</div>
          )}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (product: Product) => (
        <div className="text-sm text-gray-600 max-w-xs truncate">
          {product.description}
        </div>
      )
    },
    {
      key: 'project',
      header: 'Projet',
      render: (product: Product) => (
        <div className="text-sm">
          {product.projectNumber || 'N/A'}
        </div>
      )
    },
    {
      key: 'packaging',
      header: 'Colisage',
      render: (product: Product) => {
        const packaging = mockPackaging.find(p => p.productId === product.id);
        return packaging ? 
          <div className="text-sm">{packaging.unitsPerPackage} unités/colis, {packaging.packagesPerPallet} colis/palette</div> : 
          <div className="text-sm text-gray-500">Non défini</div>;
      }
    },
    {
      key: 'components',
      header: 'Composants',
      render: (product: Product) => (
        <div className="text-sm">
          {product.components.length} composants
        </div>
      )
    },
    {
      key: 'price',
      header: 'Prix unitaire',
      render: (product: Product) => (
        <div className="font-medium">
          {product.unitPrice.toFixed(2)} €
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
            Voir
          </Button>
        </div>
      )
    }
  ];

  // Component table columns
  const componentColumns = [
    {
      key: 'name',
      header: 'Nom',
      render: (component: Component) => (
        <div className="text-sm font-medium">
          {component.name}
        </div>
      )
    },
    {
      key: 'reference',
      header: 'Référence',
      render: (component: Component) => (
        <div className="text-sm">
          {component.referenceNumber}
        </div>
      )
    },
    {
      key: 'quantity',
      header: 'Quantité',
      render: (component: Component) => (
        <div className="text-sm font-medium">
          {component.quantity}
        </div>
      )
    },
    {
      key: 'suppliers',
      header: 'Fournisseurs',
      render: (component: Component) => (
        <div className="flex flex-wrap gap-1">
          {component.supplierIds.length > 0 ? (
            component.supplierIds.map((supplierId, index) => {
              const supplier = mockSuppliers.find(s => s.id === supplierId);
              return (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {supplier?.name || 'Inconnu'}
                </span>
              );
            })
          ) : (
            <span className="text-sm text-gray-500">Aucun fournisseur</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Produits</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            leftIcon={<Plus size={16} />}
          >
            Ajouter un produit
          </Button>
        </div>
      </div>

      {/* Product cards for quick access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockProducts.map(product => {
          const packaging = mockPackaging.find(p => p.productId === product.id);
          return (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-medium text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500">
                      Réf DIPN: {product.referenceNumber} 
                      {product.customerReference && ` | Réf Client: ${product.customerReference}`}
                    </p>
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {product.unitPrice.toFixed(2)} €
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                {product.description}
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                <span className="font-medium">Projet:</span> {product.projectNumber || 'N/A'}
              </div>
              
              {packaging && (
                <div className="mt-3 flex items-center text-xs text-gray-500">
                  <Box size={14} className="mr-1 text-gray-400" />
                  <span>Colisage: {packaging.unitsPerPackage} unités/colis, {packaging.packagesPerPallet} colis/palette</span>
                </div>
              )}
              
              <div className="mt-3 flex flex-wrap gap-1">
                {product.components.slice(0, 2).map(component => (
                  <span key={component.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {component.name}
                  </span>
                ))}
                {product.components.length > 2 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    +{product.components.length - 2} autres
                  </span>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t flex justify-end">
                <Button variant="outline" size="sm" rightIcon={<ExternalLink size={14} />}>
                  Détails
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main product table with expandable rows */}
      <Card>
        <Table
          columns={productColumns}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          emptyMessage="Aucun produit trouvé"
        />
        
        {/* Expanded product components */}
        {expandedProduct && (
          <div className="px-6 py-4 bg-gray-50 border-t">
            <h4 className="font-medium text-gray-700 mb-3">Composants</h4>
            <Table
              columns={componentColumns}
              data={mockProducts.find(p => p.id === expandedProduct)?.components || []}
              keyExtractor={(item) => item.id}
              emptyMessage="Aucun composant trouvé"
              className="bg-white border rounded-lg overflow-hidden"
            />
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Informations de conditionnement</h4>
              {expandedProduct && (
                <div className="bg-white border rounded-lg p-4">
                  {(() => {
                    const product = mockProducts.find(p => p.id === expandedProduct);
                    const packaging = mockPackaging.find(p => p.productId === expandedProduct);
                    
                    if (packaging) {
                      return (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600"><span className="font-medium">Description:</span> {packaging.description}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Type d'emballage:</span> {packaging.packagingType}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Unités par colis:</span> {packaging.unitsPerPackage}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Colis par palette:</span> {packaging.packagesPerPallet}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Dimensions palette:</span> {packaging.palletDimensions}</p>
                          <p className="text-sm text-gray-600"><span className="font-medium">Information complémentaire:</span> {product?.packagingInfo || 'Non spécifié'}</p>
                        </div>
                      );
                    } else {
                      return (
                        <p className="text-sm text-gray-600">
                          {product?.packagingInfo || 'Aucune information de conditionnement disponible.'}
                        </p>
                      );
                    }
                  })()}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductsPage;