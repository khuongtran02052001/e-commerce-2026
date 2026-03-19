import type { OrderActorValue } from './order';

export type EmployeeRole =
  | 'callcenter'
  | 'packer'
  | 'deliveryman'
  | 'incharge'
  | 'accounts';

export const API_ROLE_MAP: Record<string, EmployeeRole> = {
  CALL_CENTER: 'callcenter',
  CALLCENTER: 'callcenter',
  PACKER: 'packer',
  WARE_HOUSE: 'packer',
  WAREHOUSE: 'packer',
  DELIVERYMAN: 'deliveryman',
  DELIVERY_MAN: 'deliveryman',
  INCHARGE: 'incharge',
  IN_CHARGE: 'incharge',
  ACCOUNTS: 'accounts',
};

export const UI_TO_API_ROLE_MAP: Record<EmployeeRole, string> = {
  callcenter: 'CALL_CENTER',
  packer: 'PACKER',
  deliveryman: 'DELIVERY_MAN',
  incharge: 'INCHARGE',
  accounts: 'ACCOUNTS',
};

export const normalizeEmployeeRole = (role?: string): EmployeeRole => {
  const normalized = String(role || '').trim().toUpperCase();
  return API_ROLE_MAP[normalized] ?? 'callcenter';
};

export const toApiEmployeeRole = (role: EmployeeRole): string => UI_TO_API_ROLE_MAP[role];

export type EmployeeStatus = 'active' | 'inactive' | 'suspended';

export interface EmployeePermissions {
  canViewOrders: boolean;
  canConfirmOrders: boolean;
  canPackOrders: boolean;
  canAssignDelivery: boolean;
  canDeliverOrders: boolean;
  canCollectCash: boolean;
  canReceivePayments: boolean;
  canViewAnalytics: boolean;
  canManageEmployees: boolean;
  canAccessAdmin: boolean;
}

export interface EmployeePerformance {
  ordersProcessed: number;
  ordersConfirmed?: number;
  ordersPacked?: number;
  ordersAssignedForDelivery?: number;
  ordersDelivered?: number;
  cashCollected?: number;
  paymentsReceived?: number;
  lastActiveAt?: string;
  averageProcessingTime?: number;
}

export interface Employee {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  assignedBy: string;
  assignedAt: string;
  suspendedAt?: string;
  suspendedBy?: string;
  suspensionReason?: string;
  activatedAt?: string;
  permissions: EmployeePermissions;
  performance?: EmployeePerformance;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistoryItem {
  status: string;
  changedBy: string;
  changedByRole: EmployeeRole | 'admin' | 'system';
  changedAt: string;
  notes?: string;
}

export interface OrderEmployeeTracking {
  addressConfirmedBy?: OrderActorValue;
  addressConfirmedAt?: string;
  orderConfirmedBy?: OrderActorValue;
  orderConfirmedAt?: string;
  packedBy?: OrderActorValue;
  packedAt?: string;
  packingNotes?: string;
  assignedWarehouseBy?: OrderActorValue;
  assignedWarehouseAt?: string;
  dispatchedBy?: OrderActorValue;
  dispatchedAt?: string;
  assignedDeliverymanId?: string;
  assignedDeliverymanName?: OrderActorValue;
  deliveredBy?: OrderActorValue;
  deliveredAt?: string;
  deliveryNotes?: string;
  deliveryAttempts?: number;
  rescheduledDate?: string;
  rescheduledReason?: string;
  cashCollected?: boolean;
  cashCollectedAmount?: number;
  cashCollectedAt?: string;
  cashSubmittedToAccounts?: boolean;
  cashSubmittedBy?: OrderActorValue;
  cashSubmittedAt?: string;
  cashSubmissionNotes?: string;
  assignedAccountsEmployeeId?: string;
  assignedAccountsEmployeeName?: OrderActorValue;
  paymentReceivedBy?: OrderActorValue;
  paymentReceivedAt?: string;
  statusHistory?: OrderStatusHistoryItem[];
}

export interface OrderWithTracking {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: string;
  address: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  products: Array<{
    product: {
      id: string;
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
  }>;
  tracking?: OrderEmployeeTracking;
}

export const ROLE_PERMISSIONS: Record<EmployeeRole, EmployeePermissions> = {
  callcenter: {
    canViewOrders: true,
    canConfirmOrders: true,
    canPackOrders: false,
    canAssignDelivery: false,
    canDeliverOrders: false,
    canCollectCash: false,
    canReceivePayments: false,
    canViewAnalytics: false,
    canManageEmployees: false,
    canAccessAdmin: true,
  },
  packer: {
    canViewOrders: true,
    canConfirmOrders: false,
    canPackOrders: true,
    canAssignDelivery: true,
    canDeliverOrders: false,
    canCollectCash: false,
    canReceivePayments: false,
    canViewAnalytics: false,
    canManageEmployees: false,
    canAccessAdmin: true,
  },
  deliveryman: {
    canViewOrders: true,
    canConfirmOrders: false,
    canPackOrders: false,
    canAssignDelivery: false,
    canDeliverOrders: true,
    canCollectCash: true,
    canReceivePayments: false,
    canViewAnalytics: false,
    canManageEmployees: false,
    canAccessAdmin: true,
  },
  incharge: {
    canViewOrders: true,
    canConfirmOrders: true,
    canPackOrders: true,
    canAssignDelivery: true,
    canDeliverOrders: true,
    canCollectCash: true,
    canReceivePayments: true,
    canViewAnalytics: true,
    canManageEmployees: true,
    canAccessAdmin: true,
  },
  accounts: {
    canViewOrders: true,
    canConfirmOrders: false,
    canPackOrders: false,
    canAssignDelivery: false,
    canDeliverOrders: false,
    canCollectCash: false,
    canReceivePayments: true,
    canViewAnalytics: true,
    canManageEmployees: false,
    canAccessAdmin: true,
  },
};

export const getRoleDisplayName = (role: EmployeeRole): string => {
  const roleNames: Record<EmployeeRole, string> = {
    callcenter: 'Call Center',
    packer: 'Packer',
    deliveryman: 'Delivery Man',
    incharge: 'In-Charge',
    accounts: 'Accounts',
  };
  return roleNames[role];
};

export const getRoleBadgeColor = (role: EmployeeRole): string => {
  const colors: Record<EmployeeRole, string> = {
    callcenter: 'bg-blue-100 text-blue-800',
    packer: 'bg-purple-100 text-purple-800',
    deliveryman: 'bg-green-100 text-green-800',
    incharge: 'bg-red-100 text-red-800',
    accounts: 'bg-yellow-100 text-yellow-800',
  };
  return colors[role];
};

export const hasPermission = (role: EmployeeRole, permission: keyof EmployeePermissions): boolean =>
  ROLE_PERMISSIONS[role][permission];
