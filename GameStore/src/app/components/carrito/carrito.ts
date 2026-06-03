import { Component, EventEmitter, Output } from '@angular/core';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-carrito',
  imports: [],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class CarritoComponent {
  @Output() closed = new EventEmitter<void>();
  /** Emits the total amount when the user clicks "Comprar". */
  @Output() comprar = new EventEmitter<number>();

  constructor(public carritoService: CarritoService){}

  onComprar(){
    this.comprar.emit(this.carritoService.getTotal());
  }
}
