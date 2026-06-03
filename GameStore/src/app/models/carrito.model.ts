import { Game } from "./game.model";

/** Represents an item in the shopping cart: a game + how many copies. */
export interface Carrito {
    game: Game;
    quantity: number;
}