import { Request, Response } from 'express';
import { PassengerService } from '../services/passengers.service';

export const PassengersController = {
  getAll: (req: Request, res: Response) => {
    const data = PassengerService.getAll();
    res.json(data);
  },

  getById: (req: Request, res: Response) => {
    const passenger = PassengerService.getById(req.params.id);

    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    res.json(passenger);
  },

  create: (req: Request, res: Response) => {
    const newPassenger = PassengerService.create(req.body);
    res.status(201).json(newPassenger);
  },

  update: (req: Request, res: Response) => {
    const result = PassengerService.update(req.params.id, req.body);

    if (!result) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    res.json(result);
  },

  delete: (req: Request, res: Response) => {
    const removed = PassengerService.delete(req.params.id);

    if (!removed) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    res.json(removed);
  },
};
