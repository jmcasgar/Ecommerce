import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonList, 
  IonItem, 
  IonItemSliding, 
  IonItemOptions, 
  IonItemOption, 
  IonThumbnail, 
  IonLabel, 
  IonButton, 
  IonIcon, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent,
  ToastController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from '../models/product.model';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonList, 
    IonItem, 
    IonItemSliding, 
    IonItemOptions, 
    IonItemOption, 
    IonThumbnail, 
    IonLabel, 
    IonButton, 
    IonIcon, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardContent,
    CommonModule, 
    FormsModule
  ]
})
export class CartPage implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  cartTotal = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private toastController: ToastController,
    private router: Router
  ) {}

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
    });
    this.subscriptions.push(subscription);
  }

  async updateQuantity(productId: number, newQuantity: number) {
    if (newQuantity < 1) {
      await this.removeItem(productId);
      return;
    }

    await this.cartService.updateQuantity(productId, newQuantity);
    await this.showToast('Cantidad actualizada', 'success');
  }

  async removeItem(productId: number) {
    await this.cartService.removeFromCart(productId);
    await this.showToast('Producto eliminado del carrito', 'success');
  }

  goToProducts() {
    this.router.navigate(['/tabs/products']);
  }

  goToCheckout() {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}
