import Stripe from "stripe";
import { useQuery } from "react-query";
import axiosInstance from "../lib/axios";
import Loading from "../components/Loading";
import { useState } from "react";
import { AxiosError } from "axios";
import ButtonLoading from "../components/ButtonLoading";
import useUser from "../hooks/useUser";
import Link from "next/link";
import PlansShowcase from "../components/PlansShowcase";

function Subscription() {
  const [isShowingConfirmation, setIsShowingConfirmation] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [planOnSelection, setPlanOnSelection] = useState(""); // Plan's id
  const [isProcessing, setIsProcessing] = useState<"change" | "cancel" | "">(
    ""
  );
  const [priceId, setPriceId] = useState("");
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const { setUser } = useUser();
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    isFetching: isFetchingSubscriptions,
    error,
  } = useQuery("subscription", async () => {
    return axiosInstance.get("/subscriptions").then((res) => res.data);
  });

  console.log(subscriptions);
  const cancelSubscription = async () => {
    setIsProcessing("cancel");
    await axiosInstance
      .post("/subscriptions/cancel", {
        subscriptionId: planOnSelection,
      })
      .catch((err: AxiosError) =>
        setErrorMsg(err.response?.data.error.message)
      );
    setUser((prev) => ({ ...prev, role: "Guest" }));
    localStorage.removeItem("ss");
    setIsProcessing("");
    setIsShowingConfirmation(false);
  };
  if (isLoadingSubscriptions || isFetchingSubscriptions)
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

  if (subscriptions.data.length === 0)
    return (
      <div className="text-txt-base text-center">
        You aren't subscribed... Yet. Please go to{" "}
        <Link href="/signup">
          <a className="text-primary ">signup</a>
        </Link>
      </div>
    );
  if (isChangeOpen)
    return (
      <div className="container-full">
        <div className="container-full-inner">
          <PlansShowcase priceId={priceId} setPriceId={setPriceId} />
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
            <button className="btn px-2 mr-2">Change Plan</button>
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
