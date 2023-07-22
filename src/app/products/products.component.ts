import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductModel } from '../model/products.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

products! : Array<ProductModel>;
errorMessage! : String;
searchFormGroup! : FormGroup;
currentPage : number=0;
pageSize: number=5;
totalPages: number=0;
currentAction: String= "all";

  constructor( private productService : ProductService, private fb : FormBuilder, public authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(null)
    });
    this.getAPageProducts();
  }

  getAPageProducts(){
    this.productService.getPageProducts(this.currentPage,this.pageSize).subscribe({
      next: (data)=>{
        this.products = data.products;
        this.totalPages = data.totalPages;
        console.log(this.totalPages);

      },
      error: (err)=>{
        this.errorMessage =  err;
      }
    });
  }

  getAllProducts(){
    this.productService.getAllProducts().subscribe({
      next: (data)=>{
        this.products = data;
      },
      error: (err)=>{
        this.errorMessage =  err;
      }
    });
  }

  handleDeleteProduct(p : ProductModel){
    let conf = confirm("Are you sure ?");
    if(conf == false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next: ()=>{
        // this.getAllProducts();
        let index = this.products.indexOf(p);
        this.products.splice(index, 1);
      }
    });
  }

  handleSetPromotion(p: ProductModel){
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next:(val)=>{
        p.promotion = !promo;
      },
      error: (error)=>{
        this.errorMessage = error;
      }
    });
  }

  handleSearchProducts(){
    this.currentAction = "search";
    this.currentPage = 0;
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProduct(keyword, this.currentPage, this.pageSize).subscribe({
      next: (data)=>{
        this.products = data.products
        this.totalPages = data.totalPages;
        console.log(this.totalPages);
      }
    });
  }

  gotoPage(i: number){
    this.currentPage = i;
    if(this.currentAction === "all")
      this.getAPageProducts();
    else
      this.handleSearchProducts
  }

  handleNewProduct(){
    this.router.navigateByUrl('/admin/newProduct')
  }

  handleEditProduct(p: ProductModel){
    this.router.navigateByUrl("/admin/editProduct/"+p.id);
  }

}
