const dotenv = require("dotenv");
const dbConnection = require("./config/databaseConnection");
const PORT = process.env.PORT || 2015;
const express = require("express");
const authRoute = require("./route/authRoute");
const messageRoute = require("./route/messageRoute");
const usersRoute = require("./route/usersRoute");
const ApiError = require("./utils/apiError");
const globalError = require("./meddilware/errorMiddleware");
const { app, server } = require("./socket/socket");

dotenv.config({ path: "config.env" });

app.use(express.json());

dbConnection();

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/users", usersRoute);

app.all("*", (req, res, next) => {
  //   const err = new Error(`cant fing this route ${req.originalUrl}`);
  //  next(err.message); // this next will send the error to global error handle middleWare
  next(new ApiError(`cant fing this route ${req.originalUrl}`, 400)); // this next will send the error to global error handle middleWare
});

//Global error handiling middleware for express
app.use(globalError);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`UnHandled Error: ${err}`);
  server.close(() => {
    console.error(`shutting down...`);
    process.exit(1);
  });
});
