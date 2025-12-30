import { Router } from "express";
import {
  getHighscoresController,
  postHighscoreController // Import the POST controller
} from "../controllers/highscoreControllers.js";

const router = Router();

// === GET
router.get("/highscores", getHighscoresController);

// === POST
router.post("/highscores", postHighscoreController);

export default router;
