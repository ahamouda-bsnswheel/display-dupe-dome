import { EmployeeData } from "@/types/employee";

interface AuthData {
  "x-api-key": string;
  employee_id: number;
  user_id: number;
  is_internal: boolean;
  is_manager: boolean;
}

const AUTH_STORAGE_KEY = "noc_auth_data";
const EMPLOYEE_STORAGE_KEY = "noc_employee_data";

// Utility function to convert HTTP image URLs to HTTPS and replace IP address with domain
export const getSecureImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  // Replace IP address domain with the correct domain
  let secureUrl = url.replace(/http:\/\/54\.152\.254\.233:8011/gi, 'https://bsnswheel.org');
  // Convert any remaining http to https
  secureUrl = secureUrl.replace(/^http:\/\//i, 'https://');
  return secureUrl;
};

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
    return apiKey ? { "Authorization": apiKey } : {};
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
