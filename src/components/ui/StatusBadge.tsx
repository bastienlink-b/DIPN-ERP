import React from 'react';
import Badge from './Badge';
import { OrderStatus, ProductionStatus } from '../../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getVariantAndText = () => {
    switch (status) {
      case 'pending':
        return { variant: 'warning', text: 'En attente' };
      case 'confirmed':
        return { variant: 'primary', text: 'Confirmée' };
      case 'in_production':
        return { variant: 'primary', text: 'En production' };
      case 'shipped':
        return { variant: 'success', text: 'Expédiée' };
      case 'delivered':
        return { variant: 'success', text: 'Livrée' };
      case 'cancelled':
        return { variant: 'danger', text: 'Annulée' };
      default:
        return { variant: 'default', text: status };
    }
  };

  const { variant, text } = getVariantAndText();
  
  return (
    <Badge 
      variant={variant as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
    >
      {text}
    </Badge>
  );
};

interface ProductionStatusBadgeProps {
  status: ProductionStatus;
}

export const ProductionStatusBadge: React.FC<ProductionStatusBadgeProps> = ({ status }) => {
  const getVariantAndText = () => {
    switch (status) {
      case 'scheduled':
        return { variant: 'primary', text: 'Planifiée' };
      case 'in_progress':
        return { variant: 'warning', text: 'En cours' };
      case 'completed':
        return { variant: 'success', text: 'Terminée' };
      case 'blocked':
        return { variant: 'danger', text: 'Bloquée' };
      default:
        return { variant: 'default', text: status };
    }
  };

  const { variant, text } = getVariantAndText();
  
  return (
    <Badge 
      variant={variant as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
    >
      {text}
    </Badge>
  );
};

interface PaymentStatusBadgeProps {
  status: 'pending' | 'paid' | 'overdue';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const getVariantAndText = () => {
    switch (status) {
      case 'pending':
        return { variant: 'warning', text: 'En attente' };
      case 'paid':
        return { variant: 'success', text: 'Payée' };
      case 'overdue':
        return { variant: 'danger', text: 'En retard' };
      default:
        return { variant: 'default', text: status };
    }
  };

  const { variant, text } = getVariantAndText();
  
  return (
    <Badge 
      variant={variant as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
    >
      {text}
    </Badge>
  );
};

interface ShipmentStatusBadgeProps {
  status: 'scheduled' | 'in_transit' | 'delivered';
}

export const ShipmentStatusBadge: React.FC<ShipmentStatusBadgeProps> = ({ status }) => {
  const getVariantAndText = () => {
    switch (status) {
      case 'scheduled':
        return { variant: 'primary', text: 'Planifiée' };
      case 'in_transit':
        return { variant: 'warning', text: 'En transit' };
      case 'delivered':
        return { variant: 'success', text: 'Livrée' };
      default:
        return { variant: 'default', text: status };
    }
  };

  const { variant, text } = getVariantAndText();
  
  return (
    <Badge 
      variant={variant as 'default' | 'primary' | 'success' | 'warning' | 'danger'}
    >
      {text}
    </Badge>
  );
};