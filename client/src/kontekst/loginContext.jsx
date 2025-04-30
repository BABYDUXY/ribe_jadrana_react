import { createContext, useContext, useEffect, useState } from "react";

// Kreiramo kontekst
export const loginContext = createContext();

// Provider komponenta
export function LoginProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (username) => {
    sessionStorage.setItem("korisnicko_ime", username);
    setUser(username);
  };

  const logout = () => {
    sessionStorage.removeItem("korisnicko_ime");
    setUser(null);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("korisnicko_ime");
    if (userData) {
      setUser(userData);
    } else {
      setUser(null);
    }
    setIsLoading(false); // važno!
  }, []);

  return (
    <loginContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </loginContext.Provider>
  );
}

// Helper za lakše dohvaćanje konteksta
export const useLogin = () => useContext(loginContext);
