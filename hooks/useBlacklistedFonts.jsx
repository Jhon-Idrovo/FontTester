import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchFromAPI } from "../lib/utils";
import useUser from "./useUser";
/**
 *
 * @returns If possible, a list of blacklisted font family names. If not, an empty array.
 */
const useBlacklistedFonts = () => {
  const { user, isLoadingUser } = useUser();
  //fetch the blacklisted fonts only when there is a user
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
    { enabled: Boolean(user) }
  );

  return user
    ? { error, isLoading, fonts }
    : { error: false, isLoading: false, fonts: [] };
};

export default useBlacklistedFonts;
