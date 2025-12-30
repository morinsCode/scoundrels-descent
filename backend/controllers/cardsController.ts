// === CONTROLLER FILE FOR CARDS ===
//  controller handles HTTP requests related to card deck operations.
// Controllers act as intermediaries between routes and services, processing
// request data and sending appropriate responses back to clients.

import type { Request, Response, NextFunction } from "express";
import { getRandomDeck } from "../services/cardsServices.js";

// Default number of cards to return if client doesn't specify a size
const DEFAULT_DECK_SIZE = 44;

// Handles GET requests for retrieving a randomized deck of cards
// Accepts an optional 'size' query parameter (e.g., /deck?size=30)
// If size is invalid or missing, uses DEFAULT_DECK_SIZE
export async function getDeckController(
  req: Request, // Contains request data (query params, body, headers, etc.)
  res: Response, // Used to send response back to client
  next: NextFunction // Passes control to next middleware (especially error handlers)
) {
  try {
    // Extract the 'size' query parameter from the URL
    // Query parameters always arrive as strings or undefined
    const sizeParam = req.query.size as string | undefined;

    // Validate and parse the size parameter
    // If sizeParam exists AND converts to a valid number, use it
    // Otherwise, fall back to DEFAULT_DECK_SIZE (44)
    const size =
      sizeParam && !Number.isNaN(Number(sizeParam))
        ? Number(sizeParam) // Valid number provided
        : DEFAULT_DECK_SIZE; // Invalid/missing, use default

    // Call the service layer to fetch random cards from database
    // The service handles all database interaction and data transformation
    const deck = await getRandomDeck(size);

    // Send successful response with 200 status code and deck data as JSON
    res.status(200).json(deck);
  } catch (error) {
    // Pass any errors to Express error-handling middleware
    // This centralizes error handling instead of duplicating it in each controller
    next(error);
  }
}
