import { CourierResponse, DeliveryResponse, Paginated, RouteEfficiency, RouteResponse, UserResponse, VehicleResponse } from "./dto";
import { Courier, Delivery, Route, User, Vehicle } from "./models";

const ON_TIME_TOLERANCE_MIN = 15;

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return round1(values.reduce((sum, v) => sum + v, 0) / values.length);
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function toCourierResponse(courier: Courier): CourierResponse {
  return {
    id: courier.id,
    fullName: courier.fullName,
    phone: courier.phone,
    vehicleId: courier.vehicleId,
    isAvailable: courier.isAvailable,
  };
}

export function toVehicleResponse(vehicle: Vehicle): VehicleResponse {
  return {
    id: vehicle.id,
    plateNumber: vehicle.plateNumber,
    transportType: vehicle.transportType,
    capacityM3: vehicle.capacityM3,
    maxLoadKg: vehicle.maxLoadKg,
    isActive: vehicle.isActive,
  };
}

export function toRouteResponse(route: Route): RouteResponse {
  return {
    id: route.id,
    name: route.name,
    originCity: route.originCity,
    destinationCity: route.destinationCity,
    plannedDistanceKm: route.plannedDistanceKm,
    plannedDurationMin: route.plannedDurationMin,
    plannedCostKgs: route.plannedCostKgs,
    createdAt: route.createdAt,
  };
}

export function toDeliveryResponse(delivery: Delivery, route: Route): DeliveryResponse {
  const { actualDurationMin, actualDistanceKm, actualCostKgs } = delivery;
  return {
    id: delivery.id,
    routeId: delivery.routeId,
    courierId: delivery.courierId,
    vehicleId: delivery.vehicleId,
    cargoVolumeM3: delivery.cargoVolumeM3,
    cargoWeightKg: delivery.cargoWeightKg,
    departedAt: delivery.departedAt,
    arrivedAt: delivery.arrivedAt,
    actualDistanceKm,
    actualDurationMin,
    actualCostKgs,
    delayMin: delivery.delayMin,
    delayReason: delivery.delayReason,
    status: delivery.status,
    createdAt: delivery.createdAt,
    durationDeviationMin: actualDurationMin === undefined ? null : actualDurationMin - route.plannedDurationMin,
    distanceDeviationKm: actualDistanceKm === undefined ? null : round1(actualDistanceKm - route.plannedDistanceKm),
    costPerKmKgs:
      actualCostKgs === undefined || actualDistanceKm === undefined || actualDistanceKm <= 0
        ? null
        : round1(actualCostKgs / actualDistanceKm),
    onTime: delivery.status === "DELIVERED" && delivery.delayMin <= ON_TIME_TOLERANCE_MIN,
  };
}

export function toRouteEfficiency(route: Route, deliveries: Delivery[]): RouteEfficiency {
  const own = deliveries.filter((d) => d.routeId === route.id);
  const delivered = own.filter((d) => d.status === "DELIVERED");
  const onTime = delivered.filter((d) => d.delayMin <= ON_TIME_TOLERANCE_MIN);

  const durationDeviations: number[] = [];
  const distanceDeviations: number[] = [];
  let totalCost = 0;
  let totalKm = 0;
  for (const d of delivered) {
    if (d.actualDurationMin !== undefined) durationDeviations.push(d.actualDurationMin - route.plannedDurationMin);
    if (d.actualDistanceKm !== undefined) {
      distanceDeviations.push(d.actualDistanceKm - route.plannedDistanceKm);
      if (d.actualCostKgs !== undefined) {
        totalCost += d.actualCostKgs;
        totalKm += d.actualDistanceKm;
      }
    }
  }

  return {
    routeId: route.id,
    routeName: route.name,
    deliveriesCount: own.length,
    deliveredCount: delivered.length,
    onTimePercent: delivered.length === 0 ? 0 : round1((onTime.length / delivered.length) * 100),
    avgDurationDeviationMin: average(durationDeviations),
    avgDistanceDeviationKm: average(distanceDeviations),
    costPerKmKgs: totalKm === 0 ? null : round1(totalCost / totalKm),
    totalCargoM3: round1(own.reduce((sum, d) => sum + d.cargoVolumeM3, 0)),
  };
}

export function paginate<T>(items: T[], page: number, limit: number): Paginated<T> {
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    total: items.length,
    page,
    limit,
  };
}
