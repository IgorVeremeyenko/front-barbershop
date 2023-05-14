import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from 'src/app/interfaces/admin';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  providers: [MyMessageService]
})
export class PasswordComponent {

  reset!: FormGroup;

  isValid = false;

  isShown = true;

  constructor(private dataService: DataService, private dialogService: DialogService, private authService: AuthService, private msg: MyMessageService, private router: Router){
    this.reset = new FormGroup({
      password: new FormControl("", [Validators.minLength(6), Validators.required]),
      confirmPassword: new FormControl("", [Validators.minLength(6), Validators.required]),
    })
    this.reset.valueChanges.subscribe(() => {
      if(this.reset.valid && this.password(this.reset)){
        this.isValid = true;
      }
      else {
        this.isValid = false;
      }
    })
    this.dialogService.transferIdForAdmin.subscribe(id => {
      this.dataService.ADMIN_ID_FOR_RESET_PASS = id;
    })

  }

  password(formGroup: FormGroup) {
    const pass = formGroup.value.password;
    const confirm = formGroup.value.confirmPassword;
    return pass === confirm;
  }

  onSubmit(){
    this.isShown = false;
    let correct = this.password(this.reset);
    const editAdmin: Admin = {
      id: this.dataService.ADMIN_ID_FOR_RESET_PASS,
      name: 'user',
      password: this.reset.value.password,
      email: 'user'
    }
    if(correct){
      
      this.authService.editAdminById(this.dataService.ADMIN_ID_FOR_RESET_PASS, editAdmin).subscribe(result => {
        this.msg.showSuccess('Пароль успешно изменен');
        this.router.navigateByUrl('');
        this.isShown = true;
      }, er => {this.msg.showError(er); this.isShown = true}, () => this.isShown = true)
    }
  }

  goToLogin(){
    this.router.navigateByUrl('login');
  }

}
