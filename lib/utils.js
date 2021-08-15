import { auth } from "../lib/firebase";
import axios from "axios";

//fetch from server
/**
 * Uses a new firebase token as Authorization header on each request.
 * token!=uid but token.uid is valid
 * @param {string} endpointURL starting with /
 * @param {object} opts body:{}
 * @returns a promise that resolves to the data fetched (if any)
 */
export async function fetchFromAPI(endpointURL, opts) {
  const { body, method } = opts;
  //const API = "https://find-a-font-api.herokuapp.com";
  const API = "http://localhost:3333";
  const user = auth.currentUser;
  //the token's expiration time is short so we need to generate
  //a new one after each request
  const token = user ? await user.getIdToken() : "";
  console.log("request roken", token);
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
