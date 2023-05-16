import { Router } from "express";
import { getGames, postGame } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/game.schema.js";
import { validateGame } from "../middlewares/games.middleware.js";

const gamesRouter = Router();

gamesRouter.get("/games" , getGames);
gamesRouter.post("/games", validateSchema(gameSchema), validateGame, postGame);

export default gamesRouter;