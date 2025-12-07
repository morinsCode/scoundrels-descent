// === ROUTES FILE FOR CARDS ===
// src/routes/cardsRoutes.ts
import { Router } from "express";
import { getDeckController } from "../controllers/cardsController.js";

const router = Router();

// GET /api/cards/deck?size=44
router.get("/deck", getDeckController);

export default router;
