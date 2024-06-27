import mongoose from "mongoose";

const dbConnect = (dbUri: string) => {
  mongoose.connect(dbUri);

  mongoose.connection.on("connected", () => {
    console.log("Connected to database successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error while connecting to database: " + err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongodb Connection disconnected");
  });
};

export default dbConnect;
