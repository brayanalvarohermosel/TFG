import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { Game } from '../../models/game.model';
import { GameService } from '../../services/game';
import { GameCardComponent } from '../game-card/game-card';
import { AuthService } from '../../services/auth';
import { GameFormComponent } from '../game-form/game-form';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [GameCardComponent, GameFormComponent],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css',
})
export class GameListComponent implements OnInit {
  @Output() edit = new EventEmitter<Game>();
  @Output() addToCart = new EventEmitter<Game>();

  filter: string = 'Todos';
  games: Game[] = [];
  filteredGames: Game[] = [];
  showForm: boolean = false;
  gameToEdit: Game | null = null;

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
    public authService: AuthService,
  ) {}

  onFormClosed() {
    this.showForm = false;
    this.gameToEdit = null;
    this.loadGames();
    this.cdr.detectChanges();
    setTimeout(() => this.loadGames(), 800);
  }

  ngOnInit() {
    this.gameService.currentFilter.subscribe((filter) => {
      this.filter = filter;
      this.applyFilter();
      this.cdr.detectChanges();
    });

    this.gameService.openForm.subscribe(() => {
      this.gameToEdit = null;
      this.showForm = true;
      this.cdr.detectChanges();
    });

    this.loadGames();
  }

  loadGames() {
    this.gameService.getGames().subscribe((data) => {
      this.games = data;
      this.applyFilter();
      this.cdr.detectChanges();
    });
  }

  applyFilter() {
    if (this.filter === 'Todos') {
      this.filteredGames = this.games;
    } else if (this.filter === 'PlayStation') {
      this.filteredGames = this.games.filter((g) => g.platform.includes('PS'));
    } else {
      this.filteredGames = this.games.filter((g) => g.platform.includes(this.filter));
    }
  }

  onAddToCart(game: Game) {
    this.addToCart.emit(game);
  }

  onEdit(game: Game) {
    this.gameToEdit = game;
    this.showForm = true;
  }

  onDelete(game: Game) {
    if (confirm(`¿Eliminar ${game.name}?`)) {
      this.gameService.deleteGame(game.id!).subscribe(() => this.loadGames());
    }
  }
}
