import { Passenger, PassengerModel } from '../models/passenger.model.mocks';

export const PassengerService = {
  getAll: () => PassengerModel.findAll(),

  getById: (id: string) => PassengerModel.findById(id),

  create: (data: Passenger) => PassengerModel.create(data),

  update: (id: string, data: Partial<Passenger>) =>
    PassengerModel.update(id, data),

  delete: (id: string) => PassengerModel.delete(id),
};
