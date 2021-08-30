import { AxiosError } from "axios";
import { useQuery } from "react-query";
import Stripe from "stripe";
import axiosInstance from "../lib/axios";
import { IPlan } from "../lib/interfaces";

/**
 *
 * @returns list of price objects
 */
function usePlans() {
  const { data, error, isLoading, isFetching } = useQuery(
    "prices",
    () => axiosInstance.get("/subscriptions/plans").then((res) => res.data),
    { refetchOnWindowFocus: false }
  );
  console.log(data);

  return {
    plans: data ? (data.plans as IPlan[]) : [],
    plansError: error as AxiosError,
    isLoadingPlans: isLoading || isFetching,
  };
}

export default usePlans;
