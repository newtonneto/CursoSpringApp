export interface ErrorTemplate {
  error: string;
  message: string;
  path: string;
  status: number;
  timestamp: string;
  errors?: ErrorField[];
}
export interface ErrorField {
  fieldName: string;
  message: string;
}
