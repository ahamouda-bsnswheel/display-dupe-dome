interface AuthData {
  "x-api-key": string;
  employee_id: number;
  user_id: number;
  is_internal: boolean;
  is_manager: boolean;
}

interface EmployeeData {
  name: string;
  email: string;
  image?: string;
  [key: string]: any; // For other fields from API
}

const AUTH_STORAGE_KEY = "noc_auth_data";
const EMPLOYEE_STORAGE_KEY = "noc_employee_data";

export const authStorage = {
  // Store auth data
  setAuthData: (data: AuthData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  },

  // Get auth data
  getAuthData: (): AuthData | null => {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Get API key for requests
  getApiKey: (): string | null => {
    const data = authStorage.getAuthData();
    return data ? data["x-api-key"] : null;
  },

  // Get auth headers for API requests
  getAuthHeaders: (): Record<string, string> => {
    const apiKey = authStorage.getApiKey();
    return apiKey ? { "x-api-key": apiKey } : {};
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authStorage.getApiKey() !== null;
  },

  // Store employee data
  setEmployeeData: (data: EmployeeData) => {
    localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(data));
  },

  // Get employee data
  getEmployeeData: (): EmployeeData | null => {
    const data = localStorage.getItem(EMPLOYEE_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Clear auth data (logout)
  clearAuthData: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(EMPLOYEE_STORAGE_KEY);
  },
};
