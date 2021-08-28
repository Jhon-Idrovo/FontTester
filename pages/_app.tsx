import { useState, useMemo, useEffect } from "react";
//Nextjs
import Head from "next/head";
//locals
import "../styles/global.css";
import NavBar from "../components/NavBar";

//stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
//react query
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
//context
import { defaultUser, UserContext } from "../lib/UserContext";

//
import { IRole, IUser, JwtAccesPayload } from "../lib/interfaces";
import axiosInstance from "../lib/axios";
import { decodeJWT } from "../lib/utils";
import { useRouter } from "next/router";
import { AppProps } from "next/dist/shared/lib/router/router";

export const stripePromise = loadStripe(
  "pk_test_51Iyx5dHhEOvz8JaOeTtCEBXMSff06WroQUgQ3ipHwrJpERmx1uPd2S50weOJFRo6JRxxpbrUXvViNMudhE0hR9S700hzAOsrqs"
);

// Create a react-query client
const queryClient = new QueryClient();
/**
 *
 *
 *
 */
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [user, setUser] = useState<IUser>(defaultUser);
  //memoize the value for performance
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  //check if there is an access token
  useEffect(() => {
    // handling login with third party oauth
    console.log(router);
    const pathString = router.asPath;
    const at = router.asPath.slice(
      pathString.indexOf("at=") + 3,
      pathString.indexOf("&")
    );
    const rt = router.asPath.slice(
      pathString.indexOf("rt=") + 3,
      pathString.length
    );
    // const { at, rt } = router.query as { at: string; rt: string };
    if (at.length === 257 && rt.length === 257) {
      localStorage.setItem("ss", at);
      localStorage.setItem("rr", rt);
    }
    async function handleReload() {
      let accessToken = localStorage.getItem("ss");
      const refreshToken = localStorage.getItem("rr");
      let payload: JwtAccesPayload | null = null;
      if (refreshToken && !accessToken) {
        //Handling edge case:
        //The ss token was deleted on sign up to force the
        //retrieval of a new, updated token.
        //But the user reloaded  and there is no token to run the
        //above code. This leads to signout.
        await axiosInstance
          .post("/tokens/new-access-token", {
            refreshToken,
          })
          .then((res) => (accessToken = res.data.accessToken))
          .catch((error) => {
            alert("Please, sign in again");
            console.log(error);
          });
      }

      if (accessToken) {
        axiosInstance.defaults.headers.Authorization = "JWT " + accessToken;
        payload = decodeJWT(accessToken);
        const { email, userID, name, role } = payload;
        setUser({ _id: userID, role: role as IRole, email, username: name });
      }
    }
    handleReload();
  }, []);
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />

        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* font-awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Elements stripe={stripePromise}>
          <UserContext.Provider value={value}>
            <NavBar />
            <Component {...pageProps} />
          </UserContext.Provider>
        </Elements>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </>
  );
}

export async function getServerSideProps() {}
