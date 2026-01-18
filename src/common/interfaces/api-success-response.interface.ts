import { ResponseStatus } from '../constants/response.constant';

export interface ApiSucessResponseFormat<T> {
  status: ResponseStatus;
  message: string;
  data: T;
}
