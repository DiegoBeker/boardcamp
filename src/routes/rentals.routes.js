import { Router } from "express";
import { closeRental, deleteRental, getRentals, postRental } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRental);
rentalsRouter.post("/rentals/:id/return", closeRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
