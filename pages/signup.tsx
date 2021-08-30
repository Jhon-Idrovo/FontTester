import React, { useState } from "react";
import useUser from "../hooks/useUser";
import SignUpForm from "../components/SignUpForm";
import ThirdPartySignIn from "../components/ThirdPartySignIn";
import PayPal from "../components/PayPal";
import PlansShowcase from "../components/PlansShowcase";
const texts = [
  {
    t: "Collections",
    d: "Save your time by storing the fonts that you love to easily access them later without going througth the selection process again.",
  },
  {
    t: "Most Liked",
    d: "Get inspiration seeing what are the fonts that other designers like the most",
  },
  {
    t: "Exluded Fonts",
    d: "Exlude the fonts that you really don’t like from appearing again. This will be applied to every furure font test. You can remove a font from this exclusion list anytime.",
  },
];
function SignUp() {
  const { user } = useUser();
  const [planId, setPlanId] = useState("");
  return (
    <div>
      <h1 className="text-txt-base w-max mx-auto mt-8 font-semibold text-3xl">
        UNLOCK A POWERFUL SET OF FUNCTIONALITIES
      </h1>
      <div className="grid grid-cols-3 mt-2">
        {texts.map((f, index) => (
          <FunctionalityShowcase {...f} key={index} />
        ))}
      </div>
      <div className="grid grid-cols-2 my-12">
        <div className="signup-proccess-section">
          <div className="rounded-full w-8 h-8 mx-auto grid place-items-center bg-primary text-txt-primary">
            1
          </div>
          <p className="text-2xl	">
            Create an account or sign in with you prefered account
          </p>
          {user._id ? (
            <div className="flex items-center justify-center w-full h-2/3">
              <i className="fas fa-check  text-5xl"></i>
            </div>
          ) : (
            <>
              <ThirdPartySignIn />
              <hr className="my-2" />
              <SignUpForm />
            </>
          )}
        </div>
        <div className="signup-proccess-section">
          <div className="rounded-full w-8 h-8 mx-auto grid place-items-center bg-primary text-txt-primary">
            2
          </div>
          <p className="text-2xl	">Choose your plan</p>
          <PlansShowcase planId={planId} setPlanId={setPlanId} />
          {!user._id ? (
            <div className="text-alert">Please create a user to continue</div>
          ) : null}
          {!planId ? (
            <div className="text-alert">Please select a plan to continue</div>
          ) : null}
          {user._id && planId ? <PayPal planId={planId} /> : null}
        </div>
      </div>
    </div>
  );
}

export default SignUp;

function FunctionalityShowcase({ t, d }: { t: string; d: string }) {
  return (
    <div className="bg-secondary mx-6 p-2">
      <h4 className="w-max mx-auto text-xl font-medium text-txt-secondary">
        {t}
      </h4>
      <p className="text-txt-secondary font-light ">{d}</p>
    </div>
  );
}
