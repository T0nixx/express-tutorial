import express from "express";
import ejs from "ejs";
import session from "express-session";
import router from "./router/main";
import fs from "fs";
const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);

const server = app.listen(3000, () => {
  console.log("Express server has started on port 3000.");
});

app.use(express.static("public"));
app.use(
  session({
    secret: "SDFASDFASD!@#",
    resave: false,
    saveUninitialized: true,
  }),
);

router(app);
