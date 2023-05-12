import express from "express";
import cors from "cors";
import router from "./routes/index.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const PORT = 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));