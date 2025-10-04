import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Order, CartItem } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com'; // Mock API
  private readonly ORDERS_KEY = 'user_orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadOrders();
  }

  async createOrder(cartItems: CartItem[], shippingAddress: string, paymentMethod: string): Promise<Order> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const totalAmount = cartItems.reduce((total, item) => total + item.totalPrice, 0);

    const newOrder: Order = {
      id: Date.now(), // Mock ID
      userId: user.id,
      items: [...cartItems],
      totalAmount: totalAmount,
      status: 'pending',
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        const currentOrders = this.ordersSubject.value;
        currentOrders.unshift(newOrder);
        this.ordersSubject.next(currentOrders);
        this.saveOrders();
        resolve(newOrder);
      }, 1000);
    });
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }

  getOrderById(orderId: number): Observable<Order | undefined> {
    return new Observable(observer => {
      const order = this.ordersSubject.value.find(o => o.id === orderId);
      observer.next(order);
      observer.complete();
    });
  }

  async updateOrderStatus(orderId: number, status: Order['status']): Promise<void> {
    const currentOrders = this.ordersSubject.value;
    const order = currentOrders.find(o => o.id === orderId);
    
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.ordersSubject.next(currentOrders);
      await this.saveOrders();
    }
  }

  getOrderHistory(): Observable<Order[]> {
    return this.orders$;
  }

  private async saveOrders(): Promise<void> {
    try {
      await Preferences.set({
        key: this.ORDERS_KEY,
        value: JSON.stringify(this.ordersSubject.value)
      });
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }

  private async loadOrders(): Promise<void> {
    try {
      const ordersData = await Preferences.get({ key: this.ORDERS_KEY });
      if (ordersData.value) {
        const orders = JSON.parse(ordersData.value);
        this.ordersSubject.next(orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }
}

