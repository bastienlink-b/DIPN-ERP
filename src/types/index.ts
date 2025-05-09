// Common types for the DIPN ERP system

// Order Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  specialties: string[];
}

export type OrderType = 'open' | 'firm';
export type OrderStatus = 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';

export interface Project {
  id: string;
  customerOrderId: string;
  name: string;
  description: string;
  createdDate: string;
  status: 'new' | 'in_progress' | 'completed';
  transportCosts: TransportCost[];
}

export interface TransportCost {
  id: string;
  transporterId: string;
  transporterName: string;
  cost: number;
  selected: boolean;
}

export interface CustomerOrder {
  id: string;
  reference: string;
  customer: Customer;
  products: OrderProduct[];
  orderType: OrderType;
  orderDate: string;
  requestedDate: string;
  acknowledgedQuantity?: number;
  acknowledgedPrice?: number;
  acknowledgedDate?: string;
  status: OrderStatus;
  notes?: string;
  projectId: string; // Link to project
}

export interface SupplierOrder {
  id: string;
  reference: string;
  supplier: Supplier;
  products: OrderProduct[];
  orderType: OrderType;
  orderDate: string;
  requestedDate: string;
  acknowledgedQuantity?: number;
  acknowledgedPrice?: number;
  acknowledgedDate?: string;
  status: OrderStatus;
  notes?: string;
  customerOrderId: string; // Link to customer order
  projectId: string; // Link to project
}

export interface OrderProduct {
  id: string;
  productId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

// Production Types
export type ProductionStatus = 'scheduled' | 'in_progress' | 'completed' | 'blocked';

export interface Production {
  id: string;
  projectId: string; // Link to project
  supplierOrderId: string;
  customerOrderId: string; // Link to customer order
  supplier: Supplier;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  status: ProductionStatus;
  notes?: string;
  machine?: string; // Future enhancement for tracking which machine is used
}

// Logistics Types
export interface StockLocation {
  id: string;
  name: string;
  type: 'dipn' | 'supplier' | 'customer';
  address: string;
}

export interface StockItem {
  id: string;
  productId: string;
  locationId: string;
  quantity: number;
  lastUpdated: string;
  clientReference?: string;
  dipnReference?: string;
}

export interface Shipment {
  id: string;
  projectId: string; // Link to project
  orderId: string;
  from: StockLocation;
  to: StockLocation;
  scheduledDate: string;
  actualDate?: string;
  status: 'scheduled' | 'in_transit' | 'delivered';
  transporter: string;
  transportCost: number;
  deliveryNoteId?: string;
}

export interface DeliveryNote {
  id: string;
  referenceNumber: string;
  date: string;
  shipmentId: string;
  projectId: string; // Link to project
  items: DeliveryItem[];
}

export interface DeliveryItem {
  productId: string;
  quantity: number;
}

// Accounting Types
export interface Invoice {
  id: string;
  referenceNumber: string;
  customerId: string;
  projectId: string; // Link to project
  orderId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'overdue';
  paymentDate?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  projectId: string; // Link to project
  amount: number;
  date: string;
  method: 'bank_transfer' | 'check' | 'cash' | 'other';
  notes?: string;
}

// Product Types
export interface Product {
  id: string;
  referenceNumber: string;
  customerReference?: string;
  name: string;
  description: string;
  projectNumber?: string;
  components: Component[];
  packagingInfo: string;
  unitPrice: number;
  images?: string[];
}

export interface Component {
  id: string;
  name: string;
  referenceNumber: string;
  quantity: number;
  supplierIds: string[];
}

export interface Packaging {
  id: string;
  productId: string;
  description: string;
  packagingType: string;
  unitsPerPackage: number;
  packagesPerPallet: number;
  palletDimensions: string;
}