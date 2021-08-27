import { useQuery } from "react-query";
import axiosInstance from "../lib/axios";
import { IGoogleFont } from "../lib/interfaces";
import useUser from "./useUser";

const useLikedFonts = () => {
  const { user } = useUser();
  const { data, error, isLoading, isFetching, refetch } = useQuery(
    "liked_fonts",
    () => axiosInstance.get("/fonts/liked").then((res) => res.data.likedFonts),
    { enabled: user.role === "User" }
  );
  const likedFonts: [
    { fonts_ids: IGoogleFont[]; user_id: string; _id: string }
  ] = data;
  return {
    likedFonts,
    error,
    isLoading,
    isFetching,
    refetch,
  };
};

export default useLikedFonts;
