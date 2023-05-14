import { Router } from "express";
import { closeRental, getRentals, postRental } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRental);
rentalsRouter.post("/rentals/:id/return", closeRental);

export default rentalsRouter;
