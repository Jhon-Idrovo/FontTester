import { createContext, Dispatch, SetStateAction } from "react";
import { IUser } from "./interfaces";
export const defaultUser: IUser = {
  _id: "",
  email: "",
  name: "",
  roles: ["Guest"],
};
export const UserContext = createContext<{
  user: IUser;
  setUser: Dispatch<SetStateAction<IUser>>;
} | null>(null);
