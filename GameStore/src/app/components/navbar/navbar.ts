import { Component, EventEmitter, Output, Input } from '@angular/core';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  @Input() isAdmin: boolean = false;
  @Input() username: string = '';
  @Input() cartCount: number = 0;
  @Output() openCarrito = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() addGame = new EventEmitter<void>();

  constructor(private gameService: GameService) {}

  platforms = ['Todos', 'PC', 'PlayStation', 'Xbox', 'Switch'];
  activePlatform = 'Todos';

  filter(platform: string) {
    this.activePlatform = platform;
    this.gameService.setFilter(platform);
  }

  onAddGame() {
    this.gameService.openForm.next();
  }
}
