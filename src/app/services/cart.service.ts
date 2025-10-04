import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { CartItem, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'shopping_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  async addToCart(product: Product, quantity: number = 1): Promise<void> {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * product.price;
    } else {
      const newItem: CartItem = {
        product: product,
        quantity: quantity,
        totalPrice: quantity * product.price
      };
      currentCart.push(newItem);
    }

    this.cartSubject.next(currentCart);
    await this.saveCart();
  }

  async removeFromCart(productId: number): Promise<void> {
    const currentCart = this.cartSubject.value.filter(item => item.product.id !== productId);
    this.cartSubject.next(currentCart);
    await this.saveCart();
  }

  async updateQuantity(productId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeFromCart(productId);
      return;
    }

    const currentCart = this.cartSubject.value;
    const item = currentCart.find(item => item.product.id === productId);
    
    if (item) {
      item.quantity = quantity;
      item.totalPrice = item.quantity * item.product.price;
      this.cartSubject.next(currentCart);
      await this.saveCart();
    }
  }

  async clearCart(): Promise<void> {
    this.cartSubject.next([]);
    await this.saveCart();
  }

  getCartItems(): CartItem[] {
    return this.cartSubject.value;
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.totalPrice, 0);
  }

  getCartItemCount(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.quantity, 0);
  }

  getCartItemById(productId: number): CartItem | undefined {
    return this.cartSubject.value.find(item => item.product.id === productId);
  }

  private async saveCart(): Promise<void> {
    try {
      await Preferences.set({
        key: this.CART_KEY,
        value: JSON.stringify(this.cartSubject.value)
      });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  private async loadCart(): Promise<void> {
    try {
      const cartData = await Preferences.get({ key: this.CART_KEY });
      if (cartData.value) {
        const cart = JSON.parse(cartData.value);
        this.cartSubject.next(cart);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }
}


