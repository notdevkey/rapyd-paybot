import { object, string, TypeOf } from 'zod';

export const createWalletSchema = object({
  body: object({
    ewallet_reference_id: string({
      required_error: 'Ewallet reference id is required',
    }),
    type: string({
      required_error: 'Ewallet type is required',
    }),
    contact: object({
      phone_number: string({
        required_error: 'Contact phone is required',
      }),
      email: string({
        required_error: 'Contact email is required',
      }).email('Email not valid'),
      first_name: string({
        required_error: 'Contact name is required',
      }),
      contact_type: string({
        required_error: 'Contact type is required',
      }),
    }),
  }).refine((data) => data.type === 'person' || data.type == 'company', {
    message: 'Wallet type must be either person or company',
    path: ['type'],
  }).refine((data) => data.contact.contact_type === 'personal' || data.contact.contact_type === 'business', {
    message: 'Contact type must be either personal or business',
    path: ['contact_type'],
  }),
});

export type CreateWalletInput = TypeOf<typeof createWalletSchema>;