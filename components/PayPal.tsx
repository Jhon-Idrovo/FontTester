import { PayPalButton } from "react-paypal-button-v2";
import useUser from "../hooks/useUser";
import axiosInstance from "../lib/axios";
/**
 * This component is in charge of displaying all the information for PayPal checkout
 * @param param0
 * @returns
 */
function PayPal({ price, credits }) {
  const { setUser } = useUser();
  const onSuccess = (details, data) => {
    console.log(details, data);
    axiosInstance
      .post("/credits", { credits })
      .then(() => {
        setUser((prev) => ({ ...prev, credits: prev.credits + credits }));
      })
      .catch((res) => alert(res.response.error.message));
  };

  return (
    <PayPalButton
      amount={price}
      shippingPreference="NO_SHIPPING"
      onSuccess={onSuccess}
      options={{
        // on production use AVW-LTc1SYjxqfax3idggkgXGx6LK9J_SieNZMPPZxhQZp1TM3nfsIq893juRmKTMLNNBDjq_bxO9wII
        clientId:
          // Production
          //"AVW-LTc1SYjxqfax3idggkgXGx6LK9J_SieNZMPPZxhQZp1TM3nfsIq893juRmKTMLNNBDjq_bxO9wII",
          // Development
          "ATiEgOT6RsR2dIUzAM4Jg8bbKovztcESnlY_u67t7u2TWQG3hAVes_r4X63S6kbqljhhNtlrK1vtSQzX",
        currency: "USD",
      }}
    />
  );
}

export default PayPal;
