import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Game } from '../../models/game.model';
import { GameService } from '../../services/game';
import { CarritoService } from '../../services/carrito';
import { GameCardComponent } from '../game-card/game-card';
import { AuthService } from '../../services/auth';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [GameCardComponent],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css',
})
export class GameListComponent implements OnInit {
  filter: string = 'Todos';
  searchTerm: string = '';
  games: Game[] = [];
  filteredGames: Game[] = [];
  loading = true;

  private carritoService = inject(CarritoService);

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    /** Watches filter changes AND search input simultaneously, then re-filters. */
    combineLatest([
      this.gameService.currentFilter,
      this.gameService.searchTerm,
    ]).subscribe(([filter, searchTerm]) => {
      this.filter = filter;
      this.searchTerm = searchTerm;
      this.applyFilter();
      this.cdr.detectChanges();
    });

    /** Reloads when a game is created/edited by the admin. */
    this.gameService.gamesChanged.subscribe(() => this.loadGames());

    this.loadGames();
  }

  loadGames() {
    this.loading = true;
    this.gameService.getGames().subscribe((data) => {
      this.games = data;
      this.applyFilter();
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  /** Filters by platform and/or search term, applied client-side for instant feedback. */
  applyFilter() {
    let result = this.games;

    if (this.filter !== 'Todos') {
      if (this.filter === 'PlayStation') {
        result = result.filter((g) => g.platform.includes('PS'));
      } else {
        result = result.filter((g) => g.platform.includes(this.filter));
      }
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(
        (g) =>
          g.name.toLowerCase().includes(term) ||
          g.platform.toLowerCase().includes(term)
      );
    }

    this.filteredGames = result;
  }

  onAddToCart(game: Game) {
    this.carritoService.addGame(game);
  }

  onEdit(game: Game) {
    this.gameService.openForm.next(game);
  }

  onDelete(game: Game) {
    if (confirm(`¿Eliminar ${game.name}?`)) {
      this.gameService.deleteGame(game.id!).subscribe(() => this.loadGames());
    }
  }
}
