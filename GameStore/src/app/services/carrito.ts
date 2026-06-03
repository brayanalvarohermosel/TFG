import { Injectable, signal, computed } from '@angular/core';
import { Game } from '../models/game.model';
import { Carrito } from '../models/carrito.model';

/**
 * Reactive shopping cart using Angular Signals.
 * Persists to localStorage so the cart survives page refreshes.
 */
@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  /** Signal holding the cart items — reactive, updates the UI automatically. */
  private items = signal<Carrito[]>([]);
  /** Computed signal: total number of items (sum of quantities). */
  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  /** Computed signal: total price (game.price × quantity). */
  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.game.price * item.quantity, 0));

  /** Restores cart from localStorage on service creation. */
  constructor() {
    const saved = localStorage.getItem('carrito');
    if (saved) {
      this.items.set(JSON.parse(saved));
    }
  }

  /** Persists the current signal state to localStorage. */
  private save() {
    localStorage.setItem('carrito', JSON.stringify(this.items()));
  }

  /** Adds a game (or increments quantity if already in cart). */
  addGame(game: Game) {
    this.items.update(current => {
      const existing = current.find(i => i.game.id === game.id);
      if (existing) {
        return current.map(i =>
          i.game.id === game.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { game, quantity: 1 }];
    });
    this.save();
  }

  /** Removes a game from the cart entirely. */
  removeGame(gameId: string) {
    this.items.update(current => current.filter(i => i.game.id !== gameId));
    this.save();
  }

  /** Decreases quantity by 1; removes the item if quantity would reach 0. */
  decreaseQuantity(gameId: string) {
    this.items.update(current => {
      const item = current.find(i => i.game.id === gameId);
      if (!item) return current;
      if (item.quantity <= 1) {
        return current.filter(i => i.game.id !== gameId);
      }
      return current.map(i =>
        i.game.id === gameId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
    this.save();
  }

  getItems(): Carrito[] {
    return this.items();
  }

  getTotal(): number {
    return this.total();
  }

  getCount(): number {
    return this.count();
  }

  /** Empties the cart and clears localStorage. */
  clear() {
    this.items.set([]);
    localStorage.removeItem('carrito');
  }
}
