import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../lib/firebase";
import firebase from "firebase/app";
import { useRouter } from "next/router";
import { saveUserToFirestore } from "../lib/firebaseUser";

function FirebaseAuth() {
  const router = useRouter();
  const uiConfig = {
    signInFlow: "popup",

    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    ],

    callbacks: {
      signInSuccessWithAuthResult: (auth) => {
        console.log(auth);
        console.log(router);
        //save the user data in case it's calling the component from the sign up page
        if (router.pathname === "/sign-up") {
          saveUserToFirestore(auth.user);
        }
        //avoid redirects
        return false;
      },
    },
  };
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />;
}

export default FirebaseAuth;
