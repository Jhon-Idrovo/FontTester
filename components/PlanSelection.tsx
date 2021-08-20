import { FormEvent, useState } from "react";

//elements
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import useUser from "../hooks/useUser";
import { useRouter } from "next/router";
import axiosInstance from "../lib/axios";
import {
  PaymentIntentResult,
  PaymentMethodResult,
  StripeCardElement,
  StripeElementChangeEvent,
} from "@stripe/stripe-js";
import ButtonLoading from "./ButtonLoading";

export default function PlanSelection() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [priceId, setPriceId] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
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
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const card = elemets?.getElement(CardElement) as StripeCardElement;
    const { paymentMethod, error } = (await stripe?.createPaymentMethod({
      type: "card",
      card,
    })) as PaymentMethodResult;
    if (error) {
      console.log(error);
      setErrMsg(error.message as string);
      return;
    } else {
      const { payment_intent } = await axiosInstance
        .post("/subscriptions/create", {
          priceId,
          paymentMethod: paymentMethod?.id,
        })
        .then((res) => res.data)
        .catch((err) => {
          console.log(error);
          setErrMsg(err.response.data.error.message);
          return { payment_intent: null };
        });

      //the payment intent that tells if the payment has been made
      //if the invoice's payment succeeded then we don't need to do anything
      //otherwise, confirmation is needed
      if (payment_intent) {
        const { client_secret, status } = payment_intent;
        //if 3d verification is needed
        if (
          status === "requires_action" ||
          status === "requires_confirmation"
        ) {
          const { error: confirmationError } =
            (await stripe?.confirmCardPayment(
              client_secret
            )) as PaymentIntentResult;
          if (confirmationError) {
            console.log(
              "An error happened trying to confirm the card payment:",
              confirmationError
            );
            setErrMsg(
              "An error happened trying to confirm the card payment:" +
                confirmationError.message
            );
          } else {
            //success
            alert("You are subscribed");
            //delete the access token to force requesting a new one with
            //role updated
            localStorage.removeItem("ss");
            //if the user does not reload the page this does the work too
            setUser((prev) => ({ ...prev, role: "User" }));
            router.push("/");
          }
        }
        //failed payment due to card error: https://stripe.com/docs/api/errors#errors-card_error
        if (status === "requires_payment_method") {
          setErrMsg(
            "An error with your card happened. Please try another one."
          );
        }
      }
    }
    setIsLoading(false);
  };
  const handleFormChange = (e: StripeElementChangeEvent) => {
    if (e.error) {
      setErrMsg(e.error.message);
    } else {
      setErrMsg("");
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
          onChange={handleFormChange}
        />
        <button
          className="btn px-6 py-1 w-max mx-auto mt-8 table"
          disabled={!user || user._id === "" || priceId === ""}
        >
          {isLoading ? <ButtonLoading /> : null}
          Join
        </button>
        {!user || user._id === "" ? (
          <p className="text-alert w-max mx-auto font-medium">
            Please create a user first
          </p>
        ) : null}
        {!priceId ? (
          <p className="text-alert w-max mx-auto font-medium">
            Please select a plan first
          </p>
        ) : null}
        {errMsg ? (
          <p className="text-alert w-max mx-auto font-medium">{errMsg}</p>
        ) : null}
      </form>
    </div>
  );
}
