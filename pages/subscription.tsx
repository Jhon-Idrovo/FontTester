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
  const [isProcessing, setIsProcessing] = useState<"change" | "cancel" | "">(
    ""
  );
  const [confirmationLink, setConfirmationLink] = useState("");
  const [isShowingSuccess, setIsShowingSuccess] = useState<
    "change" | "cancel" | ""
  >("");
  const [planId, setPlanId] = useState("");
  const [isChangeOpen, setIsChangeOpen] = useState(false);
  const { setUser } = useUser();
  const { subscription, isLoadingSubscriptions } = useUserSubscriptions();

  const cancelSubscription = async () => {
    setIsProcessing("cancel");
    try {
      await axiosInstance.post("/subscriptions/cancel", {
        subscriptionId: planId,
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
      const r = await axiosInstance.post("/subscriptions/update", {
        subscriptionId: subscription.id,
        newPlanId: planId,
      });
      setIsChangeOpen(false);
      setConfirmationLink(r.data.activationLink);
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

  if (!subscription)
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
          <PlansShowcase planId={planId} setPlanId={setPlanId} />
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
            Please click{" "}
            <Link href={confirmationLink}>
              <a className="btn px-2 w-max mx-auto"> here</a>
            </Link>{" "}
            to confirm your change in PayPal
          </p>
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
      <div className="card-container">
        <div className=" text-txt-base grid grid-cols-2 grid-rows-2">
          <div className="subscription-info-item">
            <h2>Billing cycle:</h2>
            <p>{subscription.billingCycle}</p>
          </div>
          <div className="subscription-info-item">
            <h2>Amount:</h2>
            <p>${subscription.price ? subscription.price : "Unavailable"}</p>
          </div>
          <div className="subscription-info-item">
            <h2>Susbscription Status:</h2>
            <p>{subscription.status}</p>
          </div>
          <div className="subscription-info-item">
            <h2>Next payment date:</h2>
            <p>{subscription.nextBillingDate}</p>
          </div>
        </div>
        {errorMsg ? <p className="text-alert">{errorMsg}</p> : null}
        <div className="flex justify-center items-center my-4">
          <button
            className="btn px-2 mr-2"
            onClick={() => {
              setIsChangeOpen(true);
              setPlanId(subscription.planId);
            }}
          >
            Change Plan
          </button>
          <button
            className="btn-red px-2 ml-2"
            onClick={() => {
              setIsShowingConfirmation(true);
            }}
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
