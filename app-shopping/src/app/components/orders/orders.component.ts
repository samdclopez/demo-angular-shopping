import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedPayments = localStorage.getItem('payment');
        if (storedPayments) {
          this.orders = JSON.parse(storedPayments);
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      this.orders = [];
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}