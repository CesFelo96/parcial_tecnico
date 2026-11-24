import { Router } from 'express';
import {
  changeTableStatus,
  createTable,
  HttpError,
  listTables,
} from './tables.service.js';

export const tablesRouter = Router();

tablesRouter.get('/', async (_req, res, next) => {
  try {
    const tables = await listTables();
    res.status(200).json(tables);
  } catch (error) {
    next(error);
  }
});

tablesRouter.post('/', async (req, res, next) => {
  try {
    const { name, capacity } = req.body ?? {};
    const table = await createTable(name, capacity);
    res.status(201).json(table);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
});

tablesRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body ?? {};
    const table = await changeTableStatus(req.params.id, status);
    res.status(200).json(table);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    next(error);
  }
});