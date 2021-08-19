// types.ts
import express from "express";
import * as core from "express-serve-static-core";
export interface Request<ReqBody = any>
  extends core.Request<core.ParamsDictionary, any, ReqBody> {}

export interface User {
  name: string;
  password: string;
}
export interface UserUpdateData {
  from: User;
  to: User;
}
export interface UserData {
  users: User[];
}

export interface SuccessResult {
  success: 1;
  [key: string]: any;
}

export interface FailureResult {
  success: 0;
  error_message: string;
}

type Result = SuccessResult | FailureResult;
