import { object, string, number, TypeOf } from 'zod';

const reqParams = {
  params: object({
    paymentId: string({
      required_error: 'paymentId is required'
    }),
    walletId: string({
      required_error: 'ewalletId is required'
    }),
  }),
};

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
    .refine((data) => data.source_ewallet !== data.destination_ewallet, {
      message: 'Source and destination wallets cannot be equal',
      path: ['source_ewallet', 'destination_ewallet'],
    }),
});

export const setPaymentStatusSchema = object({
  body: object({
    id: string({
      required_error: 'Payment id (32-digit hexadecimal) is required',
    }),
    status: string({
      required_error: 'Payment status is required',
    }),
  })
    .refine((data) => data.status === 'accept' || data.status === 'decline', {
      message: 'Status must be either "accept" or "decline"',
      path: ['status'],
    }),
});

export const retrievePaymentSchema = object({
  ...reqParams,
});

export type CreatePaymentInput = TypeOf<typeof createPaymentSchema>;
export type RetrievePaymentInput = TypeOf<typeof retrievePaymentSchema>;
export type SetPaymentStatusInput = TypeOf<typeof setPaymentStatusSchema>;