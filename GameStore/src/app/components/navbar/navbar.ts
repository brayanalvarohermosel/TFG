import { Component, EventEmitter, Output, Input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { GameService } from '../../services/game';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  @Input() isAdmin: boolean = false;
  @Input() cartCount: number = 0;
  @Output() openCarrito = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() addGame = new EventEmitter<void>();

  searchQuery = '';

  constructor(
    private gameService: GameService,
    private router: Router,
  ) {}

  platforms = ['Todos', 'PC', 'PlayStation', 'Xbox', 'Switch'];
  activePlatform = 'Todos';

  /** Sets the filter and navigates to the home page if on a different route (e.g. detail page). */
  filter(platform: string) {
    this.activePlatform = platform;
    this.gameService.setFilter(platform);
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  onSearchInput(value: string) {
    this.gameService.setSearchTerm(value);
  }
}
