import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-enter-otp',
  templateUrl: './enter-otp.component.html',
  styleUrls: ['./enter-otp.component.css']
})
export class EnterOtpComponent {
  
  otp: FormGroup;

  visible = false;

  isValid = false;

  isShown = true;

  constructor(private dataService: DataService, private authService: AuthService, private mesgs: MyMessageService, private router: Router, private dialogService: DialogService){
    this.otp = new FormGroup({
      code: new FormControl("", [Validators.required, Validators.minLength(6)])
    })
    this.dialogService.showModalEnterOtp.subscribe(value => {
      this.visible = value;
    })

  }

  onSubmit(){
    this.isShown = false;
    this.authService.validateOtp(this.otp.value.code).subscribe(result => {
      this.dialogService.transferIdForAdmin.emit(result.code)
      this.router.navigateByUrl('password');
      this.isShown = true;
    }, er => {this.mesgs.showError(er); this.isShown = true}, () => this.isShown = true)
  }

  complete(event: any){
    const length = this.dataService.countDigitsInString(event.target.value);
    if(this.otp.valid && length == 6){
      this.isValid = true;
    }
    else {
      this.isValid = false;
    }
  }

}
