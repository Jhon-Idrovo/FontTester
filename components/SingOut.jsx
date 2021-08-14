import { auth } from "../lib/firebase";

export default function SingOut(props) {
  return props.user && <button onClick={() => auth.signOut()}>Sing Out</button>;
}
