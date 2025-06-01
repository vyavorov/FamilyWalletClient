import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Опитваме да парснем user от localStorage безопасно
  let initialUser = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      initialUser = JSON.parse(storedUser);
    }
  } catch (e) {
    console.warn("Invalid user data in localStorage. Clearing it.");
    localStorage.removeItem("user");
  }

  const [user, setUser] = useState(initialUser);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      try {
        // ✅ Записваме само нужните полета
        const minimalUser = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
        localStorage.setItem("user", JSON.stringify(minimalUser));
      } catch (e) {
        console.error("Failed to save user in localStorage:", e);
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
