import { auth } from "@/firebaase/config";
import { AuthContextValues, Prop } from "@/types";
import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextValues | null>(null);

export const AuthProvider = ({ children }: Prop) => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserAuth(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={{ userAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const user = useContext(AuthContext);
  if (!user) {
    throw new Error("AuthContext Null");
  }
  return user;
};
