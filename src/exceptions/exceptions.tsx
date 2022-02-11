import { ErrorTemplate } from '../models/error';

export class ApiError {
  constructor(public error: ErrorTemplate) {}
}
