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

//context
import { defaultUser, UserContext } from "../lib/UserContext";

//
import { AppProps } from "next/dist/next-server/lib/router/router";
import { IRole, IUser, JwtAccesPayload } from "../lib/interfaces";
import axiosInstance from "../lib/axios";
import { decodeJWT } from "../lib/utils";

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
  const [user, setUser] = useState<IUser>(defaultUser);
  //memoize the value for performance
  //const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  //check if there is an access token
  useEffect(() => {
    const accessToken = localStorage.getItem("ss");
    let payload;
    if (accessToken) {
      payload = decodeJWT(accessToken);
      axiosInstance.defaults.headers.Authorization = "JWT " + accessToken;
      if (payload) {
        const { email, userID, name, role } = payload as JwtAccesPayload;
        setUser({ _id: userID, role: role as IRole, email, username: name });
      }
    }
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
          <UserContext.Provider value={{ user, setUser }}>
            <NavBar />
            <Component {...pageProps} />
          </UserContext.Provider>
        </Elements>
      </QueryClientProvider>
    </>
  );
}

export async function getServerSideProps() {}
