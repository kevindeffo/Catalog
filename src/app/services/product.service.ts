import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { PageProduct, ProductModel } from '../model/products.model';
import { UUID } from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products! : Array<ProductModel>;

  constructor(){
    this.products = [
      {id: UUID.UUID(), name: "computer", price: 20000, promotion:true},
      {id: UUID.UUID(), name: "mouse", price: 2000, promotion: false},
      {id: UUID.UUID(), name: "bag", price: 8000, promotion: true}
    ]

    for(let i = 0; i<10; i++){
      this.products.push({id: UUID.UUID(), name: "computer", price: 20000, promotion:true});
      this.products.push({id: UUID.UUID(), name: "mouse", price: 3000, promotion: false});
      this.products.push({id: UUID.UUID(), name: "bag", price: 8000, promotion: true});
    }
  }

  public getAllProducts() : Observable<Array<ProductModel>>{
    let rnd = Math.random();
    if(rnd < 0.1){
      return throwError(()=>new Error('internal Server error'));
    }else{
      return of([...this.products]);
    }

  }

  public getPageProducts(page:number, size:number) : Observable<PageProduct>{
    let index = page*size;
    let totalPages = ~~(this.products.length/size);
    this.products.length % size? totalPages++:null;
    let pageProducts = this.products.slice(index, index+size);
    return of({page:page, size:size, totalPages:totalPages, products:pageProducts});
  }

  public deleteProduct(id: string) : Observable<boolean>{
    this.products = this.products.filter(p => p.id != id);
    return of(true);
  }

  public setPromotion(id: string): Observable<boolean>{
    let product = this.products.find(p=>p.id ==  id);
    if(product != undefined){
      product.promotion = !product.promotion;
      return of(true);
    } else{
      return throwError(()=>new Error('product not found'));
    }
  }

  public searchProduct(keyword: string, page:number, size:number) : Observable<PageProduct>{
    let result = this.products.filter(p=>p.name.includes(keyword));
    let index = page*size;
    let totalPages = ~~(result.length/size);
    this.products.length % size? totalPages++:null;
    let pageProducts = result.slice(index, index+size);
    return of({page:page, size:size, totalPages:totalPages, products:pageProducts});
  }

  public addNewProduct(product: ProductModel): Observable<ProductModel>{
    product.id = UUID.UUID();
    this.products.push(product);
    return of(product);
  }

  public getProductById(id: string): Observable<ProductModel>{
    let product = this.products.find(p => p.id == id);
    if(product == undefined) return throwError(()=> new Error("Product not found"));
    return of(product);
  }

  public updateProduct(product: ProductModel): Observable<ProductModel>{
    this.products = this.products.map(p => p.id == product.id?product:p)
    return of(product);
  }

}
