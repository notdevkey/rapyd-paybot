import { validateEnv } from '../utils/validate-env';

import axios, { AxiosInstance } from 'axios';

class HelloService {
  private uri!: string;
  private client!: AxiosInstance;

  constructor() {
    // TODO: handle invalid env variables
    if (!validateEnv) return;
    this.uri = process.env.WRAPPER_URI as string;
    this.client = axios.create({
      baseURL: this.uri,
    });
  }

  public checkService = async () => {
    await this.client
      .get('/check')
      .then((response) => {
        console.log(response.data);
        console.log(response.status);
      })
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          console.error(e.message);
        } else {
          console.error('Unexpected Error occurerd');
        }
      });
  }
}

export default HelloService;