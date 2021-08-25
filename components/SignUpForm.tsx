import { FormEvent, useState } from "react";

import useUser from "../hooks/useUser";
import axiosInstance from "../lib/axios";
import ButtonLoading from "./ButtonLoading";

function SignUpForm() {
  const { setUser } = useUser();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await axiosInstance
        .post("/auth/signup", {
          username: ((e.target as any)[0] as HTMLInputElement).value,
          email: ((e.target as any)[1] as HTMLInputElement).value,
          password: ((e.target as any)[2] as HTMLInputElement).value,
        })
        .then((res) => res.data);

      //update user, tokens and axios instance
      setUser({ ...data.user, role: data.user.role.name });
      const aTkn = data.accessToken;
      const rTkn = data.refreshToken;
      axiosInstance.defaults.headers.Autorization = "JWT " + aTkn;
      localStorage.setItem("ss", aTkn);
      localStorage.setItem("rr", rTkn);
    } catch (err) {
      setError(err.response.data.error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className="bg-secondary text-txt-secondary flex flex-col w-2/4 mx-auto mt-4"
      onSubmit={handleSubmit}
    >
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
      <button className="btn px-2 py-0 mx-auto table">
        {isLoading ? <ButtonLoading /> : null}
        Sign Up
      </button>
    </form>
  );
}

export default SignUpForm;
