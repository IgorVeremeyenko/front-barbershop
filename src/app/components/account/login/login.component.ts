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

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private mesgs: MyMessageService) { }

  ngOnInit() {
    this.authService.setAuthStatus(false);
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  submitLoginForm() {
    const body: Admin = {
      userName: this.loginForm.value.userName,
      Password: this.loginForm.value.Password
    }
    this.authService.login(body).subscribe(items => {
      console.log(items);
      this.router.navigateByUrl('');
    },error => {
      this.mesgs.showError(error.error)
      if(error.status === 404){
      }
    })
  }

  click(){
    this.mesgs.showError('click')
  }
  
}
