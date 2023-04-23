import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Master } from 'src/app/interfaces/master';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-add-master',
  templateUrl: './add-master.component.html',
  styleUrls: ['./add-master.component.css'],
  providers: [MyMessageService]
})
export class AddMasterComponent {

  displayModal = false;

  myForm!: FormGroup;

  isSubmiting = false;

  constructor(private dialogService: DialogService, private dataService: DataService, private msg: MyMessageService){
    this.dialogService.showModalAddNewMaster.subscribe(value => {
      if(value) this.displayModal = true;
    })
    this.myForm = new FormGroup({
      "userName": new FormControl("", Validators.required),
      "userPhone": new FormControl("", [Validators.required, Validators.pattern(/^\+\d{2}\s\(\d{3}\)\s\d{3}-\d{5}$/)])
    });
  }
  hide(){
    this.displayModal = false;
  }
  submit(){
    const body: Master = {
      id: 0,
      name: this.myForm.value.userName,
      phone: this.myForm.value.userPhone
    };
    this.dataService.addNewMaster(body).subscribe(value => {
      this.hide();
      this.msg.showSuccess('Успешно добавлен!')
    }, error => {
      this.msg.showError(`Что-то пошло не так... ${error}`)
    })
  }
}
