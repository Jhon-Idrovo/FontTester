import { useState } from "react";
import { fetchFromAPI } from "../lib/utils";
import { useStripe } from "@stripe/react-stripe-js";

function Checkout() {
  const stripe = useStripe();

  const [priceId, setPriceId] = useState("price_1Iyx9wHhEOvz8JaOMOYdWrWV");

  const handleCheckout = async () => {
    //Get the checkout session id
    const { id: sessionId } = await fetchFromAPI("/subscriptions/create", {
      body: { priceId },
    });
    console.log(sessionId);
    //use the session id to make the payment
    const { error } = stripe.redirectToCheckout({ sessionId });
    error ? console.log(error) : null;
  };
  return (
    <div>
      <h1>Select an option</h1>
      <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOSVCF6AJi")}>
        Mensual
      </button>
      <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOMOYdWrWV")}>
        Anually
      </button>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default Checkout;

export function CheckoutSuccess() {
  //retrieve the session id from stripe
  const url = window.location.href;
  const sessionId = new URL(url).searchParams.get("session_id");
  return;
}
