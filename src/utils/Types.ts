import { Document, SchemaTimestampsConfig } from "mongoose";

type UserRoles = "USER" | "ADMIN";

export type TUser = {
  name: string;
  email: string;
  password: string;
  otp: number;
  otpExpiryTime: Date;
  isActive: boolean;
  role: UserRoles;
  forgotPassword: string;
  setFgtPswd: boolean;
};

export type TUserModel = TUser & Document & SchemaTimestampsConfig;

export type TGenResObj = {
  success: boolean;
  message: string;
  data?: any;
};

export type TResponse = {
  code: number;
  data: TGenResObj;
};

type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

type OptionalKeys<T> = "otp" | "password" | "otpExpiryTime";

type Optional<T> = {
  [P in keyof T as Exclude<P, OptionalKeys<T>>]: T[P];
} & {
  [P in keyof T as P extends OptionalKeys<T> ? P : never]?: T[P];
};

export type TVerifyResponse = Optional<TUser>;

