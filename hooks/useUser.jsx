import { UserContext } from "../lib/UserContext";
import { useContext } from "react";
import { setUserCookie } from "../lib/firebaseUser";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/router";

function useUser() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const logOut = async () => {
    return auth

      .signOut()
      .then(() => {
        //Sign-out successful.
        router.push("/");
      })
      .catch((e) => {
        console.error(e);
      });
  };
  //if the user has not been loaded yet
  const isLoadingUser = user===null
  return { user, setUser, logOut, isLoadingUser };
}

export default useUser;

// const useUser = () => {
//   const [user, setUser] = useState();
//   const router = useRouter();

//   const logout = async () => {
//     return auth
//       .signOut()
//       .then(() => {
//         // Sign-out successful.
//         router.push("/");
//       })
//       .catch((e) => {
//         console.error(e);
//       });
//   };

//   useEffect(() => {
//     // Firebase updates the id token every hour, this
//     // makes sure the react state and the cookie are
//     // both kept up to date
//     const cancelAuthListener = auth.onIdTokenChanged((user) => {
//       if (user) {
//         setUserCookie(user);
//         setUser(user);
//       } else {
//         removeUserCookie();
//         setUser();
//       }
//     });
//     //the same user as the user of the earlier method
//     //doing this ensures that the user is saved to the cookie
//     const userFromCookie = getUserFromCookie();
//     if (!userFromCookie) {
//       router.push("/");
//       return;
//     }
//     setUser(userFromCookie);

//     return () => {
//       cancelAuthListener();
//     };
//   }, []);

//   return { user, logout };
// };

// export default useUser;
