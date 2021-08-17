import { IGoogleFont } from "../hooks/useGoogleFonts";
import axiosInstance from "./axios";
import { JwtAccesPayload } from "./interfaces";
export function decodeJWT(token: string) {
  const tokenParts: JwtAccesPayload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  console.log(tokenParts);
  return tokenParts;
}

export function blacklistFont(font: IGoogleFont) {}
export function saveLikedFonts(fonts: IGoogleFont["family"][][]) {}
