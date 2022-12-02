import { object, string, number, TypeOf } from 'zod';

export const createPaymentSchema = object({
  body: object({
    source_ewallet: string({
      required_error: 'Source Ewallet is required',
    }),
    amount: number({
      required_error: 'Transfer amount is required',
    }),
    currency: string({
      required_error: 'Currency is required',
    }),
    destination_ewallet: string({
      required_error: 'Destination Ewallet is required',
    }),
  })
    .refine((data) => data.source_ewallet === data.destination_ewallet, {
      message: 'Source and destination wallets cannot be equal',
      path: ['source_ewallet', 'destination_ewallet'],
    }),
});

export type CreatePaymentInput = TypeOf<typeof createPaymentSchema>;
