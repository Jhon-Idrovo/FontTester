import PayPal from "../components/PayPal";
import useUser from "../hooks/useUser";
import { CreditIcon } from "../lib/utils";

const offers: { price: string; credits: number; name: string }[] = [
  { price: "5.10", credits: 5, name: "Basic" },
  { price: "8.90", credits: 10, name: "Normal" },
  { price: "10.00", credits: 20, name: "Supreme" },
];
function Credits() {
  const { user } = useUser();

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
          <div className="flex flex-col justify-center items-center bg-secondary text-txt-secondary p-2 m-4">
            <h2 className="text font-semibold text-xl">{name}</h2>
            <h1>
              {credits} {CreditIcon}{" "}
            </h1>
            <s className="text-alert line-through">
              ${parseFloat(price) * 1.25}
            </s>
            <p className="">${price}</p>
            <PayPal price={price} credits={credits} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credits;
