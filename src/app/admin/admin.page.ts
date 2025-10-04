import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonThumbnail,
  IonBadge,
  IonButton,
  IonIcon,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  AlertController,
  ToastController,
  NavController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, 
  receiptOutline, 
  checkmarkCircleOutline, 
  timeOutline, 
  cashOutline,
  playOutline,
  carOutline,
  checkmarkOutline,
  closeOutline,
  storefrontOutline,
  downloadOutline,
  refreshOutline
} from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { Order, CartItem } from '../models/product.model';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonThumbnail,
    IonBadge,
    IonButton,
    IonIcon,
    IonButtons,
    IonSegment,
    IonSegmentButton
  ],
})
export class AdminPage implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus = 'all';
  
  // Estadísticas
  totalOrders = 0;
  completedOrders = 0;
  pendingOrders = 0;
  totalRevenue = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private navController: NavController,
    private router: Router
  ) {
    addIcons({ 
      logOutOutline, 
      receiptOutline, 
      checkmarkCircleOutline, 
      timeOutline, 
      cashOutline,
      playOutline,
      carOutline,
      checkmarkOutline,
      closeOutline,
      storefrontOutline,
      downloadOutline,
      refreshOutline
    });
  }

  ngOnInit() {
    this.loadOrders();
    this.subscribeToOrders();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  subscribeToOrders() {
    const subscription = this.orderService.orders$.subscribe(orders => {
      this.orders = orders;
      this.filteredOrders = [...orders];
      this.calculateStats();
    });
    this.subscriptions.push(subscription);
  }

  loadOrders() {
    this.orderService.getOrders().subscribe();
  }

  calculateStats() {
    this.totalOrders = this.orders.length;
    this.completedOrders = this.orders.filter(o => o.status === 'delivered').length;
    this.pendingOrders = this.orders.filter(o => o.status === 'pending').length;
    this.totalRevenue = this.orders
      .filter(o => o.status === 'delivered')
      .reduce((acc, order) => acc + order.totalAmount, 0);
  }

  filterOrders() {
    if (this.selectedStatus === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === this.selectedStatus);
    }
  }

  async updateOrderStatus(order: Order, newStatus: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Cambio',
      message: `¿Estás seguro de cambiar el estado del pedido #${order.id} a "${this.getStatusText(newStatus)}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.performStatusUpdate(order, newStatus);
          }
        }
      ]
    });

    await alert.present();
  }

  async performStatusUpdate(order: Order, newStatus: string) {
    try {
      await this.orderService.updateOrderStatus(order.id, newStatus as any);
      this.showToast(`Estado del pedido #${order.id} actualizado a "${this.getStatusText(newStatus)}"`, 'success');
      this.calculateStats();
    } catch (error) {
      this.showToast('Error al actualizar el estado del pedido', 'danger');
    }
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
      'shipped': 'tertiary',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return colorMap[status] || 'medium';
  }

  getOrderImage(order: Order): string {
    if (order.items && order.items.length > 0) {
      return order.items[0].product.image;
    }
    return 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=Producto';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  goToProducts() {
    this.router.navigate(['/tabs/products']);
  }

  async exportOrders() {
    this.showToast('Función de exportación en desarrollo', 'info');
  }

  async refreshData() {
    this.loadOrders();
    this.showToast('Datos actualizados', 'success');
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}