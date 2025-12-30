import {
  getTopHighscores,
  postHighscore
} from "../services/highscoreServices.ts";

import type { Request, Response, NextFunction } from "express";

const DEFAULT_HIGHSCORE_LIMIT = 10;

export async function getHighscoresController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limitParam = req.query.limit as string | undefined;
    const limit =
      limitParam && !Number.isNaN(Number(limitParam))
        ? Number(limitParam)
        : DEFAULT_HIGHSCORE_LIMIT;

    const highscores = await getTopHighscores(limit);
    res.status(200).json(highscores);
  } catch (error) {
    next(error);
  }
}

export async function postHighscoreController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { playerName, score } = req.body;

    if (typeof playerName !== "string" || typeof score !== "number") {
      res.status(400).json({ error: "Invalid input data" });
      return;
    }

    await postHighscore(playerName, score);
    res.status(201).json({ message: "Highscore recorded successfully" });
  } catch (error) {
    next(error);
  }
}
