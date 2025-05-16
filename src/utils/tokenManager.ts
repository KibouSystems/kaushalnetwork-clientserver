import Cookies from 'js-cookie';
import { get } from 'lodash';

const TOKEN_KEY = 'auth_token';

export const tokenManager = {
  setToken(token: string) {
    Cookies.set(TOKEN_KEY, token, { expires: 7 }); // Store for 7 days
    // localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return Cookies.get(TOKEN_KEY);
  },

  getadmin(): string | null {
    return Cookies.get('admin');
  },
  removeToken() {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  clearToken() {
    // Clear cookie manually
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Clear localStorage
    localStorage.removeItem('auth_token');
    // Clear js-cookie if using it
    Cookies.remove('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
