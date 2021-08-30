import { Dispatch, SetStateAction } from "react";
import usePlans from "../hooks/usePlans";
import Loading from "./Loading";

export default function PlansShowcase({
  setPlanId,
  planId,
}: {
  setPlanId: Dispatch<SetStateAction<string>>;
  planId: string;
}) {
  const { plans, plansError, isLoadingPlans } = usePlans();
  if (isLoadingPlans) return <Loading>{}</Loading>;
  return (
    <div className="flex justify-center">
      {plansError ? (
        <p>An error happened while retrieving the data</p>
      ) : (
        plans.map((planObj) => (
          <button
            key={planObj.id}
            className={`border-2 p-2 outline-none ${
              planId === planObj.id ? "border-primary" : "border-txt-secondary"
            }`}
            onClick={() => setPlanId(planObj.id)}
          >
            <h1 className="font-semibold text-2xl">{planObj.displayName}</h1>
            <p>Normal price</p>
            <p className="line-through font-thin text-opacity-50">
              {"$" + planObj.price * 1.75}
            </p>
            <p>Launching price</p>
            <p className="font-thin">{"$" + planObj.price}</p>
          </button>
        ))
      )}
    </div>
  );
}
