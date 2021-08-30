import Stripe from "stripe";
import axiosInstance from "../lib/axios";
import Loading from "../components/Loading";
import { useState } from "react";
import { AxiosError } from "axios";
import ButtonLoading from "../components/ButtonLoading";
import useUser from "../hooks/useUser";
import Link from "next/link";
import PlansShowcase from "../components/PlansShowcase";
import useUserSubscriptions from "../hooks/useUserSubscriptions";

function Subscription() {
  const [isShowingConfirmation, setIsShowingConfirmation] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [planOnSelection, setPlanOnSelection] = useState(""); // Plan's id
  const [isProcessing, setIsProcessing] = useState<"change" | "cancel" | "">(
    ""
  );
  const [isShowingSuccess, setIsShowingSuccess] = useState<
    "change" | "cancel" | ""
  >("");
  const [priceId, setPriceId] = useState("");
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const { setUser } = useUser();
  const { subscriptions, isLoadingSubscriptions } = useUserSubscriptions();

  const cancelSubscription = async () => {
    setIsProcessing("cancel");
    try {
      await axiosInstance.post("/subscriptions/cancel", {
        subscriptionId: planOnSelection,
      });

      setUser((prev) => ({ ...prev, role: "Guest" }));
      localStorage.removeItem("ss");
      localStorage.removeItem("rr");
      setIsProcessing("");
      setIsShowingConfirmation(false);
      setIsShowingSuccess("cancel");
    } catch (error) {
      setErrorMsg((error as AxiosError).response?.data.error.message);
    }
  };
  const changeSubscription = async () => {
    setIsProcessing("change");
    try {
      await axiosInstance.post("/subscriptions/update", {
        subscriptionId: planOnSelection,
        priceId,
        itemId: subscriptions.find(
          (subscription) => subscription.id === planOnSelection
        )?.items.data[0].id,
      });
      setIsChangeOpen(false);
      setIsShowingSuccess("change");
    } catch (error) {
      setErrorMsg((error as AxiosError).response?.data.error.message);
    }
    setIsProcessing("");
  };
  if (isLoadingSubscriptions)
    return (
      <div className="container-full">
        <Loading>{}</Loading>
      </div>
    );
  if (isShowingConfirmation)
    return (
      <div className="container-full">
        <div className="container-full-inner w-1/2 text-txt-secondary">
          <h2>
            Are you sure you want to cancel the subscription? All your data will
            be deleted inmediately
          </h2>
          <div className="flex justify-center mt-4">
            <button
              className="btn px-2 mr-2"
              onClick={() => setIsShowingConfirmation(false)}
            >
              Stay
            </button>
            <button className="btn-red ml-2 px-2" onClick={cancelSubscription}>
              {isProcessing === "cancel" ? <ButtonLoading /> : null}
              Continue
            </button>
          </div>
        </div>
      </div>
    );

  if (subscriptions.length === 0)
    return (
      <div className="container-full">
        <div className="container-full-inner font-medium">
          You aren't subscribed... Yet. Please go to{" "}
          <Link href="/signup">
            <a className="text-primary ">signup</a>
          </Link>
        </div>
      </div>
    );
  if (isChangeOpen)
    return (
      <div className="container-full">
        <div className="container-full-inner relative">
          <button
            className="absolute top-0 right-1"
            onClick={() => setIsChangeOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
          <PlansShowcase planId={priceId} setPlanId={setPriceId} />
          {errorMsg ? (
            <p className="text-alert font-medium">{errorMsg}</p>
          ) : null}
          <button
            className="btn px-2 mx-auto mt-2 flex justify-center"
            onClick={changeSubscription}
          >
            {isProcessing === "change" ? <ButtonLoading /> : null}Save
          </button>
        </div>
      </div>
    );
  if (isShowingSuccess === "change")
    return (
      <div className="container-full">
        <div className="container-full-inner w-1/3">
          <p>
            Subscription change in process, be aware of any email from us.
            Thanks.
          </p>
          <Link href={"/"}>
            <a className="btn px-2 w-max mx-auto">Go home</a>
          </Link>
        </div>
      </div>
    );
  if (isShowingSuccess === "cancel")
    return (
      <div className="container-full">
        <div className="container-full-inner w-1/3">
          <p>
            Subscription cancel in process, reload the page to see if the
            changes apply. Be aware of any email from us. Thanks.
          </p>
          <Link href={"/"}>
            <a className="btn px-2 w-min mx-auto">Go home</a>
          </Link>
        </div>
      </div>
    );
  return (
    <div>
      {subscriptions.map((subscription: Stripe.Subscription) => (
        <div className="card-container">
          <div className=" text-txt-base grid grid-cols-2 grid-rows-2">
            <div className="subscription-info-item">
              <h2>Billing cycle:</h2>
              <p>{subscription.items.data[0].plan.interval}</p>
            </div>
            <div className="subscription-info-item">
              <h2>Amount:</h2>
              <p>
                $
                {subscription.items.data[0].plan.amount
                  ? subscription.items.data[0].plan.amount / 100
                  : "Unavailable"}
              </p>
            </div>
            <div className="subscription-info-item">
              <h2>Active:</h2>
              <p>{subscription.items.data[0].plan.active ? "Yes" : "No"}</p>
            </div>
            <div className="subscription-info-item">
              <h2>Next payment date:</h2>
              <p>
                {new Date(
                  subscription.current_period_end * 1000
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
          {errorMsg ? <p className="text-alert">{errorMsg}</p> : null}
          <div className="flex justify-center items-center my-4">
            <button
              className="btn px-2 mr-2"
              onClick={() => {
                setIsChangeOpen(true);
                setPlanOnSelection(subscription.id);
                setPriceId(subscription.items.data[0].price.id);
              }}
            >
              Change Plan
            </button>
            <button
              className="btn-red px-2 ml-2"
              onClick={() => {
                setIsShowingConfirmation(true);
                setPlanOnSelection(subscription.id);
              }}
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Subscription;
