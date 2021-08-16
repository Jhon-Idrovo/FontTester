import { FormEvent } from "react";
import useUser from "../hooks/useUser";
import { fetchFromAPI } from "../lib/utils";

function SignUpForm() {
  const { setUser } = useUser();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(e);

    const newUser = await fetchFromAPI("/auth/signup", {
      body: {
        username: e.target[0].value,
        email: e.target[1].value,
        password: e.target[2].value,
      },
      method: "POST",
    });
    newUser ? setUser(newUser) : null;
  };
  return (
    <form className="bg-secondary text-txt-secondary" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        id="username-in"
        name="name"
        className="bg-secondary-input"
      />
      <input
        type="email"
        id="email-in"
        placeholder="Email"
        name="email"
        className="bg-secondary-input"
      />
      <input
        type="password"
        placeholder="Password"
        id="password-in"
        name="password"
        className="bg-secondary-input"
      />
      <input
        type="submit"
        value="Submit"
        className="btn px-2 py-0 mx-auto table"
      />
    </form>
  );
}

export default SignUpForm;
