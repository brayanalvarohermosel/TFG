import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { supabase } from '../../services/supabase';
import { AuthService } from '../../services/auth';

/**
 * Shows the authenticated user's order history with game codes.
 * Orders are sorted newest-first and limited to 10.
 * Waits for the user to be available (via user$ observable) before loading.
 */
@Component({
  selector: 'app-orders',
  imports: [DatePipe, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  loading = true;
  private sub?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.sub = this.authService.user$.subscribe((user) => {
      if (user) {
        this.loadOrders(user.id);
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private async loadOrders(userId: string) {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    this.orders = data || [];
    this.loading = false;
  }

  /** Copies a game code to the clipboard. */
  copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }
}
