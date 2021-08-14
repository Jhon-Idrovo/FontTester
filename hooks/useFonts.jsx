import { useQuery } from "react-query";
import axios from "axios";

function useFonts() {
  //All fonts
  const GoogleFontsAPIKey = "AIzaSyBURN0QbZlqbqoUPbIKdRhcDkH_Xz2taAs";
  async function fetchFontsList() {
    const res = await axios.get(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${GoogleFontsAPIKey}`
    );
    if (res.status === 200) {
      return res.data.items;
    } else {
      throw Error("Something went wring while fetching the fonts");
    }
  }
  const {
    data: fonts,
    error,
    isLoading: isLoadingFonts,
  } = useQuery("fonts", fetchFontsList);

  return { fonts, error, isLoadingFonts };
}

export default useFonts;
