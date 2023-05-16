import { Router } from "express";
import { closeRental, deleteRental, getRentals, postRental } from "../controllers/rentals.controller.js";
import { validateCloseRental, validateDeleteRental, validateRental } from "../middlewares/rentals.middleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateRental, postRental);
rentalsRouter.post("/rentals/:id/return", validateCloseRental, closeRental);
rentalsRouter.delete("/rentals/:id", validateDeleteRental, deleteRental);

export default rentalsRouter;
