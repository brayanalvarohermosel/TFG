import { Component, OnInit } from '@angular/core';
import { Game } from '../../models/game.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-game-detail',
  imports: [],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css',
})
export class GameDetailComponent implements OnInit {
  game: Game | null = null;
  loading = true;
  addedToCart = false;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      /** getGameById uses the cache if available (see GameService). */
      this.gameService.getGameById(id).subscribe((data) => {
        this.game = data;
        this.loading = false;
      });
    }
  }

  /** Calculates the discount percentage. */
  getDiscount(): number {
    if (!this.game || !this.game.oldPrice) return 0;
    return Math.round((1 - this.game.price / this.game.oldPrice) * 100);
  }

  /** Adds to cart and shows a brief "Added!" confirmation. */
  onAddToCart() {
    if (this.game) {
      this.carritoService.addGame(this.game);
      this.addedToCart = true;
      setTimeout(() => this.addedToCart = false, 2000);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
