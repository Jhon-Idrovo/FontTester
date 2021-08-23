import axiosInstance from "./axios";
import { IGoogleFont, JwtAccesPayload } from "./interfaces";
export function decodeJWT(token: string) {
  const tokenParts: JwtAccesPayload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  return tokenParts;
}

export async function blacklistFont(font: IGoogleFont) {
  try {
    await axiosInstance.post("/fonts/save-disliked", { dislikedFont: font });
    return;
  } catch (error) {
    console.error(error);
    return;
  }
}
export async function saveLikedFonts(fonts: IGoogleFont[][]) {
  return await axiosInstance.post("/fonts/save-liked", { likedFonts: fonts });
}
/**
 *
 * @param match_id Id of the Fonts_User_Liked record
 */
export async function deleteLikedFont(match_id: string) {
  return axiosInstance.delete("/fonts/delete-liked/" + match_id);
}

export async function deleteDisliked(font_userId: string) {
  return axiosInstance.delete("/fonts/delete-disliked/" + font_userId);
}
