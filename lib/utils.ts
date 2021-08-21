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
