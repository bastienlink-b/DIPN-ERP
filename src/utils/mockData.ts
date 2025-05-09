import { 
  CustomerOrder,
  SupplierOrder,
  Customer,
  Supplier,
  Production,
  StockLocation,
  StockItem,
  Shipment,
  Invoice,
  Product,
  Project,
  Packaging
} from '../types';

// Mock customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'SPIT',
    email: 'contact@spit.fr',
    phone: '01 23 45 67 89',
    address: '123 Avenue de l\'Industrie, 75001 Paris'
  },
  {
    id: 'cust-2',
    name: 'Bostik',
    email: 'commercial@bostik.fr',
    phone: '01 23 45 67 90',
    address: '456 Rue de la Production, 69002 Lyon'
  },
  {
    id: 'cust-3',
    name: 'Renault',
    email: 'achats@renault.fr',
    phone: '01 23 45 67 91',
    address: '789 Boulevard Automobile, 92300 Levallois-Perret'
  }
];

// Mock suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: 'supp-1',
    name: 'FALK',
    email: 'contact@falk.fr',
    phone: '01 23 45 67 92',
    address: '10 Rue de la Plasturgie, 01000 Bourg-en-Bresse',
    specialties: ['Injection plastique']
  },
  {
    id: 'supp-2',
    name: 'FAILLARD',
    email: 'production@faillard.fr',
    phone: '01 23 45 67 93',
    address: '20 Chemin des Moules, 38000 Grenoble',
    specialties: ['Injection plastique', 'Soufflage']
  },
  {
    id: 'supp-3',
    name: 'ALVIPLAST',
    email: 'info@alviplast.fr',
    phone: '01 23 45 67 94',
    address: '30 Avenue de la Transformation, 59000 Lille',
    specialties: ['Soufflage']
  },
  {
    id: 'supp-4',
    name: 'BELLIJARDIN',
    email: 'operations@bellijardin.fr',
    phone: '01 23 45 67 95',
    address: '40 Route Industrielle, 44000 Nantes',
    specialties: ['Injection plastique', 'Soufflage', 'Assemblage']
  }
];

// Mock products
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    referenceNumber: 'DIPN-M100',
    customerReference: 'SPIT-M100-OR',
    name: 'Mallette Orange',
    description: 'Mallette en plastique orange pour outillage',
    projectNumber: 'P2023-01',
    components: [
      {
        id: 'comp-1',
        name: 'Base mallette',
        referenceNumber: 'COMP-BASE-M100',
        quantity: 1,
        supplierIds: ['supp-1', 'supp-2']
      },
      {
        id: 'comp-2',
        name: 'Couvercle mallette',
        referenceNumber: 'COMP-COUV-M100',
        quantity: 1,
        supplierIds: ['supp-1', 'supp-2']
      },
      {
        id: 'comp-3',
        name: 'Charnière',
        referenceNumber: 'COMP-CHAR-STD',
        quantity: 2,
        supplierIds: ['supp-3']
      },
      {
        id: 'comp-4',
        name: 'Fermeture clip',
        referenceNumber: 'COMP-CLIP-M100',
        quantity: 2,
        supplierIds: ['supp-2', 'supp-4']
      }
    ],
    packagingInfo: 'Palette 80x120, 100 pièces par palette, emballage carton individuel',
    unitPrice: 12.50
  },
  {
    id: 'prod-2',
    referenceNumber: 'DIPN-B200',
    customerReference: 'BOSTIK-CONT-5L',
    name: 'Bidon 5L',
    description: 'Bidon en plastique 5L pour produits chimiques',
    projectNumber: 'P2023-02',
    components: [
      {
        id: 'comp-5',
        name: 'Corps bidon',
        referenceNumber: 'COMP-CORPS-B200',
        quantity: 1,
        supplierIds: ['supp-3', 'supp-4']
      },
      {
        id: 'comp-6',
        name: 'Bouchon sécurité',
        referenceNumber: 'COMP-BOUCH-B200',
        quantity: 1,
        supplierIds: ['supp-1']
      },
      {
        id: 'comp-7',
        name: 'Poignée',
        referenceNumber: 'COMP-POIGN-STD',
        quantity: 1,
        supplierIds: ['supp-2', 'supp-4']
      }
    ],
    packagingInfo: 'Palette 100x120, 80 pièces par palette, film étirable',
    unitPrice: 8.75
  },
  {
    id: 'prod-3',
    referenceNumber: 'DIPN-R300',
    customerReference: 'RNL-DASH-C4',
    name: 'Dashboard C4',
    description: 'Composant tableau de bord C4',
    projectNumber: 'P2023-03',
    components: [
      {
        id: 'comp-8',
        name: 'Structure principale',
        referenceNumber: 'COMP-STRUCT-R300',
        quantity: 1,
        supplierIds: ['supp-1', 'supp-4']
      },
      {
        id: 'comp-9',
        name: 'Grille aération',
        referenceNumber: 'COMP-GRILL-R300',
        quantity: 4,
        supplierIds: ['supp-2']
      },
      {
        id: 'comp-10',
        name: 'Support écran',
        referenceNumber: 'COMP-SUPP-R300',
        quantity: 1,
        supplierIds: ['supp-4']
      }
    ],
    packagingInfo: 'Conditionnement spécial automobile, bac plastique réutilisable 60x80',
    unitPrice: 42.00
  }
];

// Mock packaging details
export const mockPackaging: Packaging[] = [
  {
    id: 'pkg-1',
    productId: 'prod-1',
    description: 'Emballage pour mallettes orange',
    packagingType: 'Carton',
    unitsPerPackage: 10,
    packagesPerPallet: 10,
    palletDimensions: '80x120 cm'
  },
  {
    id: 'pkg-2',
    productId: 'prod-2',
    description: 'Emballage pour bidons 5L',
    packagingType: 'Film étirable',
    unitsPerPackage: 8,
    packagesPerPallet: 10,
    palletDimensions: '100x120 cm'
  },
  {
    id: 'pkg-3',
    productId: 'prod-3',
    description: 'Bac spécial automobile',
    packagingType: 'Bac plastique réutilisable',
    unitsPerPackage: 5,
    packagesPerPallet: 8,
    palletDimensions: '60x80 cm'
  }
];

// Mock projects
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    customerOrderId: 'ord-c-1',
    name: 'Projet Mallette Orange SPIT',
    description: 'Production et livraison de mallettes orange pour SPIT',
    createdDate: '2023-10-01',
    status: 'in_progress',
    transportCosts: [
      {
        id: 'tc-1',
        transporterId: 'trans-1',
        transporterName: 'Geodis',
        cost: 320,
        selected: true
      },
      {
        id: 'tc-2',
        transporterId: 'trans-2',
        transporterName: 'DB Schenker',
        cost: 350,
        selected: false
      }
    ]
  },
  {
    id: 'proj-2',
    customerOrderId: 'ord-c-2',
    name: 'Projet Bidon 5L Bostik',
    description: 'Production et livraison de bidons 5L pour Bostik',
    createdDate: '2023-10-12',
    status: 'in_progress',
    transportCosts: [
      {
        id: 'tc-3',
        transporterId: 'trans-1',
        transporterName: 'Geodis',
        cost: 280,
        selected: false
      },
      {
        id: 'tc-4',
        transporterId: 'trans-3',
        transporterName: 'DHL',
        cost: 260,
        selected: true
      }
    ]
  },
  {
    id: 'proj-3',
    customerOrderId: 'ord-c-3',
    name: 'Projet Dashboard C4 Renault',
    description: 'Production et livraison de composants tableau de bord C4 pour Renault',
    createdDate: '2023-10-20',
    status: 'new',
    transportCosts: []
  }
];

// Mock customer orders
export const mockCustomerOrders: CustomerOrder[] = [
  {
    id: 'ord-c-1',
    reference: 'COM-C-2023-001',
    customer: mockCustomers[0],
    products: [
      {
        id: 'ord-prod-1',
        productId: 'prod-1',
        description: 'Mallette Orange',
        quantity: 1000,
        unitPrice: 12.50
      }
    ],
    orderType: 'firm',
    orderDate: '2023-10-01',
    requestedDate: '2023-11-15',
    acknowledgedQuantity: 1000,
    acknowledgedPrice: 12500,
    acknowledgedDate: '2023-10-03',
    status: 'in_production',
    notes: 'Première commande pour ce produit',
    projectId: 'proj-1'
  },
  {
    id: 'ord-c-2',
    reference: 'COM-C-2023-002',
    customer: mockCustomers[1],
    products: [
      {
        id: 'ord-prod-2',
        productId: 'prod-2',
        description: 'Bidon 5L',
        quantity: 1500,
        unitPrice: 8.75
      }
    ],
    orderType: 'open',
    orderDate: '2023-10-12',
    requestedDate: '2023-12-01',
    acknowledgedQuantity: 1500,
    acknowledgedPrice: 13125,
    acknowledgedDate: '2023-10-14',
    status: 'confirmed',
    notes: 'Commande ouverte sur 6 mois',
    projectId: 'proj-2'
  },
  {
    id: 'ord-c-3',
    reference: 'COM-C-2023-003',
    customer: mockCustomers[2],
    products: [
      {
        id: 'ord-prod-3',
        productId: 'prod-3',
        description: 'Dashboard C4',
        quantity: 500,
        unitPrice: 42.00
      }
    ],
    orderType: 'firm',
    orderDate: '2023-10-20',
    requestedDate: '2023-12-15',
    acknowledgedQuantity: 500,
    acknowledgedPrice: 21000,
    acknowledgedDate: '2023-10-22',
    status: 'pending',
    notes: 'Attente validation technique',
    projectId: 'proj-3'
  }
];

// Mock supplier orders
export const mockSupplierOrders: SupplierOrder[] = [
  {
    id: 'ord-s-1',
    reference: 'COM-F-2023-001',
    supplier: mockSuppliers[0],
    products: [
      {
        id: 'ord-prod-1',
        productId: 'prod-1',
        description: 'Mallette Orange - Production',
        quantity: 1000,
        unitPrice: 8.00
      }
    ],
    orderType: 'firm',
    orderDate: '2023-10-05',
    requestedDate: '2023-11-10',
    acknowledgedQuantity: 1000,
    acknowledgedPrice: 8000,
    acknowledgedDate: '2023-10-06',
    status: 'in_production',
    notes: 'Moules validés',
    customerOrderId: 'ord-c-1',
    projectId: 'proj-1'
  },
  {
    id: 'ord-s-2',
    reference: 'COM-F-2023-002',
    supplier: mockSuppliers[2],
    products: [
      {
        id: 'ord-prod-2',
        productId: 'prod-2',
        description: 'Bidon 5L - Production',
        quantity: 1500,
        unitPrice: 5.25
      }
    ],
    orderType: 'open',
    orderDate: '2023-10-15',
    requestedDate: '2023-11-25',
    acknowledgedQuantity: 1500,
    acknowledgedPrice: 7875,
    acknowledgedDate: '2023-10-16',
    status: 'confirmed',
    notes: 'Livraisons échelonnées sur 6 mois',
    customerOrderId: 'ord-c-2',
    projectId: 'proj-2'
  }
];

// Mock production data
export const mockProductions: Production[] = [
  {
    id: 'prod-1',
    projectId: 'proj-1',
    supplierOrderId: 'ord-s-1',
    customerOrderId: 'ord-c-1',
    supplier: mockSuppliers[0],
    startDate: '2023-10-15',
    estimatedEndDate: '2023-11-05',
    status: 'in_progress',
    notes: 'Production en cours, 40% réalisé',
    machine: 'Injection-01'
  },
  {
    id: 'prod-2',
    projectId: 'proj-2',
    supplierOrderId: 'ord-s-2',
    customerOrderId: 'ord-c-2',
    supplier: mockSuppliers[2],
    startDate: '2023-11-01',
    estimatedEndDate: '2023-11-20',
    status: 'scheduled',
    notes: 'Lancement planifié',
    machine: 'Soufflage-03'
  }
];

// Mock stock locations
export const mockStockLocations: StockLocation[] = [
  {
    id: 'loc-1',
    name: 'Entrepôt DIPN Oyonnax',
    type: 'dipn',
    address: '1 Rue Principale, 01100 Oyonnax'
  },
  {
    id: 'loc-2',
    name: 'Atelier FALK',
    type: 'supplier',
    address: '10 Rue de la Plasturgie, 01000 Bourg-en-Bresse'
  },
  {
    id: 'loc-3',
    name: 'Usine ALVIPLAST',
    type: 'supplier',
    address: '30 Avenue de la Transformation, 59000 Lille'
  },
  {
    id: 'loc-4',
    name: 'Entrepôt SPIT',
    type: 'customer',
    address: '123 Avenue de l\'Industrie, 75001 Paris'
  }
];

// Mock stock items
export const mockStockItems: StockItem[] = [
  {
    id: 'stock-1',
    productId: 'prod-1',
    locationId: 'loc-1',
    quantity: 250,
    lastUpdated: '2023-10-20',
    clientReference: 'SPIT-M100-OR',
    dipnReference: 'DIPN-M100'
  },
  {
    id: 'stock-2',
    productId: 'prod-1',
    locationId: 'loc-2',
    quantity: 400,
    lastUpdated: '2023-10-25',
    clientReference: 'SPIT-M100-OR',
    dipnReference: 'DIPN-M100'
  },
  {
    id: 'stock-3',
    productId: 'prod-2',
    locationId: 'loc-1',
    quantity: 150,
    lastUpdated: '2023-10-18',
    clientReference: 'BOSTIK-CONT-5L',
    dipnReference: 'DIPN-B200'
  },
  {
    id: 'stock-4',
    productId: 'prod-2',
    locationId: 'loc-3',
    quantity: 0,
    lastUpdated: '2023-10-15',
    clientReference: 'BOSTIK-CONT-5L',
    dipnReference: 'DIPN-B200'
  }
];

// Mock shipments
export const mockShipments: Shipment[] = [
  {
    id: 'ship-1',
    projectId: 'proj-1',
    orderId: 'ord-c-1',
    from: mockStockLocations[0],
    to: mockStockLocations[3],
    scheduledDate: '2023-11-20',
    status: 'scheduled',
    transporter: 'Geodis',
    transportCost: 320
  },
  {
    id: 'ship-2',
    projectId: 'proj-1',
    orderId: 'ord-s-1',
    from: mockStockLocations[1],
    to: mockStockLocations[0],
    scheduledDate: '2023-11-07',
    status: 'scheduled',
    transporter: 'DB Schenker',
    transportCost: 180
  }
];

// Mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    referenceNumber: 'FACT-2023-001',
    customerId: 'cust-1',
    projectId: 'proj-1',
    orderId: 'ord-c-1',
    date: '2023-10-05',
    dueDate: '2023-11-04',
    items: [
      {
        description: 'Mallette Orange',
        quantity: 1000,
        unitPrice: 12.50,
        totalPrice: 12500
      },
      {
        description: 'Transport',
        quantity: 1,
        unitPrice: 320,
        totalPrice: 320
      }
    ],
    totalAmount: 12820,
    status: 'pending'
  },
  {
    id: 'inv-2',
    referenceNumber: 'FACT-2023-002',
    customerId: 'cust-2',
    projectId: 'proj-2',
    orderId: 'ord-c-2',
    date: '2023-10-16',
    dueDate: '2023-11-15',
    items: [
      {
        description: 'Bidon 5L',
        quantity: 500,
        unitPrice: 8.75,
        totalPrice: 4375
      }
    ],
    totalAmount: 4375,
    status: 'paid',
    paymentDate: '2023-11-01'
  }
];