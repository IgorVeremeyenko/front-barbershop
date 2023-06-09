import { Component } from '@angular/core';
import { Master } from 'src/app/interfaces/master';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-phone-field',
  templateUrl: './phone-field.component.html',
  styleUrls: ['./phone-field.component.css']
})
export class PhoneFieldComponent {

  editField: any;

  isEditing = false;

  editingPhone = false;

  master: Master = {
    id: 0,
    name: '',
    phone: '',
    userId: this.dataService.USER_ID
  };

  constructor(private dialogService: DialogService, private dataService: DataService){
    this.dialogService.transferEditMasterDetails.subscribe(value => {
      this.master = value;
    })
  }

  onComplete(){
    if(this.editField.length < 19){
      this.isEditing = true;
    }
    else {
      this.isEditing = false;
    }
  }

  onInput(event: any){
    this.checkInput(event.target.value)
  }

  checkInput(value: any){
    if (value.length === 19) {
      this.isEditing = true;
    }
    else {
      this.isEditing = false;
    }
  }

  onEdit(){
    this.editingPhone = true;
    this.isEditing = true;
  }

  onSave(){
    this.isEditing = true;
    this.master.phone = this.editField;
    this.dataService.changeMasterById(this.master.id, this.master).subscribe(result => {
      this.editingPhone = false;
      this.isEditing = false;
      this.editField = null;
    })
  }

  onCancel(){
    this.editingPhone = false;
  }

}
