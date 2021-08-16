import { FormEvent, useState } from "react";

import useUser from "../hooks/useUser";
import axiosInstance from "../lib/axios";

function SignUpForm() {
  const { setUser } = useUser();
  const [error, setError] = useState<string>("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(e);
    const data = await axiosInstance
      .post("/auth/signup", {
        username: (e.target[0] as HTMLInputElement).value,
        email: e.target[1].value,
        password: e.target[2].value,
      })
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.response);
        setError(err.response.data.error.message);
        return false;
      });
    if (data) {
      setUser(data.user);
      const aTkn = data.accessToken;
      const rTkn = data.refreshToken;
      axiosInstance.defaults.headers.Autorization = "JWT " + aTkn;
      localStorage.setItem("ss", aTkn);
      localStorage.setItem("rr", rTkn);
    }
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
      {error ? (
        <div className="text-alert mx-auto font-medium">{error}</div>
      ) : null}
      <input
        type="submit"
        value="Submit"
        className="btn px-2 py-0 mx-auto table"
      />
    </form>
  );
}

export default SignUpForm;
