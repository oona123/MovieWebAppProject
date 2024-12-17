import { useContext } from "react";
import { UserContext } from "./userContext";

// Custom hook to access user data from the context
export const useUser = () => {
  return useContext(UserContext);
};
