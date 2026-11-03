import { Courier, Delivery, Route, User, Vehicle } from "./models";

export type UserResponse = Omit<User, "passwordHash">;

export type CreateCourierDto = Omit<Courier, "id" | "isAvailable">;
export type UpdateCourierDto = Partial<CreateCourierDto>;
export type CourierResponse = Omit<Courier, "userId">;

export type CreateVehicleDto = Omit<Vehicle, "id" | "isActive">;
export type UpdateVehicleDto = Partial<CreateVehicleDto>;
export type VehicleResponse = Vehicle;

export type CreateRouteDto = Omit<Route, "id" | "createdById" | "createdAt">;
export type UpdateRouteDto = Partial<CreateRouteDto>;
export type RouteResponse = Omit<Route, "createdById">;

export type CreateDeliveryDto = Pick<
  Delivery,
  "routeId" | "courierId" | "vehicleId" | "cargoVolumeM3" | "cargoWeightKg" | "departedAt"
>;
export type UpdateDeliveryDto = Partial<CreateDeliveryDto>;

export interface DeliveryMetrics {
  durationDeviationMin: number | null;
  distanceDeviationKm: number | null;
  costPerKmKgs: number | null;
  onTime: boolean;
}

export type DeliveryResponse = Delivery & DeliveryMetrics;

export interface RouteEfficiency {
  routeId: number;
  routeName: string;
  deliveriesCount: number;
  deliveredCount: number;
  onTimePercent: number;
  avgDurationDeviationMin: number | null;
  avgDistanceDeviationKm: number | null;
  costPerKmKgs: number | null;
  totalCargoM3: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };
