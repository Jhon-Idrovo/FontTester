import { AxiosError } from "axios";
import { useState } from "react";
import ButtonLoading from "../components/ButtonLoading";
import axiosInstance from "../lib/axios";

function PasswordChange() {
  const [errorMsg, setErrorMsg] = useState("");
  const [reqState, setReqState] = useState<
    "" | "loading" | "success" | "error"
  >("");
  const [passwords, setPasswords] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setReqState("loading");
    // compare passwords
    if (passwords[0] !== passwords[1]) {
      setErrorMsg("The passwords are not the same");
      setReqState("error");
      return;
    }
    try {
      await axiosInstance.post("/auth/change-password", {
        newPassword: passwords[0],
      });
      setReqState("success");
    } catch (error) {
      console.log(error);
      setErrorMsg((error as AxiosError).response?.data.error.message);
      setReqState("error");
    }
  };
  return (
    <div>
      <form
        action=""
        className="flex flex-col max-w-sm mx-auto bg-secondary rounded-md p-4 mt-12"
        onSubmit={submitHandler}
      >
        <label htmlFor="password" className="text-txt-secondary">
          New Password
        </label>
        <input
          type="password"
          name=""
          id="password"
          value={passwords[0]}
          onChange={(e) => setPasswords((prev) => [e.target.value, prev[1]])}
          className="bg-secondary-input"
        />
        <label htmlFor="password-conf" className="text-txt-secondary">
          Confirm Password
        </label>
        <input
          type="password"
          name=""
          id="password-conf"
          value={passwords[1]}
          onChange={(e) => setPasswords((prev) => [prev[0], e.target.value])}
          className="bg-secondary-input"
        />
        {errorMsg && <div className="text-alert text-center">{errorMsg}</div>}
        {reqState === "success" && (
          <div className="text-center text-txt-secondary">Password changed</div>
        )}
        <button className="btn py-0 px-2 w-min table mx-auto">
          {reqState === "loading" && <ButtonLoading />}Submit
        </button>
      </form>
    </div>
  );
}

export default PasswordChange;
