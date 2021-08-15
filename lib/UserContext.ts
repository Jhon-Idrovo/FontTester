import { createContext, Dispatch, SetStateAction } from "react";
import { IUser } from "./interfaces";
export const defaultUser: IUser = {
  _id: "",
  email: "",
  name: "",
  roles: ["Guest"],
};
//use this initial state to avoid using |null and get typecheking
//whithout verifying for null values
export const UserContext = createContext<{
  user: IUser;
  setUser: Dispatch<SetStateAction<IUser>>;
}>({ user: defaultUser, setUser: () => false });
