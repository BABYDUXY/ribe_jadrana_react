import { createContext, useContext, useEffect, useState } from "react";

// Kreiramo kontekst
export const loginContext = createContext();

// Provider komponenta
export function LoginProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (user) => {
    const { korisnik_id, exp, iat, ...withoutId } = user;
    sessionStorage.setItem("korisnik", JSON.stringify(withoutId));
    setUser(withoutId);
    console.log(user);
  };

  const logout = () => {
    sessionStorage.removeItem("korisnik");
    sessionStorage.removeItem("token");
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
