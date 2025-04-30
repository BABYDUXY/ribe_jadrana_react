import { createContext, useContext, useEffect, useState } from "react";

// Kreiramo kontekst
export const loginContext = createContext();

// Provider komponenta
export function LoginProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (user) => {
    sessionStorage.setItem("korisnik", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    sessionStorage.removeItem("korisnik");
    setUser(null);
  };

  useEffect(() => {
    const userData = sessionStorage.getItem("korisnik");

    const parsedUserData = userData ? JSON.parse(userData) : null;

    if (parsedUserData && parsedUserData.korisnicko_ime) {
      setUser(parsedUserData);
    } else {
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  return (
    <loginContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </loginContext.Provider>
  );
}

// Helper za lakše dohvaćanje konteksta
export const useLogin = () => useContext(loginContext);
