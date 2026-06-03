import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { supabase } from '../../services/supabase';
import { AuthService } from '../../services/auth';

/**
 * Shows the authenticated user's order history with game codes.
 * Orders are sorted newest-first and limited to 20.
 */
@Component({
  selector: 'app-orders',
  imports: [DatePipe, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.loadOrders();
  }

  private async loadOrders() {
    const user = this.authService.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    this.orders = data || [];
    this.loading = false;
  }

  /** Copies a game code to the clipboard. */
  copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }
}
