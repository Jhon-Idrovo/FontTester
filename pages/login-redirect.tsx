import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "react-query";
import axiosInstance from "../lib/axios";

function LoginRedirect() {
  const router = useRouter();
  const { at, rt } = router.query as { at: string; rt: string };
  useEffect(() => {
    localStorage.setItem("ss", at);
    localStorage.setItem("rr", rt);
    router.push("/");
  }, []);
  return <div></div>;
}

export default LoginRedirect;
