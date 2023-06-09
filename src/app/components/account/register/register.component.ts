import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from 'src/app/interfaces/admin';
import { AuthService } from 'src/app/services/auth.service';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MyMessageService]
})
export class RegisterComponent {

  registerForm !: FormGroup;
  submitted = true;
  isValid = false;
  isShown = false;

  constructor(private authService: AuthService, private mesgs: MyMessageService, private router: Router){
    this.registerForm = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", [Validators.minLength(6), Validators.required]),
      confirmPassword: new FormControl("", [Validators.minLength(6), Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    })

    this.registerForm.valueChanges.subscribe(changes => {
      if(this.registerForm.valid && this.password()){
        this.isValid = true;
      }
      else {
        this.isValid = false;
      }
    })
    this.authService.blockMenu.emit(true);
  }

  password() {
    const pass = this.registerForm.value.password;
    const confirm = this.registerForm.value.confirmPassword;
    return pass === confirm;
  }

  onSubmit(){
    this.isShown = true;
    const newAdmin: Admin = {
      id: 0,
      name: this.registerForm.value.username,
      password: this.registerForm.value.password,
      email: ''
    }
    let correct = this.password();
    if(correct){
      this.authService.registerUser(newAdmin).subscribe(res => {
        this.isShown = false
        this.mesgs.showSuccess('Успешная регистрация');
        this.authService.login(newAdmin).subscribe(success => {
          this.mesgs.showInfo('Идет перенаправление');
          this.router.navigateByUrl('');
        },err => console.log(err))
      },err => {
        if(err.status === 500){
          this.mesgs.showError('Пользователь уже зарегистрирован');
          this.isShown = false;
        }
        else {

          this.mesgs.showError(err);
        }
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
