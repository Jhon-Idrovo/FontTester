import { useRouter } from "next/router";
import { PayPalButton } from "react-paypal-button-v2";
import useUser from "../hooks/useUser";
import axiosInstance from "../lib/axios";
/**
 * This component is in charge of displaying all the information for PayPal checkout
 * @param param0
 * @returns
 */
function PayPal({ planId }) {
  const router = useRouter();
  const {  setUser } = useUser();
  const createSubscription = (data, actions) => {
    console.log(data);
    
    return actions.subscription.create({
      plan_id: planId,
    });
  };
  const onApprove = (data, actions) => {
    // Capture the funds from the transaction
    console.log(data);
    return actions.subscription.get().then(function (details) {
      // Save the data on the db
      axiosInstance.post("/subscriptions/attach", {
        subscriptionId: details.id,
      });
      // Show a success message to your buyer
      alert("Subscription completed");
      // Handle user state update
      localStorage.removeItem("ss");
      setUser((prev) => ({ ...prev, role: "User" }));
      router.push("/");
    });
  };

  return (
    <PayPalButton
      createSubscription={createSubscription}
      onApprove={onApprove}
      options={{
        clientId:
          "ATiEgOT6RsR2dIUzAM4Jg8bbKovztcESnlY_u67t7u2TWQG3hAVes_r4X63S6kbqljhhNtlrK1vtSQzX",
        currency: "USD",
        vault: true,
        intent: "subscription",
      }}
    />
  );
}

export default PayPal;

// const orderData = res.data;
// // Three cases to handle:
// //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
// //   (2) Other non-recoverable errors -> Show a failure message
// //   (3) Successful transaction -> Show confirmation or thank you

// // This example reads a v2/checkout/orders capture response, propagated from the server
// // You could use a different API or structure for your 'orderData'
// var errorDetail = Array.isArray(orderData.details) && orderData.details[0];

// if (errorDetail && errorDetail.issue === "INSTRUMENT_DECLINED") {
//   return actions.restart(); // Recoverable state, per:
//   // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
// }

// if (errorDetail) {
//   var msg = "Sorry, your transaction could not be processed.";
//   if (errorDetail.description) msg += "\n\n" + errorDetail.description;
//   if (orderData.debug_id) msg += " (" + orderData.debug_id + ")";
//   return alert(msg); // Show a failure message (try to avoid alerts in production environments)
// }

// // Successful capture! For demo purposes:
// console.log(
//   "Capture result",
//   orderData,
//   JSON.stringify(orderData, null, 2)
// );
// var transaction = orderData.purchase_units[0].payments.captures[0];
// alert(
//   "Transaction " +
//     transaction.status +
//     ": " +
//     transaction.id +
//     "\n\nSee console for all available details"
// );

// // Replace the above to show a success message within this page, e.g.
// // const element = document.getElementById('paypal-button-container');
// // element.innerHTML = '';
// // element.innerHTML = '<h3>Thank you for your payment!</h3>';
// // Or go to another URL:  actions.redirect('thank_you.html');
