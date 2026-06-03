import { Routes } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list';
import { GameDetailComponent } from './components/game-detail/game-detail';
import { OrdersComponent } from './components/orders/orders';

/** App routes: home (game list), detail by ID, and order history. */
export const routes: Routes = [
    { path: '', component: GameListComponent },
    { path: 'game/:id', component: GameDetailComponent },
    { path: 'orders', component: OrdersComponent }
];
