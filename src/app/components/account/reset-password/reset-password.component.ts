import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from 'src/app/interfaces/admin';
import { AuthService } from 'src/app/services/auth.service';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [MyMessageService]
})
export class ResetPasswordComponent {
  registerForm !: FormGroup;
  submitted = true;
  isValid = false;
  isShown = false;

  constructor(private authService: AuthService, private mesgs: MyMessageService, private router: Router){
    this.registerForm = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", [Validators.minLength(6), Validators.required]),
      confirmPassword: new FormControl("", [Validators.minLength(6), Validators.required])
    })

    this.registerForm.valueChanges.subscribe(changes => {
      if(this.password(this.registerForm) && this.registerForm.value.password.length > 0){
        this.isValid = true;
      }
      else {
        this.isValid = false;
      }
    })
    this.authService.blockMenu.emit(true);
  }

  password(formGroup: FormGroup) {
    const pass = formGroup.value.password;
    const confirm = formGroup.value.confirmPassword;
    return pass === confirm;
  }

  onSubmit(){
    this.isShown = true;
    const newAdmin: Admin = {
      userName: this.registerForm.value.username,
      Password: this.registerForm.value.password
    }
    let correct = this.password(this.registerForm);
    if(correct){
      this.authService.resetPassword(newAdmin).subscribe(res => {
        console.log(res);
        this.isShown = false
        this.authService.login(newAdmin).subscribe(success => {
          this.mesgs.showInfo('Идет перенаправление');
          this.router.navigateByUrl('');
        },err => console.log(err))
      },err => {
       
        this.mesgs.showError(err);
        setTimeout(() => {
          this.isShown = false;
        }, 1000);
      })
    }
    else {
      this.mesgs.showError('Пароли не совпадают');
      this.isShown = false;
    }
    
  }

  goToLogin(){
    this.router.navigateByUrl('login');
  }
}
