/** Represents a game sold on the platform. */
export interface Game {
  id?: string;
  name: string;
  platform: string;
  oldPrice: number;
  price: number;
  image: string;
}