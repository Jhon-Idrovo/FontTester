import Link from "next/link";
import { useRouter } from "next/router";

import { useState } from "react";
import useUser from "../hooks/useUser";
import SignInPopup from "./SignInPopup";

function NavBar() {
  const router = useRouter();
  const [isShowingSignIn, setIsShowingSignIn] = useState(false);

  const { user, logOut, isLoadingUser } = useUser();
  if (isLoadingUser) {
    return <div></div>;
  }
  return (
    <nav className=" p-2 h-10 flex justify-between items-center  bg-base text-txt-base border-b-2 border-secondary">
      <Link href="/">
        <a>Font Tester</a>
      </Link>
      <ul className="flex justify-between items-center">
        <li
          className={`nav-list-item ${
            router.pathname === "/" ? "nav-item-active" : null
          }`}
        >
          <Link href="/">
            <a>Test Fonts</a>
          </Link>
        </li>
        {user.role !== "Guest" ? (
          <>
            <li
              className={`nav-list-item ${
                router.pathname === "/exclusion-list" ? "nav-item-active" : null
              }`}
            >
              <Link href="/exlcusion-list">
                <a>Exclusion List</a>
              </Link>
            </li>
            <li
              className={`nav-list-item ${
                router.pathname === "/collections" ? "nav-item-active" : null
              }`}
            >
              <Link href="/collections">
                <a>Saved Collections</a>
              </Link>
            </li>
            <li
              className={`nav-list-item ${
                router.pathname === "/most-liked" ? "nav-item-active" : null
              }`}
            >
              <Link href="/most-liked">
                <a>Most Liked</a>
              </Link>
            </li>

            <li className="nav-list-item relative">
              <button
                id="user-icon"
                className="w-8 h-8 bg-primary text-txt-primary"
              >
                {user.username.charAt(0)}
                <ul className="user-icon-menu absolute right-0 top-8 z-50 bg-secondary text-txt-secondary p-2 w-max">
                  <li>
                    <button onClick={logOut}>Log Out</button>
                  </li>
                  <li>
                    <button onClick={() => router.push("/subscription")}>
                      Subscription
                    </button>
                  </li>
                </ul>
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-list-item">
              <button className="" onClick={() => setIsShowingSignIn(true)}>
                Sign In
              </button>
              {isShowingSignIn ? (
                <SignInPopup close={() => setIsShowingSignIn(false)} />
              ) : null}
            </li>
            <li>
              <button
                className="btn px-2"
                onClick={() => router.push("/sign-up")}
              >
                Sign Up
              </button>
            </li>
          </>
        )}

        {/* <li className="nav-list-item"><Link href="/trending"><a>Trending</a></Link></li> */}
      </ul>
    </nav>
  );
}

export default NavBar;
