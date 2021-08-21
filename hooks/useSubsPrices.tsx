import { AxiosError } from "axios";
import { useQuery } from "react-query";
import Stripe from "stripe";
import axiosInstance from "../lib/axios";

/**
 *
 * @returns list of price objects
 */
function useSubsPrices() {
  const { data, error, isLoading, isFetching } = useQuery(
    "prices",
    () => axiosInstance.get("/subscriptions/prices").then((res) => res.data),
    { refetchOnWindowFocus: false }
  );
  console.log(data);

  return {
    prices: data
      ? (data.prices.data as Stripe.Price[])
      : ([] as Stripe.Price[]),
    pricesError: error as AxiosError,
    isLoadingPrices: isLoading || isFetching,
  };
}

export default useSubsPrices;
