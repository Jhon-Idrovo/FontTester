import { saveLikedFonts } from "../lib/firebaseUser";
import useUser from "../hooks/useUser";
import Link from "next/link";
import { useEffect, useState } from "react";

function LikedFonts({ fonts, goBack, handleRemoveFont }) {
  const { user } = useUser();
  console.log(fonts);
  if (fonts.length === 0) {
    return (
      <div className="text-txt-base text-center">
        You have't liked any font.. yet
        <button className="btn px-2 py-1 block mx-auto " onClick={goBack}>
          Go for it!
        </button>
      </div>
    );
  }
  return (
    <div>
      {fonts.map((fontsSet, index) => (
        <div className="border-b-2 border-secondary relative">
          {fontsSet.map((font) => (
            <p className="text-txt-base px-4" style={{ fontFamily: font }}>
              {font}
            </p>
          ))}
          <button
            onClick={() => handleRemoveFont(index)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-txt-base"
          >
            X
          </button>
        </div>
      ))}

      {(user != null) & (user.subscriptionType === "PRO") ? (
        <button
          onClick={() => saveLikedFonts(fonts, user.id)}
          className="btn block mt-8 px-4 w-max mx-auto"
        >
          Save
        </button>
      ) : (
        <DisabledBtn />
      )}
      <button className="btn p-2 fixed bottom-6 left-6" onClick={goBack}>
        Back
      </button>
    </div>
  );
}

export default LikedFonts;

function DisabledBtn() {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  useEffect(() => {
    function listenClickOutside(e) {
      if (e.currentTarget.id !== "tooltip") {
        setIsTooltipOpen(false);
      }
    }
    document.addEventListener("click", listenClickOutside);
    return () => {
      document.removeEventListener("click", listenClickOutside);
    };
  }, []);
  return (
    <button
      className="btn block mt-8 px-4 w-max mx-auto relative"
      onMouseOver={() => setIsTooltipOpen(true)}
      id="tooltip"
    >
      Save
      {isTooltipOpen ? (
        <span className="tooltip ">
          You need a subscription to unlock this special feature.{" "}
          <Link href="/sign-up">
            <a>Get one here!</a>
          </Link>
        </span>
      ) : null}
    </button>
  );
}
