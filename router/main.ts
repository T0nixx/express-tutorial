import express from "express";
import { Request } from "../types";
import fs from "fs";
export default (app: express.Express) => {
  app.use(express.json());

  app.get("/", (_request, response) => {
    response.render("index", {
      title: "MY HP",
      length: 5,
    });
  });

  app.get("/list", (_request, response) => {
    fs.readFile(
      __dirname + "/../data/" + "user.json",
      "utf-8",
      (read_error, data) => {
        console.log(read_error ?? "WORKING");

        if (read_error) {
          response.json(resultFailure("Read File Error Occurred"));
          return;
        }

        console.log(data);
        response.json(resultSuccess({ data: JSON.parse(data) }));
        return;
      },
    );
  });

  app.get("/getUser", (request, response) => {
    console.log(request.query);
    if (typeof request.query.name !== "string") {
      response.json(resultFailure("Invalid Request"));
      return;
    }

    fs.readFile(
      __dirname + "/../data/" + "user.json",
      "utf-8",
      (read_error, data) => {
        console.log(read_error ?? "WORKING");
        if (read_error) {
          response.json(resultFailure("Read File Error Occurred"));
          return;
        }

        const parsed: UserData = JSON.parse(data);
        const target_user = parsed.users.find(
          ({ name }) => name === request.query.name,
        );

        if (target_user == undefined) {
          response.json(resultFailure("Can Not Find User Name"));
          return;
        }

        response.json(resultSuccess({ data: target_user }));
        return;
      },
    );
  });

  app.post("/addUser", (request: Request<User>, response) => {
    console.log(JSON.stringify(request.body));
    if (isUser(request.body) === false) {
      response.json(resultFailure("Invalid Request"));
      return;
    }

    fs.readFile(
      __dirname + "/../data/" + "user.json",
      "utf-8",
      (read_error, data) => {
        if (read_error) {
          response.json(resultFailure("Read File Error Occurred"));
          return;
        }

        const parsed: UserData = JSON.parse(data);

        if (parsed.users.findIndex((x) => x.name == request.body.name) !== -1) {
          response.json(resultFailure("Duplicate Name"));
          return;
        }

        const to_write: UserData = { users: [...parsed.users, request.body] };

        fs.writeFile(
          __dirname + "/../data/" + "user.json",
          JSON.stringify(to_write, null, "\t"),
          (write_error) => {
            if (write_error) {
              response.send("Write File Error");
              return;
            }
            response.json(resultSuccess());
            return;
          },
        );
      },
    );
  });

  app.put("/updateUser", (request: Request<UserUpdateData>, response) => {
    if (
      !(
        request.body.from &&
        request.body.to &&
        isUser(request.body.from) &&
        isUser(request.body.to)
      )
    ) {
      response.json(resultFailure("Invalid Request"));
      return;
    }

    fs.readFile(
      __dirname + "/../data/" + "user.json",
      "utf-8",
      (read_error, data) => {
        if (read_error) {
          response.json(resultFailure("Read File Error Occurred"));
          return;
        }

        const parsed: UserData = JSON.parse(data);
        const target_index = parsed.users.findIndex(
          (x) => x.name == request.body.from.name,
        );

        if (target_index === -1) {
          response.json(resultFailure("Can Not Find User Name"));
          return;
        }

        const to_write: UserData = {
          users: [
            ...parsed.users.slice(0, target_index),
            ...parsed.users.slice(target_index + 1),
            request.body.to,
          ],
        };

        fs.writeFile(
          __dirname + "/../data/" + "user.json",
          JSON.stringify(to_write, null, "\t"),
          (write_error) => {
            if (write_error) {
              response.send("Write File Error");
              return;
            }
            response.json(resultSuccess());
            return;
          },
        );
      },
    );
  });

  app.delete("/deleteUser/:username", (request, response) => {
    const target_name = request.params.username;
    fs.readFile(
      __dirname + "/../data/" + "user.json",
      "utf-8",
      (read_error, data) => {
        if (read_error) {
          response.json(resultFailure("Read File Error Occurred"));
          return;
        }

        const parsed: UserData = JSON.parse(data);
        const target_index = parsed.users.findIndex(
          (x) => x.name == target_name,
        );

        if (target_index === -1) {
          response.json(resultFailure("Can Not Find User Name"));
          return;
        }

        const to_write: UserData = {
          users: [
            ...parsed.users.slice(0, target_index),
            ...parsed.users.slice(target_index + 1),
          ],
        };

        fs.writeFile(
          __dirname + "/../data/" + "user.json",
          JSON.stringify(to_write, null, "\t"),
          (write_error) => {
            if (write_error) {
              response.send("Write File Error");
              return;
            }
            response.json(resultSuccess());
            return;
          },
        );
      },
    );
  });
};

function isUser(mayBeUser: any | User): mayBeUser is User {
  return mayBeUser.name && mayBeUser.password;
}

function resultFailure(error_message: string): FailureResult {
  return { success: 0, error_message };
}

function resultSuccess(data?: Object): SuccessResult {
  return { success: 1, ...data };
}

interface User {
  name: string;
  password: string;
}
interface UserUpdateData {
  from: User;
  to: User;
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
