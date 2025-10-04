import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons,
  IonButton,
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonIcon, 
  IonAvatar, 
  IonBadge,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { Order } from '../models/product.model';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons,
    IonButton,
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonIcon, 
    IonAvatar, 
    IonBadge,
    CommonModule, 
    FormsModule
  ]
})
export class ProfilePage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  recentOrders: Order[] = [];
  cartItemCount = 0;
  isAdmin = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscribeToAuth();
    this.subscribeToCart();
    this.subscribeToOrders();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  subscribeToAuth() {
    const subscription = this.authService.authState$.subscribe(authState => {
      this.currentUser = authState.user;
      this.isAdmin = this.authService.isAdmin();
      if (!authState.isAuthenticated) {
        this.router.navigate(['/login']);
      }
    });
    this.subscriptions.push(subscription);
  }

  subscribeToCart() {
    const subscription = this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });
    this.subscriptions.push(subscription);
  }

  subscribeToOrders() {
    const subscription = this.orderService.orders$.subscribe(orders => {
      this.recentOrders = orders.slice(0, 5); // Show only recent 5 orders
    });
    this.subscriptions.push(subscription);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            await this.authService.logout();
            await this.showToast('Sesión cerrada exitosamente', 'success');
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    
    await alert.present();
  }

  goToOrders() {
    // Navigate to orders page (to be implemented)
    console.log('Navigate to orders');
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToProducts() {
    this.router.navigate(['/tabs/products']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  viewOrder(order: Order) {
    // Show order details (to be implemented)
    console.log('View order:', order);
  }

  async showAbout() {
    const alert = await this.alertController.create({
      header: 'Ecommerce App',
      message: 'Aplicación móvil híbrida desarrollada con Ionic y Angular. Incluye autenticación, carrito de compras, y gestión de pedidos.',
      buttons: ['OK']
    });
    
    await alert.present();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'pending': 'warning',
      'processing': 'primary',
      'shipped': 'secondary',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return colorMap[status] || 'medium';
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}
