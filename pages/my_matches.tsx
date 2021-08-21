import SubscriptionNeeded from "../components/SubscriptionNeeded";
import Head from "next/head";
import useLikedFonts from "../hooks/useLikedFonts";
import Loading from "../components/Loading";
import { deleteLikedFont } from "../lib/utils";
import ButtonLoading from "../components/ButtonLoading";
import { useState } from "react";
import useUser from "../hooks/useUser";
function Matches() {
  const { user } = useUser();
  const { likedFonts, error, isLoading, refetch } = useLikedFonts();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const deleteLiked = async (matchId: string) => {
    setIsProcessing(true);
    try {
      await deleteLikedFont(matchId);
      refetch();
    } catch (error) {
      setErrorMsg("Error deleting the match, please try again");
    }
    setIsProcessing(false);
  };
  if (user.role === "Guest") return <SubscriptionNeeded />;
  if (isLoading)
    return (
      <div className="container-full">
        <div className="container-full-inner">
          <Loading>{}</Loading>
        </div>
      </div>
    );
  return (
    <div>
      <Head>
        {likedFonts?.map((match) =>
          match.fonts_ids.map((fontObj) => (
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css?family=${fontObj.family}`}
            />
          ))
        )}
      </Head>
      {likedFonts.map((match) => (
        <div className="card-container relative">
          {match.fonts_ids.map((fontObj) => (
            <p style={{ fontFamily: fontObj.family }}>{fontObj.family}</p>
          ))}
          {errorMsg ? <p className="error-msg">{errorMsg}</p> : null}
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2"
            onClick={() => deleteLiked(match._id)}
          >
            {isProcessing ? (
              <ButtonLoading />
            ) : (
              <i className="fas fa-times"></i>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Matches;
