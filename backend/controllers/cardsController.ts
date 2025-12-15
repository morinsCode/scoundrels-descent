// === CONTROLLER FILE FOR CARDS ===

import type { Request, Response, NextFunction } from "express";
import { getRandomDeck } from "../services/cardsServices.js";

const DEFAULT_DECK_SIZE = 44;

export async function getDeckController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const sizeParam = req.query.size as string | undefined;
    const size =
      sizeParam && !Number.isNaN(Number(sizeParam))
        ? Number(sizeParam)
        : DEFAULT_DECK_SIZE;

    const deck = await getRandomDeck(size);
    res.status(200).json(deck);
  } catch (error) {
    next(error);
  }
}
