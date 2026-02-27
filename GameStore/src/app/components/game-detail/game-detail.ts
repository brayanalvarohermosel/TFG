import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private carritoService: CarritoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.gameService.getGameById(id).subscribe((data) => {
        this.game = data;
        this.cdr.detectChanges();
      });
    }
  }

  getDiscount(): number {
    if (!this.game) return 0;
    return Math.round((1 - this.game.price / this.game.oldPrice) * 100);
  }

  onAddToCart() {
    if (this.game) {
      this.carritoService.addGame(this.game);
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
