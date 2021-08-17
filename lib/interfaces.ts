export declare type IRole = "Guest" | "User";
export declare interface IUser {
  username: string;
  email: string;
  role: IRole;
  _id: string;
}

export declare interface IText {
  fontIndex: number;
  filters: string[] | number[] | [];
}
export declare interface JwtAccesPayload {
  userID: string;
  role: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}
