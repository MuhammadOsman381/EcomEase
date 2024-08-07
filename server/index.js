import { config } from "dotenv";
import dbconnection from "./database/dbconnection.js";
import { app } from "./app.js";

config({
  path: "../.env",
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`server is running at port ${process.env.PORT}`);
});

dbconnection();
