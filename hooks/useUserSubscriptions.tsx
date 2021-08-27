import { AxiosError } from "axios";
import { useQuery } from "react-query";
import Stripe from "stripe";
import axiosInstance from "../lib/axios";
import useUser from "./useUser";

const useUserSubscriptions = () => {
  const { user } = useUser();
  const {
    data: subscriptions,
    isLoading,
    isFetching,
    error,
  } = useQuery(
    "subscription",
    async () => {
      return axiosInstance.get("/subscriptions").then((res) => res.data.data);
    },
    { enabled: user.role === "User" }
  );
  return {
    subscriptions,
    isLoadingSubscriptions: isLoading || isFetching,
    error,
  } as {
    subscriptions: Stripe.Subscription[];
    error: AxiosError;
    isLoadingSubscriptions: boolean;
  };
};

export default useUserSubscriptions;
