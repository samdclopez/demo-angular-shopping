import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  products: any[] = [];
  cart: any[] = [];
  categories: any[] = [];
  selectedCategory: string = 'all';
  isLoading: boolean = true;
  totalAmount: number = 0;
  payments: any[] = [];

  constructor(private router: Router, private httpClient: HttpClient) {
    this.loadAllProducts();
    this.loadCategories();
    this.isLoading = false;
  }

  filterProductsByCategory(category: string) {
    // Don't do anything if same category is selected
    if (this.selectedCategory === category) {
      return;
    }
   
    this.isLoading = true; // Show loading indicator
    if (category === 'all') {
      this.loadAllProducts();
    } else {
      this.selectedCategory = category;
      this.httpClient.get<any[]>(`https://fakestoreapi.com/products/category/${category}`)
        .subscribe({
          next: (data: any) => {
            this.products = data;
            this.isLoading = false; // Hide loading indicator after data loads
          },
          error: () => {
            this.isLoading = false; // Hide loading indicator if there's an error
          }
        })
    }
  }

  loadAllProducts() {
    
    this.selectedCategory = 'all';
    this.isLoading = true;
    this.httpClient.get<any[]>(`https://fakestoreapi.com/products`)
      .subscribe( {
        next : (data: any) => {
          this.products = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      }
      )
  }

  loadCategories() {
    
    this.isLoading = true;
    this.httpClient.get<any[]>('https://fakestoreapi.com/products/categories')
      .subscribe( {
        next : (data: any) => {
          this.categories = data;
        }
      }
      )
    this.isLoading = false;
  }

  addToCart(product: any) {
      // increment the quantity of the product in the cart
      var productInCart = this.cart.find((p: any) => p.id === product.id);
      if (productInCart) {
        productInCart.quantity++;
      }
      else {
        this.cart.push({...product, quantity: 1});
      }
      this.calculateTotal();
  }

  removeFromCart(product: any) {
    var productInCart = this.cart.find((p: any) => p.id === product.id);
    if (productInCart) {
      productInCart.quantity--;
      if (productInCart.quantity === 0) {
        this.cart = this.cart.filter((p: any) => p.id !== product.id);
      }
    }
    this.calculateTotal();
  }

  // Calcula el total basado en el estado actual
  private calculateTotal() {
    this.totalAmount = this.cart.reduce(
      (total: number, item: any) => total + (item.price * item.quantity), 
      0
    );
  }

  clearCart() {
    this.cart = [];
    this.totalAmount = 0;
  }

  //process payment mock function and keep the details in the local storage, define a mock id payment, and the date of the payment
  processPayment() {
    const paymentId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const paymentDate = new Date().toISOString();
    const paymentDetails = {
      id: paymentId,
      date: paymentDate,
      total: this.totalAmount,
      items: this.cart
    };
    // get the payments from the local storage
    const storedPayments = localStorage.getItem('payment');
    if (storedPayments) {
      this.payments = JSON.parse(storedPayments);
    }
    //add the payment to the payments array
    this.payments.push(paymentDetails);
    //save the payments to the local storage
    localStorage.setItem('payment', JSON.stringify(this.payments));
    //clear the cart
    this.clearCart();
    //refresh the page
    this.refreshPage();
  }
  
  //refresh the page
  refreshPage() {
    window.location.reload();
  }
  


  goToHome() {
    this.router.navigate(['/']);
  }
}
