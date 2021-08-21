import { Dispatch, SetStateAction } from "react";
import useSubsPrices from "../hooks/useSubsPrices";
import Loading from "./Loading";

export default function PlansShowcase({
  setPriceId,
  priceId,
}: {
  setPriceId: Dispatch<SetStateAction<string>>;
  priceId: string;
}) {
  const { prices, pricesError, isLoadingPrices } = useSubsPrices();
  if (isLoadingPrices) return <Loading>{}</Loading>;
  return (
    <div className="flex justify-center">
      {pricesError ? (
        <p>An error happened while retrieving the data</p>
      ) : (
        prices.map((priceObj) => (
          <button
            key={priceObj.id}
            className={`border-2 p-2 outline-none ${
              priceId === priceObj.id
                ? "border-primary"
                : "border-txt-secondary"
            }`}
            onClick={() => setPriceId(priceObj.id)}
          >
            <h1 className="font-semibold text-2xl">
              Charge per {priceObj.recurring?.interval}
            </h1>
            <p>Normal price</p>
            <p className="line-through font-thin text-opacity-50">
              {priceObj.unit_amount
                ? "$" + (priceObj.unit_amount / 100) * 1.75
                : "Price not found"}
            </p>
            <p>Launching price</p>
            <p className="font-thin">
              {priceObj.unit_amount
                ? "$" + priceObj.unit_amount / 100
                : "Price not found"}
            </p>
          </button>
        ))
      )}
    </div>
  );
}
