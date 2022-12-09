import { AxiosError } from 'axios';

interface RapydResponse<T> {
  status: RapydResponseStatus;
  data: T;
}

interface RapydResponseStatus {
  error_code: string;
  status: string;
  message: string;
  response_code: string;
}

export interface RapydError {
  error_code: string;
  status: string;
  message: string;
  response_code: string;
  operation_id: string;
}

export type RapydAxiosError = AxiosError<{ status: RapydError }>;

export enum RapydErrorCode {
  ERROR_CREATE_USER_EWALLET_REFERENCE_ID_ALREADY_EXISTS = 'ERROR_CREATE_USER_EWALLET_REFERENCE_ID_ALREADY_EXISTS',
}

export default RapydResponse;
