import { useQuery } from "react-query";
import { fetchFromAPI } from "../lib/utils";
import useUser from "./useUser";
import { IGoogleFont } from "./useGoogleFonts";
type returnObj = {
  error: Error | null;
  isLoading: boolean;
  fonts: IGoogleFont["family"][] | [];
};
/**
 *
 * @returns If there is a user wiht a role diffferent from "Guest",
 * returns a list of blacklisted font family names. If not, an empty array.
 */
const useBlacklistedFonts = () => {
  const { user } = useUser();
  const {
    error,
    isLoading,
    data: fonts,
  } = useQuery(
    ["blacklisted"],
    () =>
      fetchFromAPI("/fonts/blacklisted", { method: "GET" }).then(
        (res) => res.data
      ),
    { enabled: !(user.role === "Guest") }
  );

  return user
    ? ({ error, isLoading, fonts } as returnObj)
    : ({ error: null, isLoading: false, fonts: [] } as returnObj);
};

export default useBlacklistedFonts;
