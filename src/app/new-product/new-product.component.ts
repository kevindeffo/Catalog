import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  productFormGroup!: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) { }

  ngOnInit(): void {
    this.productFormGroup = this.fb.group(
      {
        name: this.fb.control(null, [Validators.required, Validators.minLength(3)]),
        price: this.fb.control(null, [Validators.required, Validators.min(100)]),
        promotion: this.fb.control(false, [Validators.required])
      }
    )
  }

  handleSaveProduct(){
    let product = this.productFormGroup.value;
    this.productService.addNewProduct(product).subscribe({
      next: (value)=>{
        alert("Product add successfully");
        this.productFormGroup.reset();
      },
      error: err =>{
        console.log(err);
      }
    });
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

}
