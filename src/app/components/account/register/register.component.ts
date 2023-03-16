import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Admin } from 'src/app/interfaces/admin';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm !: FormGroup;
  submitted = true;

  constructor(private authService: AuthService){
    this.registerForm = new FormGroup({
      username: new FormControl("Ivan", Validators.required),
      password: new FormControl("", [Validators.minLength(8), Validators.required]),
      confirmPassword: new FormControl("", [Validators.minLength(8), Validators.required])
    })
  }

  password(formGroup: FormGroup) {
    const pass = formGroup.get('password');
    const confirm = formGroup.get('confirmpassword');
    return pass === confirm ? null : { passwordNotMatch: true };
  }

  onSubmit(){
    const newAdmin: Admin = {
      userName: this.registerForm.value.username,
      Password: this.registerForm.value.password
    }
    this.authService.registerUser(newAdmin).subscribe(res => {
      console.log(res);
    })
  }

}
