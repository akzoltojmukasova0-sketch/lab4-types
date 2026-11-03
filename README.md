# lab4-types — оценка эффективности логистических маршрутов и доставки

Лабораторная работа №4 «Типизация данных клиент-серверного приложения».

Предметная область: система оценки эффективности логистических маршрутов и доставки. Учитываются время в пути, расстояние, тип транспорта, объём груза и задержки. Роли: администратор (ADMIN), диспетчер (DISPATCHER), курьер (COURIER). Диспетчер планирует маршруты (план: расстояние, время, стоимость) и назначает доставки курьерам; по факту доставки фиксируются фактические расстояние, время, стоимость и задержка. Показатели эффективности: отклонение факта от плана (время, расстояние), стоимость километра, доля доставок в срок.

Проект не обращается к базе данных и не запускает сервер: здесь описаны типы, преобразователи и тестовые данные.

## Запуск

```bash
npm install
npm run check   # проверка типов (tsc --noEmit, strict)
npm run dev     # запуск демонстрации на тестовых данных
```

## Структура

```
src/
├── models.ts   # сущности: User, Courier, Vehicle, Route, Delivery и объединения литералов
├── dto.ts      # DTO, RouteEfficiency, Paginated<T>, Result<T>
├── mappers.ts  # toXResponse, toRouteEfficiency, paginate<T>
├── guards.ts   # isRecord, isDeliveryStatus, isDelayReason, isDeliveryResponse
├── api.ts      # parseDeliveryResponse, getDelivery (fetch)
└── main.ts     # демонстрация
docs/compiler-errors.md  # журнал ошибок компилятора и работы с ИИ
```


## Типы

Объединения литералов: `Role` (ADMIN, DISPATCHER, COURIER), `TransportType` (TRUCK, VAN, CAR, MOTORCYCLE), `DeliveryStatus` (PLANNED, IN_TRANSIT, DELIVERED, DELAYED, CANCELLED), `DelayReason` (TRAFFIC, WEATHER, BREAKDOWN, BORDER_CHECK, LOADING).

Необязательные поля: `Courier.vehicleId?`, `Delivery.arrivedAt?`, `Delivery.actualDistanceKm?`, `Delivery.actualDurationMin?`, `Delivery.actualCostKgs?`, `Delivery.delayReason?` (фактических данных нет, пока доставка не завершена). Поля `readonly`: `Route.createdAt`, `Delivery.createdAt`. Связи: `Courier.userId → User`, `Courier.vehicleId → Vehicle`, `Route.createdById → User`, `Delivery.routeId → Route`, `Delivery.courierId → Courier`, `Delivery.vehicleId → Vehicle`. Даты хранятся строками ISO 8601, суммы в сомах (суффикс `Kgs`), телефоны в формате +996.

| Сущность | DTO запроса | DTO ответа |
|----------|-------------|------------|
| User | — | `UserResponse` = `Omit<User, "passwordHash">` |
| Courier | `CreateCourierDto` = `Omit<Courier, "id" \| "isAvailable">`, `UpdateCourierDto` = `Partial<...>` | `CourierResponse` = `Omit<Courier, "userId">` |
| Vehicle | `CreateVehicleDto` = `Omit<Vehicle, "id" \| "isActive">`, `UpdateVehicleDto` = `Partial<...>` | `VehicleResponse` = `Vehicle` |
| Route | `CreateRouteDto` = `Omit<Route, "id" \| "createdById" \| "createdAt">`, `UpdateRouteDto` = `Partial<...>` | `RouteResponse` = `Omit<Route, "createdById">` |
| Delivery | `CreateDeliveryDto` = `Pick<Delivery, "routeId" \| "courierId" \| "vehicleId" \| "cargoVolumeM3" \| "cargoWeightKg" \| "departedAt">`, `UpdateDeliveryDto` = `Partial<...>` | `DeliveryResponse` = `Delivery & DeliveryMetrics` |

Почему так:
- `CreateRouteDto`: `id` и `createdAt` назначает сервер, автора (`createdById`) сервер определяет по токену.
- `CreateCourierDto`, `CreateVehicleDto`: новый курьер свободен, новая машина активна — `isAvailable` и `isActive` выставляет сервер.
- `CreateDeliveryDto`: клиент задаёт только маршрут, курьера, транспорт, груз и время выезда. Фактические расстояние, время, стоимость, задержку и статус фиксирует сервер, иначе клиент мог бы подделать показатели эффективности.
- `DeliveryResponse`: к доставке добавлены вычисляемые показатели `DeliveryMetrics` — отклонение от плана по времени и расстоянию, стоимость километра, признак «в срок».
- `CourierResponse`: служебная связь `userId` клиенту не нужна.
- `UserResponse`: хэш пароля никогда не отдаётся клиенту.

`Paginated<T>` — страница результатов для любого типа, `Result<T>` — успех с данными или ошибка со статусом и сообщением.

Журнал ошибок: [docs/compiler-errors.md](docs/compiler-errors.md).
