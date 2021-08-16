import { IGoogleFont } from "../hooks/useGoogleFonts";
import axiosInstance from "./axios";
export declare interface IFetchOptions {
  body?: {};
  method: "GET" | "POST" | "PUT" | "PATCH";
}
//fetch from server
/**
 *Uses the axios instance with the request token (if existent)
 * @param {string} endpointURL starting with /
 * @param {object} opts body:{}
 * @returns a promise that resolves to the data fetched (if any)
 */
export async function fetchFromAPI(endpointURL: string, opts: IFetchOptions) {
  const { body, method } = opts;
  console.log(body, method);
  let data;
  try {
    const res = await axiosInstance.request({
      method: method ? method : "POST",
      url: endpointURL,
      data: body ? body : {},
    });

    return res.data;
  } catch (error) {
    console.log(error);

    return alert(error);
  }
}

export function blacklistFont(font: IGoogleFont) {}
export function saveLikedFonts(fonts: IGoogleFont["family"][][]) {}
