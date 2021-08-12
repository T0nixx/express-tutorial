import express from "express";
import { Request } from "../types";
import fs from "fs";
export default (app: express.Express) => {
  app.use(express.json());

  app.get("/", (request, response) => {
    response.render("index", {
      title: "MY HP",
      length: 5,
    });
  });

  app.get("/list", (request, response) => {
    fs.readFile(__dirname + "/../data/" + "user.json", "utf-8", (err, data) => {
      console.log(err ?? "WORKING");
      console.log(data);
      response.send(data);
    });
  });

  app.get("/getUser", (request, response) => {
    fs.readFile(__dirname + "/../data/" + "user.json", "utf-8", (err, data) => {
      console.log(err ?? "WORKING");
      const parsed: UserData = JSON.parse(data);
      const target_user = parsed.users.find(
        ({ name }) => name === request.query.name,
      );
      response.json(target_user);
    });
  });

  app.post("/addUser", (request: Request<User>, response) => {
    console.log(JSON.stringify(request.body));
    if (!(request.body.name && request.body.password)) {
      response.json({
        success: 0,
        error: "Invalid Request.",
      });
      return;
    }

    fs.readFile(__dirname + "/../data/" + "user.json", "utf-8", (err, data) => {
      if (err) {
        response.send("Read File Error");
        return;
      }
      const parsed: UserData = JSON.parse(data);
      if (parsed.users.findIndex((x) => x.name == request.body.name) !== -1) {
        response.json({
          success: 0,
          error: "Duplicate Name.",
        });
        return;
      }
      const to_write: UserData = { users: [...parsed.users, request.body] };

      fs.writeFile(
        __dirname + "/../data/" + "user.json",
        JSON.stringify(to_write, null, "\t"),
        (err) => {
          if (err) {
            response.send("Write File Error");
            return;
          }
          response.json({ success: 1 });
        },
      );
    });
  });
};

interface User {
  name: string;
  password: string;
}

interface UserData {
  users: User[];
}

interface SuccessResult {
  success: 1;
  [key: string]: any;
}

interface FailureResult {
  success: 0;
  error_message: string;
}

type Result = SuccessResult | FailureResult;
