import { useState } from "react";
import PayPal from "../components/PayPal";
import useUser from "../hooks/useUser";
import { CreditIcon } from "../lib/utils";
type Plan = { price: string; credits: number; name: string };
const offers: Plan[] = [
  { price: "5.10", credits: 5, name: "Basic" },
  { price: "8.90", credits: 10, name: "Normal" },
  { price: "10.00", credits: 20, name: "Supreme" },
];
function Credits() {
  const { user } = useUser();
  const [plan, setPlan] = useState<Plan["price"]>("8.90");
  return (
    <div>
      <h2 className="text-txt-base font-semibold text-2xl flex m-4">
        Credits: <p className="font-normal ml-2">{user.credits}</p> {CreditIcon}
      </h2>
      <h1 className="text-txt-base font-semibold text-3xl mx-auto w-min whitespace-nowrap">
        Get More Credits
      </h1>
      <div className="grid grid-cols-3">
        {offers.map(({ name, price, credits }) => (
          <div
            className={`flex flex-col justify-center items-center bg-secondary text-txt-secondary p-2 m-4 border-primary ${
              price === plan ? "border-2" : ""
            }`}
            onClick={() => setPlan(price)}
          >
            <h2 className="text font-semibold text-xl">{name}</h2>
            <h1>
              {credits} {CreditIcon}{" "}
            </h1>
            <s className="text-alert line-through">
              ${parseFloat(price) * 1.25}
            </s>
            <p className="">${price}</p>
            {plan === price ? <PayPal price={price} credits={credits} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credits;
