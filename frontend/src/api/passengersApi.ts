import type { Passenger } from '../shared/types/Passengers';
import { baseApi } from './baseApi';

export const passengersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPassengers: build.query<Passenger[], void>({
      query: () => '/passengers',
      providesTags: ['Passengers'],
    }),

    createPassenger: build.mutation<Passenger, Passenger>({
      query: (body) => ({
        url: '/passengers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Passengers'],
    }),

    updatePassenger: build.mutation<
      Passenger,
      { id: string; name: string; phone: string; email: string }
    >({
      query: ({ id, ...rest }) => ({
        url: `/passengers/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Passengers'],
    }),

    deletePassenger: build.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/passengers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Passengers'],
    }),
  }),
});

export const {
  useGetPassengersQuery,
  useCreatePassengerMutation,
  useUpdatePassengerMutation,
  useDeletePassengerMutation,
} = passengersApi;
