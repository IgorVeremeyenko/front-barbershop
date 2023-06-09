import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Master } from 'src/app/interfaces/master';
import { Schedule } from 'src/app/interfaces/schedule';
import { Service } from 'src/app/interfaces/service';
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

  selectedDays: any[] = [];

  days: any[] = [];

  myForm!: FormGroup;

  suggestions: any[] = [];

  isSubmiting = false;

  isWrong = false;

  suggestionsService: any[] = [];

  suggestionNames: any[] = [];

  serviceList: any[] = [];

  serviceNames: any[] = [];

  allServices: Service[] = [];

  price: number = 0;

  schedule!: Schedule;

  constructor(private dialogService: DialogService, private dataService: DataService, private msg: MyMessageService) {
    this.dialogService.showModalAddNewMaster.subscribe(value => {
      if (value) {
        this.displayModal = true;
        this.dataService.getServices().subscribe(services => {
          this.allServices = services;
          services.map(service => {
            this.serviceList.push(service.category);
          })
          const uniqueValues = [...new Set(this.serviceList)];
          this.serviceList = uniqueValues;
          const uniqueServices = [...new Set(this.allServices)];
          this.allServices = uniqueServices;
        })
      }
    })
    this.myForm = new FormGroup({
      "userName": new FormControl("", Validators.required),
      "userPhone": new FormControl("", [Validators.required, Validators.pattern(/^\+\d{2}\s\(\d{3}\)\s\d{3}-\d{5}$/)]),
      "userWorkDays": new FormControl([], Validators.required),
      "correctName": new FormControl(false, [Validators.required, Validators.requiredTrue]),
      "serviceCategory": new FormControl(""),
      "serviceName": new FormControl("")
    });
    this.dataService.getDays().subscribe(value => {
      this.days = value;
    })

    
    this.myForm.valueChanges.subscribe((value) => {
      const name = this.allServices.filter(item => item.category === value.serviceCategory);
      this.serviceNames = name;
      this.searchDublicates();
      if (this.myForm.get('serviceCategory')?.valid && this.myForm.get('serviceName')?.valid) {
        const mast = this.allServices.find(element => element.name === this.myForm.value.serviceName.name)?.price;
        this.price = mast;
      }
      if (!this.myForm.get('serviceCategory')?.valid) {
        this.serviceNames = [];
      }
    })
  }
  hide() {
    this.displayModal = false;
    this.allServices = [];
    this.serviceList = [];
    this.serviceNames = [];
    this.isWrong = false;
    this.myForm.reset();
  }
  submit() {
    const body: Master = {
      id: 0,
      name: this.myForm.value.userName,
      phone: this.myForm.value.userPhone,
      userId: this.dataService.USER_ID,
    };
    this.dataService.addNewMaster(body).subscribe(value => {

      const bodyService: Service = {
        id: 0,
        name: this.myForm.value.serviceName.name,
        price: this.price,
        userId: this.dataService.USER_ID,
        masterId: value.id,
        category: this.myForm.value.serviceCategory,
        status: ''
      }
      this.addSchedule(value.id);
      this.dataService.addNewService(bodyService).subscribe(() => {
        this.dialogService.isUpdatedEditMaster.emit(true);
        this.hide();
      })
    }, error => {
      this.msg.showError(`Что-то пошло не так... ${error}`);
      this.hide();
    })


  }

  addSchedule(id: number) {
    this.selectedDays = this.myForm.value.userWorkDays;
    this.selectedDays.map(item => {
      this.schedule = {
        id: 0,
        masterId: id,
        dayOfWeek: item.payload
      }
      this.dataService.postSchedule(this.schedule).subscribe((result) => {
      }, er => console.log(er))
    })
  }

  onClick($event: any) {
  }

  search(name: any) {
    this.dataService.getMasterByName(name.query).subscribe(value => {
      this.isWrong = true;
      this.myForm.get('correctName')?.setValue(false);
      this.suggestions = [];
    }, () => {
      this.isWrong = false;
      this.myForm.get('correctName')?.setValue(true);
      this.suggestions = [];
    })

  }

  searchCategories(event: any) {
    const query = event.query;
    this.suggestionsService = this.serviceList.filter((item) =>
      item.toLowerCase().startsWith(query.toLowerCase())
    );
  }

  searchDublicates() {

    const uniqueArray: any[] = [];

    const encounteredNames: any = {};

    this.serviceNames.forEach(obj => {
      
      if (!encounteredNames[obj.name]) {
        
        uniqueArray.push(obj);
        
        encounteredNames[obj.name] = true;
      }
    });
    this.serviceNames = uniqueArray;
  }
}
