import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from '../../models/game.model';
import { GameService } from '../../services/game';
import { FormsModule } from '@angular/forms';

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
    if (this.gameToEdit) {
      this.game = { ...this.gameToEdit };
      this.isEditing = true;
    }
  }

  onSubmit() {
    if (this.isEditing) {
      this.gameService.updateGame(this.game.id!, this.game).subscribe(() => {
        this.gameSaved.emit();
        this.formClosed.emit();
      });
    } else {
      this.gameService.createGame(this.game).subscribe(() => {
        this.gameSaved.emit();
        this.formClosed.emit();
      });
    }
  }

  onCancel() {
    this.formClosed.emit();
  }
}
