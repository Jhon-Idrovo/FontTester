import { AxiosError } from "axios";
import { useQuery } from "react-query";
import Stripe from "stripe";
import axiosInstance from "../lib/axios";
import { IResponseSubscription } from "../lib/interfaces";
import useUser from "./useUser";

const useUserSubscriptions = () => {
  const { user } = useUser();
  const {
    data: subscription,
    isLoading,
    isFetching,
    error,
  } = useQuery(
    "subscription",
    () => {
      return axiosInstance
        .get("/subscriptions")
        .then((res) => res.data.subscription);
    },
    { enabled: user.role === "User" }
  );
  return {
    subscription,
    isLoadingSubscriptions: isLoading || isFetching,
    error,
  } as {
    subscription: IResponseSubscription;
    error: AxiosError;
    isLoadingSubscriptions: boolean;
  };
};

export default useUserSubscriptions;
