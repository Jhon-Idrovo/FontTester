import Stripe from "stripe";
import { useQuery } from "react-query";
import axiosInstance from "../lib/axios";
import Loading from "../components/Loading";

function Subscription() {
  const {
    data: subscriptions,
    isLoading,
    isFetching,
    error,
  } = useQuery("subscription", async () => {
    return axiosInstance.get("/subscriptions").then((res) => res.data);
  });
  if (isLoading || isFetching) return <Loading>{}</Loading>;
  console.log(subscriptions);

  return (
    <div>
      {subscriptions.data.map((subscription: Stripe.Subscription) => (
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
          <div className="flex justify-center items-center my-4">
            <button className="btn px-2 mr-2">Change</button>
            <button className="btn-red px-2 ml-2">Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Subscription;
