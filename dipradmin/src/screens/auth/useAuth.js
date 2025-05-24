import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (authToken) {
      try {
        const decoded = jwt.decode(authToken);
        setUser(decoded); // { userId, role }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  return user;
};

export default useAuth;
