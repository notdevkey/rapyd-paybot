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

export default RapydResponse;