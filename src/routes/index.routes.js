import { Router } from "express";
import gamesRouter from "./games.routes.js";
import customerRouter from "./customers.routes.js";
import rentalsRouter from "./rentals.routes.js";

const router = Router();
router.use(gamesRouter);
router.use(customerRouter);
router.use(rentalsRouter);

export default router;