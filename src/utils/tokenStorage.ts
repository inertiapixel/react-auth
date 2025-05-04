export const getToken = (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  };
  
  // Set token to localStorage or cookie
  export const setToken = (key: string, token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, token);
    }
  };
  
  // Remove token from localStorage or cookie
  export const removeToken = (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  };
  