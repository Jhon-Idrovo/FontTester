import { MouseEvent as ReactMouseEvent, useState } from "react";
import ButtonLoading from "../components/ButtonLoading";
import Loading from "../components/Loading";
import useDislikedFonts from "../hooks/useDislikedFonts";
import { deleteDisliked } from "../lib/utils";

function Disliked() {
  const {
    fonts,
    error,
    isLoading: isLoadingDislikedFonts,
    refetch,
  } = useDislikedFonts();
  const [processingFonts, setProcessingFonts] = useState<string[]>([]);
  const handleDeleteDisliked = async (
    e: ReactMouseEvent<HTMLButtonElement, MouseEvent>,
    font_userId: string
  ) => {
    setProcessingFonts((prev) => [...prev, font_userId]);
    try {
      await deleteDisliked(font_userId);
      refetch();
    } catch (error) {
      console.log(error);
    }
    setProcessingFonts((prev) => {
      prev.splice(prev.indexOf(font_userId), 1);
      return [...prev];
    });
  };
  if (isLoadingDislikedFonts)
    return (
      <div className="container-full">
        <div className="container-full-inner">
          <Loading>{}</Loading>
        </div>
      </div>
    );
  return (
    <>
      {fonts.map((font_user) => (
        <div className="card-container relative" key={font_user._id}>
          <p className="" style={{ fontFamily: font_user.font_id.family }}>
            {font_user.font_id.family}
          </p>
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2"
            onClick={(e) => handleDeleteDisliked(e, font_user._id)}
          >
            {processingFonts.includes(font_user._id) ? (
              <ButtonLoading />
            ) : (
              <i className="fas fa-times"></i>
            )}
          </button>
        </div>
      ))}
    </>
  );
}

export default Disliked;