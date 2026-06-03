import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from '../../models/game.model';
import { GameService } from '../../services/game';
import { FormsModule } from '@angular/forms';

/**
 * Admin form for creating or editing a game.
 * Reuses the same template — switches between create/edit based on gameToEdit.
 */
@Component({
  selector: 'app-game-form',
  imports: [FormsModule],
  templateUrl: './game-form.html',
  styleUrl: './game-form.css',
})
export class GameFormComponent implements OnInit {
  @Input() gameToEdit: Game | null = null;
  @Output() formClosed = new EventEmitter<void>();
  @Output() gameSaved = new EventEmitter<void>();
  
  game: Game = {
    name: '',
    platform: '',
    oldPrice: 0,
    price: 0,
    image: ''
  };

  platforms = ['PC - Steam', 'PC - Epic', 'PS5', 'Xbox', 'Switch'];
  isEditing = false;

  constructor(private gameService: GameService) {}

  ngOnInit(){
    /** If gameToEdit is provided, pre-fill the form (edit mode). */
    if (this.gameToEdit) {
      this.game = { ...this.gameToEdit };
      this.isEditing = true;
    }
  }

  /** Calls createGame or updateGame, then notifies the list to refresh. */
  onSubmit() {
    const done = () => {
      this.gameService.gamesChanged.next();
      this.gameSaved.emit();
      this.formClosed.emit();
    };

    if (this.isEditing) {
      this.gameService.updateGame(this.game.id!, this.game).subscribe(done);
    } else {
      this.gameService.createGame(this.game).subscribe(done);
    }
  }

  onCancel() {
    this.formClosed.emit();
  }
}
