import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonTextarea, 
  IonRadioGroup, 
  IonRadio, 
  IonList, 
  IonThumbnail, 
  IonButton, 
  IonSpinner,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent, 
    IonItem, 
    IonLabel, 
    IonTextarea, 
    IonRadioGroup, 
    IonRadio, 
    IonList, 
    IonThumbnail, 
    IonButton, 
    IonSpinner,
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule
  ]
})
export class CheckoutPage implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  isLoading = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.checkoutForm = this.formBuilder.group({
      shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
      paymentMethod: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.subscribeToCart();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  subscribeToCart() {
    const subscription = this.cartService.cart$.subscribe(cart => {
      this.cartItems = cart;
      this.cartTotal = this.cartService.getCartTotal();
      
      if (cart.length === 0) {
        this.router.navigate(['/tabs/products']);
      }
    });
    this.subscriptions.push(subscription);
  }

  async onCheckout() {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      this.isLoading = true;
      
      try {
        const formData = this.checkoutForm.value;
        
        // Create order
        const order = await this.orderService.createOrder(
          this.cartItems,
          formData.shippingAddress,
          formData.paymentMethod
        );
        
        if (order) {
          // Clear cart
          await this.cartService.clearCart();
          
          // Show success message
          await this.showSuccessAlert(order);
        }
      } catch (error) {
        await this.showToast('Error al procesar el pedido', 'danger');
        console.error('Checkout error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  private async showSuccessAlert(order: any) {
    const alert = await this.alertController.create({
      header: '¡Pedido Confirmado!',
      message: `Tu pedido #${order.id} ha sido procesado exitosamente. Recibirás un email de confirmación pronto.`,
      buttons: [
        {
          text: 'Ver Pedidos',
          handler: () => {
            this.router.navigate(['/profile']);
          }
        },
        {
          text: 'Continuar Comprando',
          handler: () => {
            this.router.navigate(['/tabs/products']);
          }
        }
      ]
    });
    
    await alert.present();
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
