import { useState } from "react";
import { UserContext } from "./userContext";
import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export default function UserProvider({ children }) {
  // Get the stored user data from sessionStorage
  const userFromSessionStorage = sessionStorage.getItem("user");
  const [user, setUser] = useState(
    userFromSessionStorage
      ? JSON.parse(userFromSessionStorage)
      : { email: "", username: "", password: "" }
  );

  // Function for user signup
  const signUp = async () => {
    const payload = {
      email: user.email,
      username: user.username,
      password: user.password,
    };

    if (user.first_name) payload.first_name = user.first_name;
    if (user.last_name) payload.last_name = user.last_name;

    const json = JSON.stringify(user);
    const headers = { headers: { "Content-Type": "application/json" } };
    try {
      await axios.post(url + "/user/register", json, headers);
      setUser({ email: "", username: "", first_name: "", last_name: "", password: "" });
    } catch (error) {
      throw error;
    }
  };

  // Function for user login
  const logIn = async () => {
    // Login with email or username
    const identifier = user.email || user.username;
    const json = JSON.stringify({ identifier, password: user.password });
    const headers = { headers: { "Content-Type": "application/json" } };

    try {
      const response = await axios.post(url + "/user/login", json, headers);
      const token = response.data.token;
      setUser({
        ...response.data,
        token: token,
      });
      
      sessionStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      setUser({ email: "", password: "" });
      throw error;
    }
  };

  // Function for user logout
  const logOut = async () => {
      // Clear user state and session storage
      setUser({ email: "", username: "", password: "", token: "" });
      sessionStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, signUp, logIn, logOut  }}>
      {children}
    </UserContext.Provider>
  );
}
