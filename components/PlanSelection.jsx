import { useState, useContext } from "react";
import { fetchFromAPI } from "../lib/utils";

//elements
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";

export default function PlanSelection() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [priceId, setPriceId] = useState();
  const elemets = useElements();
  const stripe = useStripe();
  const cardOptions = {
    style: {
      base: {
        color: "white",
        "::placeholder": {
          color: "white",
        },
        border: "2px white solid",
      },
    },
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const card = elemets.getElement(CardElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log(error);
      return;
    } else {
      const { latest_invoice } = await fetchFromAPI("/subscriptions/create", {
        body: { priceId, paymentMethod: paymentMethod.id },
        method: "POST",
      });

      //the subscription contains the invoice with the payment intent that tells if the payment has been made
      //if the invoice's payment succeeded then we don't need to do anything
      //otherwise, confirmation is needed
      if (latest_invoice.payment_intent) {
        const { client_secret, status } = latest_invoice.payment_intent;
        //if 3d verification is needed
        if (
          status === "requires_action" ||
          status === "requires_confirmation"
        ) {
          const { error: confirmationError } = await stripe.confirmCardPayment(
            client_secret
          );
          if (confirmationError) {
            console.log(
              "An error happened trying to confirm the card payment:",
              confirmationError
            );
          } else {
            //success
            alert("You are subscribed");
            setUser((prev) => ({ ...prev, subscriptionType: "PRO" }));
            router.push("/");
          }
        }
      }
    }
  };

  return (
    <div>
      <p className="text-2xl">
        Select a subscription plan and confirm your payment
      </p>
      <div className="flex justify-center mt-2">
        <button
          className={`border-2 p-2 outline-none ${
            priceId === "price_1Iyx9wHhEOvz8JaOSVCF6AJi"
              ? "border-primary"
              : "border-txt-secondary"
          }`}
          onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOSVCF6AJi")}
        >
          <h1 className="font-semibold text-2xl">Mensual</h1>
          <p>Normal price</p>
          <p className="line-through font-thin text-opacity-50">$3.99</p>
          <p>Launching price</p>
          <p className="font-thin">$1.50</p>
        </button>
        <button
          className={`border-2 border-collapse p-2 outline-none ${
            priceId === "price_1Iyx9wHhEOvz8JaOMOYdWrWV"
              ? "border-primary"
              : "border-txt-secondary"
          }`}
          onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOMOYdWrWV")}
        >
          <h1 className="font-semibold text-2xl">Anual</h1>
          <p>Normal price</p>
          <p className="line-through font-thin text-opacity-50">$10.99</p>
          <p>Launching price</p>
          <p className="font-thin">$7.50</p>
        </button>
      </div>
      <form className="mt-8" onSubmit={handleSubmit}>
        <CardElement
          options={cardOptions}
          className="text-txt-secondary w-full"
        />
        <button
          className="btn px-6 py-1 w-max mx-auto mt-8 table"
          disabled={!user | (user === "guest")}
        >
          Join
        </button>
        {!user | (user === "guest") ? (
          <p className="text-alert w-max mx-auto font-medium">
            Please create a user first
          </p>
        ) : null}
        {!priceId ? (
          <p className="text-alert w-max mx-auto font-medium">
            Please select a plan first
          </p>
        ) : null}
      </form>
    </div>
  );
}
