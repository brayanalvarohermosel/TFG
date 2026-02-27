import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Game } from './models/game.model';
import { GameFormComponent } from './components/game-form/game-form';
import { NavbarComponent } from './components/navbar/navbar';
import { LoginComponent } from './components/login/login';
import { AuthService } from './services/auth';
import { CarritoService } from './services/carrito';
import { CarritoComponent } from './components/carrito/carrito';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameFormComponent, NavbarComponent, LoginComponent, CarritoComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  
  currentFilter: string = 'Todos';
  showForm: boolean = false;
  showCarrito: boolean = false;
  gameToEdit: Game | null = null;
  
  constructor(public authService: AuthService, public carritoService: CarritoService) {}
  
  onFilterChanged(platform: string) {
    this.currentFilter = platform;
  }
  
  onEdit(game: Game) {
    this.gameToEdit = game;
    this.showForm = true;
  }
  
  onAddGame() {
    this.gameToEdit = null;
    this.showForm = true;
  }
  
  onFormClosed() {
    this.showForm = false;
    this.gameToEdit = null;
  }

  onAddToCart(game: Game) {
    this.carritoService.addGame(game);
  }

  logout() {
    this.authService.logout();
  }
}
