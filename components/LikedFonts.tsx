import useUser from "../hooks/useUser";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";
import { saveLikedFonts } from "../lib/utils";
import { IGoogleFont } from "../lib/interfaces";
import ButtonLoading from "./ButtonLoading";

function LikedFonts({
  fonts,
  goBack,
  handleRemoveFont,
}: {
  fonts: IGoogleFont[][];
  goBack: MouseEventHandler;
  handleRemoveFont: Function;
}) {
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const handleSaveFonts = async () => {
    setErrorMsg(""); //resesting
    setIsProcessing(true);
    try {
      await saveLikedFonts(fonts);
    } catch (error) {
      setErrorMsg("Unable to save the fonts on this moment, please try again.");
    }
    setIsProcessing(false);
  };
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
        <div className="card-container relative">
          {fontsSet.map((font) => (
            <p
              className="text-txt-base px-4"
              style={{ fontFamily: font.family }}
            >
              {font.family}
            </p>
          ))}
          <button
            onClick={() => handleRemoveFont(index)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-txt-base"
          >
            <i className="fa fas-times"></i>
          </button>
        </div>
      ))}

      {user.role === "User" ? (
        <>
          {errorMsg ? <p className="error-msg">{errorMsg}</p> : null}
          <button
            onClick={handleSaveFonts}
            className="btn block mt-8 px-4 w-max mx-auto"
          >
            {isProcessing ? <ButtonLoading /> : null}
            Save
          </button>
        </>
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
    function listenClickOutside(e: MouseEvent) {
      if ((e.currentTarget as HTMLElement)?.id !== "tooltip") {
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
          <Link href="/signup">
            <a className="link">Get one here!</a>
          </Link>
        </span>
      ) : null}
    </button>
  );
}
