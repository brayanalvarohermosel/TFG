import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { supabase } from '../../services/supabase';

/**
 * Stripe payment modal.
 * Flow: loadStripe → create Elements card → invoke Edge Function for clientSecret → confirmCardPayment.
 * The secret key is never exposed to the client — the Edge Function handles it server-side.
 */
@Component({
  selector: 'app-payment',
  imports: [],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentComponent implements OnInit {
  @Input() total: number = 0;
  @Output() closed = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<void>();

  processing = false;
  error = '';
  private stripe!: any;
  private card!: StripeCardElement;

  async ngOnInit() {
    try {
      /** Load Stripe with the publishable key (safe for client-side use). */
      this.stripe = await loadStripe('pk_test_51TdwkDRRsvkI6T7FnhyW3Mr7yFmuq8cjaGbVs5G9oOWgByB8EWlZn6or2Y3TW0q2VuRpMw6y4eLT1Izz3C12A9Sg0017JXsP4I');
      const elements = this.stripe.elements();
      this.card = elements.create('card', {
        style: {
          base: {
            color: '#fff',
            fontFamily: '"Rajdhani", sans-serif',
            fontSize: '15px',
            '::placeholder': { color: '#444' }
          }
        }
      });
      this.card.mount('#card-element');
    } catch (err) {
      this.error = 'Error al cargar Stripe: ' + (err as Error).message;
    }
  }

  /**
   * 1. Calls the Supabase Edge Function to create a PaymentIntent (returns clientSecret).
   * 2. Uses Stripe.js to confirm the card payment with the clientSecret.
   * 3. Emits paymentSuccess on completion.
   */
  async onSubmit() {
    this.processing = true;
    this.error = '';

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'create-payment-intent',
        { body: { amount: this.total } }
      );

      if (fnError || !data) {
        this.error = 'Error al crear el pago: ' + (fnError?.message || 'sin respuesta');
        this.processing = false;
        return;
      }

      const { error: confirmError, paymentIntent } = await this.stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: this.card } }
      );

      this.processing = false;

      if (confirmError) {
        this.error = confirmError.message || 'Pago rechazado';
      } else if (paymentIntent?.status === 'succeeded') {
        this.paymentSuccess.emit();
      } else if (paymentIntent?.status === 'requires_action') {
        this.error = 'Se requiere autenticación adicional';
      } else {
        this.error = 'Estado inesperado: ' + (paymentIntent?.status || 'desconocido');
      }
    } catch (err) {
      this.error = 'Error inesperado: ' + (err as Error).message;
      this.processing = false;
    }
  }

  onClose() {
    if (!this.processing) {
      this.closed.emit();
    }
  }
}