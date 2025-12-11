import { mockPassengers } from '../mocks/passengers';

export type Passenger = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

// Пока что модель работает только с моками
export const PassengerModel = {
  findAll: () => mockPassengers,

  findById: (id: string) => mockPassengers.find((p) => p.id === id),

  create: (data: Passenger) => {
    mockPassengers.push(data);
    return data;
  },

  update: (id: string, data: Partial<Passenger>) => {
    const index = mockPassengers.findIndex((p) => p.id === id);
    if (index === -1) return null;

    mockPassengers[index] = { ...mockPassengers[index], ...data };
    return mockPassengers[index];
  },

  delete: (id: string) => {
    const index = mockPassengers.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const removed = mockPassengers.splice(index, 1);
    return removed[0];
  },
};
