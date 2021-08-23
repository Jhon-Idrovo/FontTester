import { QueryObserverResult, RefetchOptions, useQuery } from "react-query";
import useUser from "./useUser";
import axiosInstance from "../lib/axios";
import { IGoogleFont } from "../lib/interfaces";
type returnObj = {
  error: Error | null;
  isLoading: boolean;
  isFetching: boolean;
  fonts: { _id: string; user_id: string; font_id: IGoogleFont }[] | [];
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, unknown>> | null;
};
/**
 *
 * @returns If there is a user wiht a role diffferent from "Guest",
 * returns a list of blacklisted font family names. If not, an empty array.
 */
const useDislikedFonts = () => {
  const { user } = useUser();
  const {
    error,
    isLoading,
    isFetching,
    data: fonts,
    refetch,
  } = useQuery(
    ["disliked"],
    () =>
      axiosInstance
        .get("/fonts/disliked")
        .then((res) => res.data.dislikedFonts),
    {
      enabled: true,
      // refetchOnMount,
      refetchOnWindowFocus: false,
    }
  );
  console.log(fonts);

  return {
    error,
    isLoading,
    isFetching,
    fonts,
    refetch,
  } as returnObj;
};

export default useDislikedFonts;
