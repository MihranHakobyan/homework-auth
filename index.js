import express from "express";
import {authRouter} from "./routes/auth.js";

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded())
app.use("/auth",authRouter)






app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});