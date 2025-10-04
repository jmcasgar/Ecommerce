import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com'; // Mock API

  // Mock data
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced camera system and A17 Pro chip',
      price: 999,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
      category: 'Electronics',
      stock: 50,
      rating: 4.8,
      reviews: 1250,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      description: 'Premium Android smartphone with AI features',
      price: 899,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
      category: 'Electronics',
      stock: 30,
      rating: 4.7,
      reviews: 980,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'MacBook Pro M3',
      description: 'Professional laptop with M3 chip and Retina display',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
      category: 'Computers',
      stock: 25,
      rating: 4.9,
      reviews: 750,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Air Max technology',
      price: 150,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
      category: 'Fashion',
      stock: 100,
      rating: 4.5,
      reviews: 2100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Sony WH-1000XM5',
      description: 'Premium noise-canceling wireless headphones',
      price: 399,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      category: 'Audio',
      stock: 75,
      rating: 4.6,
      reviews: 890,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 6,
      name: 'Dell XPS 13',
      description: 'Ultrabook with InfinityEdge display and Intel Core i7',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      category: 'Computers',
      stock: 40,
      rating: 4.4,
      reviews: 650,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  private mockCategories: Category[] = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      image: 'https://via.placeholder.com/200x200/007ACC/FFFFFF?text=Electronics'
    },
    {
      id: 2,
      name: 'Computers',
      description: 'Laptops, desktops and accessories',
      image: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Computers'
    },
    {
      id: 3,
      name: 'Fashion',
      description: 'Clothing and accessories',
      image: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Fashion'
    },
    {
      id: 4,
      name: 'Audio',
      description: 'Headphones, speakers and audio equipment',
      image: 'https://via.placeholder.com/200x200/96CEB4/FFFFFF?text=Audio'
    }
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    // Simulate API call delay
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.mockProducts);
        observer.complete();
      }, 500);
    });
  }

  getProductById(id: number): Observable<Product | undefined> {
    return new Observable(observer => {
      setTimeout(() => {
        const product = this.mockProducts.find(p => p.id === id);
        observer.next(product);
        observer.complete();
      }, 300);
    });
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const products = this.mockProducts.filter(p => p.category === category);
        observer.next(products);
        observer.complete();
      }, 400);
    });
  }

  searchProducts(query: string): Observable<Product[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const products = this.mockProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        );
        observer.next(products);
        observer.complete();
      }, 300);
    });
  }

  getCategories(): Observable<Category[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.mockCategories);
        observer.complete();
      }, 200);
    });
  }

  getFeaturedProducts(): Observable<Product[]> {
    return new Observable(observer => {
      setTimeout(() => {
        const featured = this.mockProducts.filter(p => p.rating >= 4.7);
        observer.next(featured);
        observer.complete();
      }, 400);
    });
  }
}

