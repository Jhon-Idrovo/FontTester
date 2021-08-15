import { defaultUser, UserContext } from "../lib/UserContext";
import { useContext } from "react";

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
  return { user, setUser, logOut: () => setUser(defaultUser), isLoadingUser };
}

export default useUser;
