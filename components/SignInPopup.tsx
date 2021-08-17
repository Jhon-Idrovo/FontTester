import { AxiosError } from "axios";
import { FormEvent, MouseEventHandler, useState } from "react";
import useUser from "../hooks/useUser";
import axiosInstance from "../lib/axios";
import { IRole } from "../lib/interfaces";
import { decodeJWT } from "../lib/utils";
import ButtonLoading from "./ButtonLoading";

function SignInPopup({ close }: { close: MouseEventHandler }) {
  const { setUser } = useUser();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/signin", {
        ...credentials,
      });
      console.log(res);

      const { refreshToken, accessToken } = res.data;
      localStorage.setItem("ss", accessToken);
      localStorage.setItem("rr", refreshToken);
      axiosInstance.defaults.headers.Authorization = "JWT " + accessToken;
      const { userID, email, name, role } = decodeJWT(accessToken);
      setUser({ _id: userID, email, username: name, role: role as IRole });
    } catch (err) {
      setError((err as AxiosError).response?.data.error.message);
    }
    setIsLoading(false);
  };
  return (
    <div className="flex flex-col justify-center items-center bg-base fixed top-0 left-0 right-0 bottom-0 z-50">
      <div className="flex flex-col w-min p-4 bg-secondary relative">
        <button onClick={close} className="absolute top-0 right-1">
          <i className="fas fa-times"></i>
        </button>

        <form onSubmit={handleSubmit}>
          <h3 className="font-medium text-lg mx-auto table">Sign In</h3>
          <input
            type="email"
            id="email-in"
            placeholder="Email"
            name="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
            className="bg-secondary-input"
          />
          <input
            type="password"
            placeholder="Password"
            id="password-in"
            name="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
            className="bg-secondary-input"
          />
          {error ? (
            <div className="text-alert mx-auto font-medium">{error}</div>
          ) : null}
          <button type="submit" className="btn px-2 py-0 mx-auto  ">
            {isLoading ? <ButtonLoading></ButtonLoading> : null}
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignInPopup;
