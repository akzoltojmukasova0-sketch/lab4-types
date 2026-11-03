import { DeliveryResponse } from "./dto";
import { DelayReason, DeliveryStatus } from "./models";

const DELIVERY_STATUSES: readonly DeliveryStatus[] = ["PLANNED", "IN_TRANSIT", "DELIVERED", "DELAYED", "CANCELLED"];
const DELAY_REASONS: readonly DelayReason[] = ["TRAFFIC", "WEATHER", "BREAKDOWN", "BORDER_CHECK", "LOADING"];

export function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

export function isDeliveryStatus(x: unknown): x is DeliveryStatus {
  return DELIVERY_STATUSES.some((s) => s === x);
}

export function isDelayReason(x: unknown): x is DelayReason {
  return DELAY_REASONS.some((r) => r === x);
}

function isOptionalString(x: unknown): boolean {
  return x === undefined || typeof x === "string";
}

function isOptionalNumber(x: unknown): boolean {
  return x === undefined || typeof x === "number";
}

function isNumberOrNull(x: unknown): boolean {
  return x === null || typeof x === "number";
}

export function isDeliveryResponse(x: unknown): x is DeliveryResponse {
  if (!isRecord(x)) return false;
  return (
    typeof x.id === "number" &&
    typeof x.routeId === "number" &&
    typeof x.courierId === "number" &&
    typeof x.vehicleId === "number" &&
    typeof x.cargoVolumeM3 === "number" &&
    typeof x.cargoWeightKg === "number" &&
    typeof x.departedAt === "string" &&
    isOptionalString(x.arrivedAt) &&
    isOptionalNumber(x.actualDistanceKm) &&
    isOptionalNumber(x.actualDurationMin) &&
    isOptionalNumber(x.actualCostKgs) &&
    typeof x.delayMin === "number" &&
    (x.delayReason === undefined || isDelayReason(x.delayReason)) &&
    isDeliveryStatus(x.status) &&
    typeof x.createdAt === "string" &&
    isNumberOrNull(x.durationDeviationMin) &&
    isNumberOrNull(x.distanceDeviationKm) &&
    isNumberOrNull(x.costPerKmKgs) &&
    typeof x.onTime === "boolean"
  );
}
