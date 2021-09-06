import { AxiosError } from "axios";

import { FormEvent, useState } from "react";
import ButtonLoading from "../components/ButtonLoading";
import axiosInstance from "../lib/axios";

function Recovery() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [processState, setProcessState] = useState<
    "email" | "code" | "success"
  >("email");
  const [btnState, setBtnState] = useState<"stale" | "processing">("stale");
  const [errorMsg, setErrorMsg] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setBtnState("processing");
    try {
      await axiosInstance.post("/auth/send-recovery-code", { email });
      setProcessState("code");
    } catch (error) {
      console.log(error);
      setErrorMsg((error as AxiosError)?.response?.data.error.message);
    }
    setBtnState("stale");
  };
  const handleSecondSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setBtnState("processing");
    try {
      // for security reasons, check the code against the code
      const r = await axiosInstance.post("/auth/verify-recovery-code", {
        code: code.join(""),
        email,
      });
      window.location.href = r.data.redirect;
      setProcessState("success");
      //router.push("/password-change");
    } catch (error: any) {
      console.log(error);
      setErrorMsg(error.response.data.error.message);
    }
    setBtnState("stale");
  };
  const handleChange = (e, index) => {
    setCode((prev) => {
      prev[index] = e.target.value;
      return JSON.parse(JSON.stringify(prev));
    });
    document.getElementById(`code-in-${index + 1}`)?.focus();
  };
  return (
    <div>
      <form
        action=""
        className="flex flex-col justify-center items-center mt-8"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email" className="text-txt-base">
          Enter the email associated with your account
        </label>
        <input
          type="email"
          name=""
          id="email"
          className="bg-secondary-input "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errorMsg && processState === "email" && (
          <p className="text-alert">{errorMsg}</p>
        )}
        <button
          type="submit"
          className={`btn py-0 px-2 mt-4 ${
            processState === "email"
              ? "max-h-screen"
              : "max-h-0 overflow-hidden border-0"
          }`}
        >
          {btnState === "processing" && <ButtonLoading />}
          Continue
        </button>
      </form>
      <form
        action=""
        className={`flex flex-col justify-center items-center mt-8 ${
          processState === "code" ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
        onSubmit={handleSecondSubmit}
      >
        <label htmlFor="activation-code" className="text-txt-base">
          You will recieve an email with a code, please inset the code below
        </label>
        <div className="grid grid-cols-6 grid-rows-1 w-1/5 h-16 gap-2 mt-4">
          {code.map((n, index) => (
            <div
              className="bg-secondary text-txt-secondary w-full h-full"
              key={index}
            >
              <input
                type="text"
                className="w-full h-full text-4xl bg-secondary-input text-center pr-2"
                value={n}
                id={`code-in-${index}`}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
          ))}
        </div>
        {errorMsg && processState === "code" && (
          <p className="text-alert">{errorMsg}</p>
        )}
        <button type="submit" className="btn py-0 px-2 mt-4 ">
          Continue
        </button>
        <p
          className="text-txt-base cursor-pointer"
          onClick={() => {
            setProcessState("email");
            setErrorMsg("");
          }}
        >
          Didn't recieve the code?
        </p>
      </form>
    </div>
  );
}

export default Recovery;
