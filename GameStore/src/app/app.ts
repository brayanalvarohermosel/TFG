import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Game } from './models/game.model';
import { GameFormComponent } from './components/game-form/game-form';
import { NavbarComponent } from './components/navbar/navbar';
import { LoginComponent } from './components/login/login';
import { AuthService } from './services/auth';
import { CarritoService } from './services/carrito';
import { CarritoComponent } from './components/carrito/carrito';
import { GameService } from './services/game';
import { PaymentComponent } from './components/payment/payment';
import { supabase } from './services/supabase';

/** Item shown in the success overlay after payment. */
interface SuccessItem {
  name: string;
  image: string;
  code: string;
}

/** Generates a random game code in GAMEK-XXXX-XXXX-XXXX format, similar to Instant Gaming. */
function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `GAMEK-${part()}-${part()}-${part()}`;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GameFormComponent, NavbarComponent, LoginComponent, CarritoComponent, PaymentComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  
  showForm: boolean = false;
  showCarrito: boolean = false;
  gameToEdit: Game | null = null;
  showPayment: boolean = false;
  paymentTotal: number = 0;
  showSuccess: boolean = false;
  successItems: SuccessItem[] = [];
  successTotal: number = 0;
  
  constructor(
    public authService: AuthService,
    public carritoService: CarritoService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    /** Opens the game form modal in create or edit mode. */
    this.gameService.openForm.subscribe((game) => {
      this.gameToEdit = game;
      this.showForm = true;
    });
  }
  
  onAddGame() {
    this.gameToEdit = null;
    this.showForm = true;
  }
  
  onFormClosed() {
    this.showForm = false;
    this.gameToEdit = null;
  }

  async logout() {
    await this.authService.logout();
  }

  onOpenPayment(total: number) {
    this.paymentTotal = total;
    this.showPayment = true;
    this.showCarrito = false;
  }

  /**
   * Called when Stripe confirms payment succeeded.
   * Generates unique codes for each game, inserts the order into Supabase,
   * shows the success overlay with codes, and clears the cart.
   */
  async onPaymentSuccess() {
    const user = this.authService.getUser();
    if (!user) return;

    const items = this.carritoService.getItems();
    const total = this.carritoService.getTotal();

    const codes = items.map(i => ({
      game_id: i.game.id,
      title: i.game.name,
      image: i.game.image,
      price: i.game.price,
      quantity: i.quantity,
      code: generateCode(),
    }));

    await supabase.from('orders').insert({
      user_id: user.id,
      total,
      items: codes,
      status: 'completed',
    });

    this.successItems = codes.map(c => ({ name: c.title, image: c.image, code: c.code }));
    this.successTotal = total;
    this.showPayment = false;
    this.showSuccess = true;
    this.carritoService.clear();
  }

  onPaymentClosed() {
    this.showPayment = false;
  }

  onSuccessClosed() {
    this.showSuccess = false;
    this.successItems = [];
  }

  copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }
}
