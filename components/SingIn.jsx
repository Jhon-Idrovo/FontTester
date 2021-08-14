import { useContext } from "react";
import firebase from "firebase/app";
import { auth, db } from "../lib/firebase";
import { UserContext } from "../lib/UserContext";

/**
 *
 *
 *
 */
function SingIn() {
  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <button onClick={singInWithGoogle}>Sing in With Google</button>
    </div>
  );
}

export default SingIn;
