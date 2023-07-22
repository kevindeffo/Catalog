import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ProductModel } from '../model/products.model';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productId! : string;
  currentProduct!:ProductModel;
  productFormGroup!: FormGroup;

  constructor(private route: ActivatedRoute, private productService: ProductService, private fb: FormBuilder) {
    this.productId = route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId).subscribe({
      next:(value)=>{
          this.currentProduct = value;
          this.productFormGroup = this.fb.group(
            {
              name: this.fb.control(this.currentProduct.name, [Validators.required, Validators.minLength(3)]),
              price: this.fb.control(this.currentProduct.price, [Validators.required, Validators.min(100)]),
              promotion: this.fb.control(this.currentProduct.promotion, [Validators.required])
            }
          )
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  getErrorMessage(field: string, errors: ValidationErrors){
    if(errors['required']){
      return field + " is required";
    }else if(errors['minlength']){
      return field + " should have at list " + errors['minlength']['requiredLength']+" Charaters"
    }else if(errors['min']){
      return field + " should have min value "+errors['min']['min']
    }
    else{
      return "";
    }

  }

  handleUpdateProduct(){
    let product = this.productFormGroup.value;
    product.id = this.currentProduct.id;
    this.productService.updateProduct(product).subscribe({
      next: (val)=>{

      },
      error: (err)=>{
        
      }
    })
  }

}
