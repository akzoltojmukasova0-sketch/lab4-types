export type Role = "ADMIN" | "DISPATCHER" | "COURIER";

export type TransportType = "TRUCK" | "VAN" | "CAR" | "MOTORCYCLE";

export type DeliveryStatus =
  | "PLANNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "DELAYED"
  | "CANCELLED";

export type DelayReason =
  | "TRAFFIC"
  | "WEATHER"
  | "BREAKDOWN"
  | "BORDER_CHECK"
  | "LOADING";

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export interface Courier {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  vehicleId?: number;
  isAvailable: boolean;
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  transportType: TransportType;
  capacityM3: number;
  maxLoadKg: number;
  isActive: boolean;
}

export interface Route {
  id: number;
  name: string;
  originCity: string;
  destinationCity: string;
  plannedDistanceKm: number;
  plannedDurationMin: number;
  plannedCostKgs: number;
  createdById: number;
  readonly createdAt: string;
}

export interface Delivery {
  id: number;
  routeId: number;
  courierId: number;
  vehicleId: number;
  cargoVolumeM3: number;
  cargoWeightKg: number;
  departedAt: string;
  arrivedAt?: string;
  actualDistanceKm?: number;
  actualDurationMin?: number;
  actualCostKgs?: number;
  delayMin: number;
  delayReason?: DelayReason;
  status: DeliveryStatus;
  readonly createdAt: string;
}
