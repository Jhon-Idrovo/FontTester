import { useQuery } from "react-query";
import Stripe from "stripe";
import axiosInstance from "../lib/axios";

/**
 *
 * @returns list of price objects
 */
function useSubsPrices() {
  const { data, error, isLoading, isFetching } = useQuery("prices", () =>
    axiosInstance.get("/subscriptions/prices").then((res) => res.data)
  );
  console.log(data);

  return {
    prices: data
      ? (data.prices.data as Stripe.Price[])
      : ([] as Stripe.Price[]),
    pricesError: error,
    isLoadingPrices: isLoading || isFetching,
  };
}

export default useSubsPrices;
