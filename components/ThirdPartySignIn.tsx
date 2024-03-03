import Link from "next/link";
import React from "react";
import { API_URL } from "../lib/constants";

function ThirdPartySignIn() {
  return (
    <div className="flex flex-col justify-center items-center">
      <Link href={`${API_URL}/api/v3/auth/twitter`}>
        <a
          className="third-party-lgn-btn"
          style={{ backgroundColor: "#00acee" }}
        >
          <i className="fab fa-twitter-square mr-2"></i>
          Sign in with Twitter
        </a>
      </Link>
      <Link href={`${API_URL}/api/v3/auth/google`}>
        <a
          className="third-party-lgn-btn text-txt-ligth"
          style={{ backgroundColor: "white" }}
        >
          <i
            className="fab fa-google-plus-square mr-2"
            style={{ color: "#DB4437", backgroundColor: "white" }}
          ></i>
          Sign in with Google
        </a>
      </Link>
    </div>
  );
}

export default ThirdPartySignIn;
