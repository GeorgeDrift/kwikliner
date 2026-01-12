
export enum UserRole {
  SHIPPER = 'SHIPPER',
  DRIVER = 'DRIVER',
  LOGISTICS_OWNER = 'LOGISTICS_OWNER',
  HARDWARE_OWNER = 'HARDWARE_OWNER',
  ADMIN = 'ADMIN'
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  EN_ROUTE = 'EN_ROUTE',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email?: string;
  isVerified: boolean;
  companyName?: string;
  linkedOwnerId?: string;
  complianceStatus: 'PENDING' | 'SUBMITTED' | 'APPROVED';
  // Financial Details
  bankName?: string;
  accountNumber?: string;
  mobileMoneyNumber?: string;
  swiftCode?: string;
  primaryPayoutMethod?: 'BANK' | 'MOBILE_MONEY';
  licenses?: string[];
  paymentAccounts?: {
    id: string;
    type: 'BANK' | 'MOBILE_MONEY';
    name: string;
    description: string;
    isPrimary: boolean;
  }[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  plate: string;
  type: 'TRUCK' | 'VAN' | 'PICKUP' | 'BIKE' | 'FLATBED' | 'TANKER' | 'BOX_BODY' | 'REFRIGERATED';
  capacity: string;
  image?: string;
  status?: 'Available' | 'In Transit' | 'Maintenance';
}

export interface Shipment {
  id: string;
  shipperId: string;
  driverId?: string;
  ownerId?: string;
  pickupLocation: string;
  deliveryLocation: string;
  cargoType: string;
  weight: number;
  price: number;
  status: ShipmentStatus;
  createdAt: string;
}
