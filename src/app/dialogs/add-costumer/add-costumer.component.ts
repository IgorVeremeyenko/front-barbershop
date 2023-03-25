import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Costumer } from 'src/app/interfaces/costumer';
import { DataService } from 'src/app/services/data.service';
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

  constructor(private dataService: DataService, private msg: MyMessageService){

    this.dataService.showModalAddNewCostumer.subscribe(value => {
      this.displayModal = value;
      console.log(this.myForm.value.userPhone)
    })

    this.myForm = new FormGroup({
      "userName": new FormControl("", Validators.required),
      "userPhone": new FormControl("", [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]),
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
      userId: this.dataService.USER_ID
    }
    this.dataService.addNewCostumer(body).subscribe(result => {
      console.log(result);
      this.isSubmiting = false;
      this.msg.showSuccess('Успешно добавлен');
      this.displayModal = false;
      this.dataService.isAddedNewCostumer.emit(true);
    }, error => {
      this.msg.showError('Что-то погло не так...');
      console.log(error);
    })
  }
  

}
