export interface RapydResponse<T> {
  status: RapydResponseStatus;
  data: T;
  url: string;
}

export interface RapydResponseStatus {
  error_code: string;
  status: string;
  message: string;
  response_code: string;
}