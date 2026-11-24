import {
  findAllTables,
  insertTable,
  updateTableStatus,
  type RestaurantTable,
  type TableStatus,
} from './tables.repository.js';

const VALID_STATUSES: TableStatus[] = ['available', 'occupied', 'out_of_service'];

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export async function listTables(): Promise<RestaurantTable[]> {
  return findAllTables();
}

export async function createTable(name: unknown, capacity: unknown): Promise<RestaurantTable> {
  if (typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 80) {
    throw new HttpError(400, 'El nombre debe ser un texto entre 1 y 80 caracteres');
  }

  if (typeof capacity !== 'number' || !Number.isInteger(capacity) || capacity < 1 || capacity > 20) {
    throw new HttpError(400, 'La capacidad debe ser un entero entre 1 y 20');
  }

  try {
    return await insertTable(name.trim(), capacity);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      throw new HttpError(409, 'Ya existe una mesa con ese nombre');
    }
    throw error;
  }
}

export async function changeTableStatus(idParam: string, status: unknown): Promise<RestaurantTable> {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'El ID debe ser un entero positivo');
  }

  if (typeof status !== 'string' || !VALID_STATUSES.includes(status as TableStatus)) {
    throw new HttpError(400, 'Estado inválido. Usa: available, occupied o out_of_service');
  }

  const updated = await updateTableStatus(id, status as TableStatus);
  if (!updated) {
    throw new HttpError(404, 'Mesa no encontrada');
  }

  return updated;
}