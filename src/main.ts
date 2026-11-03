import { CreateDeliveryDto, CreateRouteDto, DeliveryResponse, Result, UpdateRouteDto } from "./dto";
import { parseDeliveryResponse } from "./api";
import { paginate, toCourierResponse, toDeliveryResponse, toRouteEfficiency, toRouteResponse, toUserResponse, toVehicleResponse } from "./mappers";
import { Courier, Delivery, Route, User, Vehicle } from "./models";

console.log("Проект запущен: оценка эффективности логистических маршрутов и доставки\n");

const users: User[] = [
  { id: 1, email: "aigerim.asanova@logistics.kg", passwordHash: "$2b$10$fakeHashAigerim", role: "ADMIN", createdAt: "2026-09-01T09:00:00Z" },
  { id: 2, email: "bakyt.toktogulov@logistics.kg", passwordHash: "$2b$10$fakeHashBakyt", role: "DISPATCHER", createdAt: "2026-09-02T10:00:00Z" },
  { id: 3, email: "nurzat.kadyrova@logistics.kg", passwordHash: "$2b$10$fakeHashNurzat", role: "COURIER", createdAt: "2026-09-03T08:30:00Z" },
  { id: 4, email: "azamat.sydykov@logistics.kg", passwordHash: "$2b$10$fakeHashAzamat", role: "COURIER", createdAt: "2026-09-03T08:45:00Z" },
  { id: 5, email: "elnura.osmonova@logistics.kg", passwordHash: "$2b$10$fakeHashElnura", role: "COURIER", createdAt: "2026-09-04T09:15:00Z" },
];

const vehicles: Vehicle[] = [
  { id: 1, plateNumber: "01 KG 123 ABC", transportType: "TRUCK", capacityM3: 82, maxLoadKg: 20000, isActive: true },
  { id: 2, plateNumber: "02 KG 456 BCD", transportType: "VAN", capacityM3: 12, maxLoadKg: 1500, isActive: true },
  { id: 3, plateNumber: "03 KG 789 CDE", transportType: "CAR", capacityM3: 2, maxLoadKg: 400, isActive: false },
];

const couriers: Courier[] = [
  { id: 1, userId: 3, fullName: "Nurzat Kadyrova", phone: "+996 555 123 456", vehicleId: 1, isAvailable: false },
  { id: 2, userId: 4, fullName: "Azamat Sydykov", phone: "+996 700 234 567", vehicleId: 2, isAvailable: true },
  { id: 3, userId: 5, fullName: "Elnura Osmonova", phone: "+996 772 345 678", isAvailable: true },
];

const routes: Route[] = [
  { id: 1, name: "Бишкек — Ош", originCity: "Бишкек", destinationCity: "Ош", plannedDistanceKm: 610, plannedDurationMin: 600, plannedCostKgs: 22000, createdById: 2, createdAt: "2026-09-05T07:00:00Z" },
  { id: 2, name: "Бишкек — Каракол", originCity: "Бишкек", destinationCity: "Каракол", plannedDistanceKm: 390, plannedDurationMin: 360, plannedCostKgs: 6000, createdById: 2, createdAt: "2026-09-05T07:10:00Z" },
  { id: 3, name: "Бишкек — Токмок", originCity: "Бишкек", destinationCity: "Токмок", plannedDistanceKm: 60, plannedDurationMin: 70, plannedCostKgs: 1000, createdById: 1, createdAt: "2026-09-05T07:20:00Z" },
];

const deliveries: Delivery[] = [
  { id: 1, routeId: 1, courierId: 1, vehicleId: 1, cargoVolumeM3: 60, cargoWeightKg: 14500, departedAt: "2026-09-10T05:00:00Z", arrivedAt: "2026-09-10T15:10:00Z", actualDistanceKm: 615, actualDurationMin: 610, actualCostKgs: 23180, delayMin: 10, status: "DELIVERED", createdAt: "2026-09-09T12:00:00Z" },
  { id: 2, routeId: 1, courierId: 1, vehicleId: 1, cargoVolumeM3: 75, cargoWeightKg: 18000, departedAt: "2026-09-12T05:00:00Z", arrivedAt: "2026-09-12T17:30:00Z", actualDistanceKm: 640, actualDurationMin: 750, actualCostKgs: 25400, delayMin: 150, delayReason: "WEATHER", status: "DELIVERED", createdAt: "2026-09-11T12:00:00Z" },
  { id: 3, routeId: 2, courierId: 2, vehicleId: 2, cargoVolumeM3: 10, cargoWeightKg: 1200, departedAt: "2026-09-11T06:00:00Z", arrivedAt: "2026-09-11T12:05:00Z", actualDistanceKm: 392, actualDurationMin: 365, actualCostKgs: 5460, delayMin: 5, status: "DELIVERED", createdAt: "2026-09-10T15:00:00Z" },
  { id: 4, routeId: 3, courierId: 2, vehicleId: 2, cargoVolumeM3: 8.5, cargoWeightKg: 900, departedAt: "2026-09-13T09:00:00Z", delayMin: 40, delayReason: "TRAFFIC", status: "DELAYED", createdAt: "2026-09-13T08:00:00Z" },
  { id: 5, routeId: 2, courierId: 2, vehicleId: 2, cargoVolumeM3: 11, cargoWeightKg: 1400, departedAt: "2026-09-15T06:00:00Z", delayMin: 0, status: "PLANNED", createdAt: "2026-09-14T16:00:00Z" },
];

function findRoute(id: number): Route | undefined {
  return routes.find((r) => r.id === id);
}

console.log("=== UserResponse (без passwordHash) ===");
console.log(users.map(toUserResponse));

console.log("\n=== CourierResponse (без userId) ===");
console.log(couriers.map(toCourierResponse));

console.log("\n=== VehicleResponse ===");
console.log(vehicles.map(toVehicleResponse));

console.log("\n=== RouteResponse (без createdById) ===");
console.log(routes.map(toRouteResponse));

console.log("\n=== DeliveryResponse (план vs факт) ===");
const deliveryResponses: DeliveryResponse[] = [];
for (const d of deliveries) {
  const route = findRoute(d.routeId);
  if (route) deliveryResponses.push(toDeliveryResponse(d, route));
}
console.log(deliveryResponses);

console.log("\n=== Paginated<DeliveryResponse>: страница 2, по 2 записи ===");
console.log(paginate(deliveryResponses, 2, 2));

console.log("\n=== Аналитика эффективности маршрутов ===");
console.table(routes.map((r) => toRouteEfficiency(r, deliveries)));

console.log("\n=== Примеры DTO ===");
const newRoute: CreateRouteDto = { name: "Ош — Жалал-Абад", originCity: "Ош", destinationCity: "Жалал-Абад", plannedDistanceKm: 100, plannedDurationMin: 110, plannedCostKgs: 1800 };
const routeUpdate: UpdateRouteDto = { plannedDurationMin: 120 };
const newDelivery: CreateDeliveryDto = { routeId: 3, courierId: 3, vehicleId: 2, cargoVolumeM3: 9, cargoWeightKg: 1000, departedAt: "2026-09-20T08:00:00Z" };
console.log({ newRoute, routeUpdate, newDelivery });

console.log("\n=== Безопасный разбор JSON (Result<DeliveryResponse>) ===");
const valid = JSON.stringify(deliveryResponses[0]);
const testInputs: { title: string; json: string; expected: boolean }[] = [
  { title: "1. Корректный объект", json: valid, expected: true },
  { title: "2. Поле неверного типа (delayMin — строка)", json: valid.replace('"delayMin":10', '"delayMin":"10"'), expected: false },
  { title: "3. Нет обязательного поля (routeId)", json: valid.replace('"routeId":1,', ""), expected: false },
  { title: "4. Недопустимое значение status", json: valid.replace('"status":"DELIVERED"', '"status":"LOST"'), expected: false },
  { title: "5. Синтаксически неверный JSON", json: '{"id": 1, "routeId": ', expected: false },
  { title: "6. null", json: "null", expected: false },
  { title: "7. Массив вместо объекта", json: `[${valid}]`, expected: false },
  { title: "8. Недопустимая причина задержки", json: valid.replace('"delayMin":10', '"delayMin":10,"delayReason":"ALIENS"'), expected: false },
];

function describe(result: Result<DeliveryResponse>): string {
  if (result.ok) {
    return `ok: true, доставка #${result.data.id}, статус ${result.data.status}`;
  }
  return `ok: false, ${result.status} — ${result.message}`;
}

for (const t of testInputs) {
  const result = parseDeliveryResponse(t.json);
  const match = result.ok === t.expected ? "совпало" : "НЕ совпало";
  console.log(`${t.title}: ${describe(result)} [ожидалось ok: ${t.expected}, ${match}]`);
}
