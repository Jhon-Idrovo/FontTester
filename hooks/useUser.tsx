import { defaultUser, UserContext } from "../lib/UserContext";
import { useContext } from "react";
import axiosInstance from "../lib/axios";

/**
 *
 * @returns User object and set user function
 * User object is always present, with a default value.
 */
function useUser() {
  const { user, setUser } = useContext(UserContext);
  //if the user has not been loaded yet
  //this may not be neccesary
  const isLoadingUser = user === null;
  const logOut = () => {
    localStorage.removeItem("ss");
    localStorage.removeItem("rr");
    axiosInstance.defaults.headers.Authorization = null;
    setUser(defaultUser);
  };
  return { user, setUser, logOut, isLoadingUser };
}

export default useUser;
