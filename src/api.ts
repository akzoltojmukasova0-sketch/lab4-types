import { DeliveryResponse, Result } from "./dto";
import { isDeliveryResponse } from "./guards";

export function parseDeliveryResponse(json: string): Result<DeliveryResponse> {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, status: 400, message: "Некорректный JSON" };
  }
  if (!isDeliveryResponse(data)) {
    return { ok: false, status: 422, message: "Данные не похожи на DeliveryResponse" };
  }
  return { ok: true, data };
}

export async function getDelivery(baseUrl: string, id: number): Promise<Result<DeliveryResponse>> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl}/deliveries/${id}`);
  } catch {
    return { ok: false, status: 0, message: "Сервер недоступен" };
  }
  if (!res.ok) {
    return { ok: false, status: res.status, message: `Ошибка HTTP ${res.status}` };
  }
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, status: 502, message: "Ответ сервера — не JSON" };
  }
  if (!isDeliveryResponse(data)) {
    return { ok: false, status: 422, message: "Ответ сервера не похож на DeliveryResponse" };
  }
  return { ok: true, data };
}
