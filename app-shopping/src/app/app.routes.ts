import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { OrdersComponent } from './components/orders/orders.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
       
      },
      { path: 'orders', component: OrdersComponent },
      { path: '**', redirectTo: '' }
];