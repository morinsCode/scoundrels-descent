// === ROUTES FILE FOR CARDS ===
import { Router } from "express";
import { getDeckController } from "../controllers/cardsController.js";

const router = Router();

// === GET
router.get("/deck", getDeckController);

export default router;
