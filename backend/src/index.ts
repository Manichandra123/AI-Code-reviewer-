import express from "express";
import getres from "./routes/getres.js";
import cors from "cors";

export const app = express();
app.use(cors());
app.use(express.json());

//routes
app.use("/api", getres);

app.listen(3003, () => {
    console.log("Server started on port 3003");
});