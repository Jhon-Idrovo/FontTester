import axiosInstance from "./axios";
import { IGoogleFont, JwtAccesPayload } from "./interfaces";
export function decodeJWT(token: string) {
  const tokenParts: JwtAccesPayload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  return tokenParts;
}

export function blacklistFont(font: IGoogleFont) {}
export async function saveLikedFonts(fonts: IGoogleFont[][]) {
  return await axiosInstance.post("/fonts/save", { likedFonts: fonts });
}
/**
 *
 * @param match_id Id of the Fonts_User_Liked record
 */
export async function deleteLikedFont(match_id: string) {
  return axiosInstance.delete("/fonts/delete_liked/" + match_id);
}
