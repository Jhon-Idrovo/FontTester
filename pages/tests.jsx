import Checkout from "../components/Checkout";
import { useEffect, useState } from "react";
import SingIn from "../components/SingIn";
import axios from "axios";
import { db, auth } from "../lib/firebase";
import { fetchFromAPI } from "../lib/utils";
import Loading from "../components/Loading";
import useUser from "../hooks/useUser";

//elements
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { saveLikedFonts } from "../lib/firebaseUser";
const likedFonts = [["ABeeZee", "ABeeZee"]];
function Tests() {
  const { user } = useUser();
  return (
    <div className="h-screen">
      {user ? (
        <button onClick={() => saveLikedFonts(likedFonts, user.uid)}>
          Save
        </button>
      ) : null}
    </div>
  );
}

export default Tests;

function PlanSelectionV2({ user }) {
  //const user = useUser()
  const [priceId, setPriceId] = useState();
  const elemets = useElements();
  const stripe = useStripe();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const card = elemets.getElement(CardElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log(error);
      return;
    } else {
      const { latest_invoice } = await fetchFromAPI("subscription/create", {
        body: { priceId, paymentMethod: paymentMethod.id },
      });

      //the subscription contains the invoice with the payment intent that tells if the payment has been made
      //if the invoice's payment succeeded then we don't need to do anything
      //otherwise, confirmation is needed
      if (latest_invoice.payment_intent) {
        const { client_secret, status } = latest_invoice.payment_intent;
        //if 3d verification is needed
        if (
          status === "requires_action" ||
          status === "requires_confirmation"
        ) {
          const { error: confirmationError } = await stripe.confirmCardPayment(
            client_secret
          );
          if (confirmationError) {
            console.log(
              "An error happened trying to confirm the card payment:",
              confirmationError
            );
          } else {
            //success
            alert("You are subscribed");
          }
        }
      }
    }
  };

  return (
    <div>
      <h1>Select an option</h1>
      <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOSVCF6AJi")}>
        Mensual
      </button>
      <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOMOYdWrWV")}>
        Anually
      </button>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button>Pay</button>
      </form>
    </div>
  );
}

// function userData({ user }) {
//   //USER HANDLING
//   const [userData, setUserData] = useState({});

//   useEffect(() => {
//     function unsubscribe() {
//       const userInfo = db
//         .collection("users")
//         .doc(user.uid)
//         .onSnapshot((doc) => setUserData(doc.data()));
//       //what happens when the user does not have this record?
//       const userMembership = db
//         .collection("users")
//         .doc(user.uid)
//         .collection("private")
//         .doc("subscription")
//         .onSnapshot((doc) =>
//           setUserData((prev) => ({ ...prev, ...doc.data() }))
//         );
//       return () => userInfo() && userMembership();
//     }

//     return () => {
//       unsubscribe();
//     };
//   }, []);
//   return (
//     <div>
//       User id: {userData.stripeId}
//       Subscription: {userData.subscriptionType}
//     </div>
//   );
// }

// function PlanSelection({ user = null }) {
//   const [priceId, setPriceId] = useState();
//   const [subscription, setSubscription] = useState();
//   //SUBSCRIPTION FORM
//   const createSubscription = async () => {
//     const subscription = await fetchFromAPI("subscription/create", {
//       body: {
//         priceId,
//       },
//     });
//     console.log(subscription);
//     setSubscription(subscription);
//   };

//   if (!user) {
//     return <div>Please Login first</div>;
//   }
//   return (
//     <div>
//       <h1>Select an option</h1>
//       <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOSVCF6AJi")}>
//         Mensual
//       </button>
//       <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOMOYdWrWV")}>
//         Anually
//       </button>
//       {subscription ? (
//         <CheckoutForm
//           clientSecret={
//             subscription.latest_invoice.payment_intent.client_secret
//           }
//         />
//       ) : (
//         <button onClick={createSubscription}>Create Sub</button>
//       )}
//     </div>
//   );
// }

// function CheckoutForm({ clientSecret }) {
//   const stripe = useStripe();
//   const elements = useElements();

//   const submitPayment = async (e) => {
//     e.preventDefault();
//     if (!elements || !stripe) {
//       //Make sure to disable form submission
//       console.log("Stripe has not loaded yet");
//       return;
//     }
//     //get the card element with the payment information
//     const cardElement = elements.getElement(CardElement);
//     const { error } = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: { card: cardElement, billing_details: { name: "test" } },
//     });
//     error ? console.log(error) : console.log("payment done!");
//   };
//   return (
//     <form onSubmit={submitPayment}>
//       <CardElement />
//       <button>Pay</button>
//     </form>
//   );
// }
