import { UserContext } from "../lib/UserContext";
import { useContext } from "react";
import { setUserCookie } from "../lib/firebaseUser";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/router";

function useUser() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  //if the user has not been loaded yet
  const isLoadingUser = user === null;
  return { user, setUser, logOut, isLoadingUser };
}

export default useUser;
