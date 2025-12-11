import { Request, Response } from 'express';
import { PassengerService } from '../services/passengers.service';

export const PassengersController = {
  async getAll(_: Request, res: Response) {
    const data = await PassengerService.getAll();
    res.json(data);
  },

  async getById(req: Request, res: Response) {
    const passenger = await PassengerService.getById(req.params.id);

    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    res.json(passenger);
  },

  async create(req: Request, res: Response) {
    console.log('REQ BODY:', req.body);

    const passenger = await PassengerService.create(req.body);
    res.status(201).json(passenger);
  },

  async update(req: Request, res: Response) {
    const updated = await PassengerService.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    res.json(updated);
  },

  async delete(req: Request, res: Response) {
    const removed = await PassengerService.delete(req.params.id);

    if (!removed) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    res.json(removed);
  },
};
