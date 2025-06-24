export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'customer' | 'agent';
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: 'customer' | 'agent';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}
