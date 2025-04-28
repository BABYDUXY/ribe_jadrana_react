import { createContext, useContext, useEffect, useState } from "react";

// Kreiramo kontekst
export const loginContext = createContext();

// Provider komponenta
export function LoginProvider({ children }) {
  const [user, setUser] = useState(null);

  // Funkcija koja dohvaća podatke iz sessionStorage
  const fetchUser = () => {
    const userData = sessionStorage.getItem("korisnicko_ime");
    if (userData) {
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  // useEffect koji se pokreće na mount + kad se token promijeni
  useEffect(() => {
    fetchUser();

    // Listener za promjene na sessionStorage
    const handleStorageChange = () => {
      fetchUser();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <loginContext.Provider value={{ user, fetchUser }}>
      {children}
    </loginContext.Provider>
  );
}

// Helper za lakše dohvaćanje konteksta
export const useLogin = () => useContext(loginContext);
