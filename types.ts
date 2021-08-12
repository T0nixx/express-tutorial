// types.ts
import express from "express";
import * as core from "express-serve-static-core";

export interface Request<ReqBody = any>
  extends core.Request<core.ParamsDictionary, any, ReqBody> {}
