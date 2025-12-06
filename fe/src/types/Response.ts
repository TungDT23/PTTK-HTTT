export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errors?: string[];
  message?: string; 
}
