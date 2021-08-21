import { AxiosError } from "axios";
import { useQuery } from "react-query";
import axiosInstance from "../lib/axios";
import { IGoogleFont } from "../lib/interfaces";

const useLikedFonts = () => {
  const { data, error, isLoading, isFetching, refetch } = useQuery(
    "liked_fonts",
    () => axiosInstance.get("/fonts/liked").then((res) => res.data.likedFonts)
  );
  const likedFonts: [
    { fonts_ids: IGoogleFont[]; user_id: string; _id: string }
  ] = data;
  return {
    likedFonts,
    error,
    isLoading: isLoading || isFetching,
    refetch,
  };
};

export default useLikedFonts;
