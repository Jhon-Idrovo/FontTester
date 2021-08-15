import axios from "axios";
import { useQuery } from "react-query";

export declare interface IGoogleFont {
  family: string;
}

/**
 * @returns object containing
 */
const useGoogleFonts = () => {
  const {
    data: googleFonts,
    error: GFError,
    isLoading,
    isFetching,
  } = useQuery("fonts", async function () {
    const GoogleFontsAPIKey = "AIzaSyBURN0QbZlqbqoUPbIKdRhcDkH_Xz2taAs";
    const res = await axios.get(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${GoogleFontsAPIKey}`
    );
    if (res.status === 200) {
      return res.data.items;
    } else {
      throw Error("Something went wring while fetching the fonts");
    }
  });
  return { googleFonts, GFError, isLoadingGF: isLoading || isFetching };
};

export default useGoogleFonts;
