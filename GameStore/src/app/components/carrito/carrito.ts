import { Component, EventEmitter, Output } from '@angular/core';
import { CarritoService } from '../../services/carrito';
import { Carrito } from '../../models/carrito.model';

@Component({
  selector: 'app-carrito',
  imports: [],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class CarritoComponent {
  @Output() closed = new EventEmitter<void>();

  constructor(public carritoService: CarritoService){}

  onComprar(){
    alert('Compra realizada con éxito');
    this.carritoService.clear();
    this.closed.emit();
  }
}
