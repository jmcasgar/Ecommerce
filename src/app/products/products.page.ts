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
  IonSearchbar, 
  IonSegment, 
  IonSegmentButton, 
  IonLabel, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonIcon, 
  IonBadge, 
  IonSpinner,
  ToastController,
  ModalController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product, Category } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons,
    IonButton,
    IonSearchbar, 
    IonSegment, 
    IonSegmentButton, 
    IonLabel, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonIcon, 
    IonBadge, 
    IonSpinner,
    CommonModule, 
    FormsModule
  ]
})
export class ProductsPage implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory = 'all';
  isLoading = false;
  cartItemCount = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.subscribeToCart();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async loadProducts() {
    this.isLoading = true;
    try {
      const subscription = this.productService.getProducts().subscribe({
        next: (products) => {
          this.products = products;
          this.filteredProducts = products;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading = false;
        }
      });
      this.subscriptions.push(subscription);
    } catch (error) {
      console.error('Error loading products:', error);
      this.isLoading = false;
    }
  }

  async loadCategories() {
    const subscription = this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
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

  onSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.filterProducts();
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.filterProducts();
  }

  filterProducts() {
    let filtered = [...this.products];

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(this.searchQuery) ||
        product.description.toLowerCase().includes(this.searchQuery)
      );
    }

    this.filteredProducts = filtered;
  }

  async addToCart(product: Product, event: Event) {
    event.stopPropagation();
    
    if (product.stock > 0) {
      await this.cartService.addToCart(product, 1);
      await this.showToast(`${product.name} agregado al carrito`, 'success');
    }
  }

  viewProduct(product: Product) {
    // Navigate to product detail page (to be implemented)
    console.log('View product:', product);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  getStars(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(i);
    }
    return stars;
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
