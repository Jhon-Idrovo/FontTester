import axios from "axios";
import { IGoogleFont } from "../hooks/useGoogleFonts";
export declare interface IFetchOptions {
  body?: {};
  method: "GET" | "POST" | "PUT" | "PATCH";
}
//fetch from server
/**
 * Uses a new firebase token as Authorization header on each request.
 * token!=uid but token.uid is valid
 * @param {string} endpointURL starting with /
 * @param {object} opts body:{}
 * @returns a promise that resolves to the data fetched (if any)
 */
export async function fetchFromAPI(endpointURL: string, opts: IFetchOptions) {
  const { body, method } = opts;
  //const API = "https://find-a-font-api.herokuapp.com";
  const API = "http://localhost:8000";

  const res = await axios.request({
    method: method ? method : "POST",
    url: `${API}${endpointURL}`,
    data: body ? { ...body } : {},
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export function blacklistFont(font: IGoogleFont) {}
export function saveLikedFonts(fonts: IGoogleFont["family"][][]) {}
