import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from '../../models/game.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-card',
  imports: [],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css',
})
export class GameCardComponent {
  
  @Input() game!: Game;
  @Input() isAdmin: boolean = false;
  @Output() addToCart = new EventEmitter<Game>();
  @Output() edit = new EventEmitter<Game>();
  @Output() delete = new EventEmitter<Game>();

  constructor(private router: Router){}

  goToDetail() {
    this.router.navigate(['/game', this.game.id]);
  }

  getDiscount(): number {
    return Math.round((1 - this.game.price / this.game.oldPrice) * 100);
  }

  onAddToCart() {
    this.addToCart.emit(this.game);
  }

  onEdit() {
    this.edit.emit(this.game);
  }

  onDelete() {
    this.delete.emit(this.game);
  }

  getPlatformClass(): string {
    if (this.game.platform.includes('PC')) {
      return 'pc';
    }
    if (this.game.platform.includes('PS5')) {
      return 'playstation';
    }
    if (this.game.platform.includes('Xbox')) {
      return 'xbox';
    }
    if (this.game.platform.includes('Switch')) {
      return 'switch';
    }
    return '';
  }
}
