import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/game.schema.js";

const gamesRouter = Router();

gamesRouter.get("/games" , getGames);
gamesRouter.post("/games", validateSchema(gameSchema), postGame);

export default gamesRouter;