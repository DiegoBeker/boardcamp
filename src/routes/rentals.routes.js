import { Router } from "express";
import { getRentals, postRental } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRental);

export default rentalsRouter;
