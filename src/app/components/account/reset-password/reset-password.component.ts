import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPassword } from 'src/app/interfaces/reset-password';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog.service';
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
  isShown = true;

  constructor(private authService: AuthService, private mesgs: MyMessageService, private router: Router, private dialogService: DialogService){
    this.registerForm = new FormGroup({
      login: new FormControl("", Validators.required),      
      email: new FormControl("", [Validators.email, Validators.required])
    })

    this.registerForm.valueChanges.subscribe(changes => {
      if(this.registerForm.valid){
        this.isValid = true;
      }
      else {
        this.isValid = false;
      }
    })
    this.authService.blockMenu.emit(true);
  }

  onSubmit(){
    this.isShown = false;
    const resetAdmin: ResetPassword = {
      login: this.registerForm.value.login,
      email: this.registerForm.value.email
    }
    this.authService.sendCodeForAdmin(resetAdmin).subscribe(result => {
      this.mesgs.showSuccess(result);
      this.isShown = true;
      this.dialogService.showModalEnterOtp.emit(true);
      this.dialogService.transferEmailToModalOTP.emit(resetAdmin.email);
      
    }, error => {this.mesgs.showError(error); this.isShown = true}, () => this.isShown = true)
        
  }

  goToLogin(){
    this.router.navigateByUrl('login');
  }

}
