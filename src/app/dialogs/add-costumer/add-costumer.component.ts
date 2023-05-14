import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Costumer } from 'src/app/interfaces/costumer';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-add-costumer',
  templateUrl: './add-costumer.component.html',
  styleUrls: ['./add-costumer.component.css'],
  providers: [MyMessageService]
})
export class AddCostumerComponent {

  @Input() displayModal: boolean = false;

  myForm!: FormGroup;

  isSubmiting = false;

  languages: any[] = [];

  selectedCountry: any;

  constructor(private dataService: DataService, private msg: MyMessageService, private dialogService: DialogService){

    this.dialogService.showModalAddNewCostumer.subscribe(value => {
      this.displayModal = value;
    })

    this.myForm = new FormGroup({
      "userName": new FormControl("new costumer", Validators.required),
      "userPhone": new FormControl("", [Validators.required, Validators.pattern(/^\+\d{2}\s\(\d{3}\)\s\d{3}-\d{5}$/)]),
      "userLang": new FormControl("Русский"),
      "userEmail": new FormControl("", Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    });


    this.dataService.getCountries().subscribe(result => {
      this.languages = result;
    })

    this.myForm.valueChanges.subscribe(res => {
      this.selectedCountry = res.userLang;
    })

  }

  submit(){
    this.isSubmiting = true;
    const body: Costumer = {
      id: 0,
      name: this.myForm.value.userName,
      email: this.myForm.value.userEmail || '',
      phone: this.myForm.value.userPhone,
      language: this.myForm.value.userLang || 'Русский',
      userId: this.dataService.USER_ID,
      rating: 0,
      appointments: []
    }
    this.dataService.addNewCostumer(body).subscribe(result => {
      this.isSubmiting = false;
      this.msg.showSuccess('Успешно добавлен');
      this.displayModal = false;
      this.dialogService.isAddedNewCostumer.emit(true);
    }, error => {
      this.msg.showError('Что-то погло не так...');
      console.log(error);
    })
  }
  

}
