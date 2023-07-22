import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  userFormGroup! : FormGroup;
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private authenticateService : AuthenticationService,
    private router: Router
    ) { }


    public initUserForm(){
      this.userFormGroup = this.fb.group({
        username: this.fb.control(""),
        password: this.fb.control("")
      }
      )
    }
  ngOnInit(): void {
    this.initUserForm();
  }

  handleLogin() {
    let username = this.userFormGroup.value.username;
    let password = this.userFormGroup.value.password;

    this.authenticateService.login(username, password).subscribe({
      next: (user) =>{
        this.authenticateService.authenticateUser(user).subscribe({
          next:(value)=>{
            this.router.navigateByUrl("/admin");
          },
          error: (err)=>{
            this.errorMessage = err;
          }
        })
      },
      error: (err)=>{
        this.errorMessage = err;
      }
    });
  }

}
