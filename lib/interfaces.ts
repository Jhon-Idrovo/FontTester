export declare type IRole = "Guest" | "User";
export declare interface IUser {
  name: string;
  email: string;
  role: IRole;
  _id: string;
}

export declare interface IText {
  fontIndex: number;
  filters: string[] | number[] | [];
}
