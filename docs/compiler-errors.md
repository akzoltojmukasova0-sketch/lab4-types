# Журнал ошибок компилятора и работы с ИИ

## Часть 1. Ошибки компилятора

Ошибки получены намеренно во временном файле `src/_errors.ts` (команда `npm run check`, TypeScript 7.0.2). После разбора файл удалён.

| № | Код | Сообщение компилятора | Причина | Исправление |
|---|-----|------------------------|---------|-------------|
| 1 | `distance = "610";` | `TS2322: Type 'string' is not assignable to type 'number'.` | В переменную типа `number` записали строку | Записать число: `distance = 610;` |
| 2 | `console.log(route.plannedDistanceKM);` | `TS2551: Property 'plannedDistanceKM' does not exist on type 'Route'. Did you mean 'plannedDistanceKm'?` | Опечатка в имени поля (регистр букв) | Исправить на `route.plannedDistanceKm` |
| 3 | `const vehicleId: number = courier.vehicleId;` | `TS2322: Type 'number \| undefined' is not assignable to type 'number'. Type 'undefined' is not assignable to type 'number'.` | Поле `vehicleId?` необязательное, может быть `undefined` (курьер может работать без закреплённого транспорта) | Проверить значение: `if (courier.vehicleId !== undefined) { ... }` или `courier.vehicleId ?? 0` |
| 4 | `route.createdAt = "2026-10-01T00:00:00Z";` | `TS2540: Cannot assign to 'createdAt' because it is a read-only property.` | Поле `createdAt` помечено `readonly`: дата создания маршрута не должна меняться | Не изменять поле; при необходимости создать новый объект |
| 5 | `const dto: CreateRouteDto = { ..., createdById: 2 };` | `TS2353: Object literal may only specify known properties, and 'createdById' does not exist in type 'CreateRouteDto'.` | Лишнее поле в литерале DTO: автора маршрута определяет сервер, а не клиент | Убрать `createdById` из объекта |
| 6 | `delivery.status = "LOST";` | `TS2322: Type '"LOST"' is not assignable to type 'DeliveryStatus'.` | Значение вне объединения литералов `DeliveryStatus` | Использовать допустимое значение, например `"DELAYED"`, или добавить новый статус в тип |
| 7 | `const r: Route = { id: 1, name: "X", ... };` (без `createdById`) | `TS2741: Property 'createdById' is missing in type '{ ... }' but required in type 'Route'.` | В объекте нет обязательного поля сущности | Добавить `createdById: 2` |

## Часть 2. Работа с ИИ-ассистентом

> Заполните своими словами. Минимум два случая. Непроверенный код не засчитывается.

### Случай 1

- **Промпт:** …
- **Краткое содержание ответа:** …
- **Что проверил(а) и как:** (запустил(а) `npm run check` / `npm run dev`, сравнил(а) с документацией, провёл(а) эксперимент) …
- **Что принял(а), что отверг(ла) и почему:** …

### Случай 2

- **Промпт:** …
- **Краткое содержание ответа:** …
- **Что проверил(а) и как:** …
- **Что принял(а), что отверг(ла) и почему:** …
