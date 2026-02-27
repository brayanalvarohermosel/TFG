import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { Carrito } from '../models/carrito.model';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private items: Carrito[] = [];

  addGame(game: Game) {
    const existing = this.items.find(i => i.game.id === game.id);

    if (existing) {
      existing.quantity++;
    }else {
      this.items.push({ game, quantity: 1 });
    }
  }

  removeGame(gameId: string) {
    this.items = this.items.filter(i => i.game.id !== gameId);
  }

  decreaseQuantity(gameId: string) {
    const item = this.items.find(i => i.game.id === gameId);
    if (item) {
      item.quantity--;
      if (item.quantity === 0) this.removeGame(gameId);
    }
  }

  getItems(): Carrito[] {
    return this.items;
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.game.price * item.quantity, 0);
  }

  getCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  clear() {
    this.items = [];
  }
}
