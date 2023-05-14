import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from 'src/app/interfaces/admin';
import { AuthService } from 'src/app/services/auth.service';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MyMessageService]
})
export class LoginComponent {

  loginForm!: FormGroup;

  isValid = false;

  isShown = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private mesgs: MyMessageService) { }

  ngOnInit() {
    this.authService.setAuthStatus(false);
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      
    });

    this.loginForm.valueChanges.subscribe(changed => {
      if(this.loginForm.valid){
        this.isValid = true;
      }
      else {
        this.isValid = false
      }
    })
    this.authService.blockMenu.emit(true);
  }

  submitLoginForm() {
    this.isShown = true;
    const body: Admin = {
      id: 0,
      name: this.loginForm.value.userName,
      password: this.loginForm.value.Password,
      email: ''
    }
    this.authService.login(body).subscribe(items => {
      this.router.navigateByUrl('');
      this.isShown = false;
    },error => {
      setTimeout(() => {
        if(error.error === "User not found"){

          this.mesgs.showError("Логин и/или пароль неверные");
        }
        else {
          
          this.mesgs.showError(error.error);
        }
        this.isShown = false;
        if(error.status === 404){
        }
      }, 500);
    })
  }

  click(){
    this.mesgs.showError('click')
  }

  goToRegistration(){
    this.router.navigateByUrl('registration');
  }

  resetPassword(){
    this.router.navigateByUrl('reset-password');
  }
  
}
