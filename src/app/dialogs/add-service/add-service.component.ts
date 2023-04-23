import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from 'src/app/interfaces/service';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css'],
  providers: [MyMessageService]
})
export class AddServiceComponent {

  isSubmiting = false;

  myForm!: FormGroup;

  displayModal = false;

  masterList: any[] = [];

  serviceList: any[] = [];

  serviceNames: any[] = [];

  suggestions: any[] = [];
  
  suggestionNames: any[] = [];

  selectedMaster: any;

  isLoading = false;

  constructor(
    private dataService: DataService, 
    private dialogService: DialogService, 
    private msg: MyMessageService
    ){

    this.dataService.getMasters().subscribe(masters => {
      const arr = new Array;
        masters.map(item => {
          arr.push(item);            
        });
        let uniqueArr = arr.filter((elem, index) => {
          return arr.indexOf(elem) === index;
        });
        this.masterList = uniqueArr;
    })

    this.dataService.getServices().subscribe(services => {
      services.map(service => {
        this.serviceList.push(service.category);
        this.serviceNames.push(service.name);
      })
      const uniqueValues = [...new Set(this.serviceList)];
      this.serviceList = uniqueValues
    })

    this.myForm = new FormGroup({
      "serviceName": new FormControl("", Validators.required),
      "servicePrice": new FormControl("", Validators.required),
      "serviceCategory": new FormControl("", Validators.required),
      "masterID": new FormControl("", Validators.required),
      "isSubmiting": new FormControl(true, Validators.required)
    });

    this.myForm.valueChanges.subscribe(res => {
      this.selectedMaster = res.id;
    })
  }

  ngOnInit(){
    this.dialogService.showModalAddService.subscribe(value => {
      this.displayModal = value;  
    });
  }

  hide(){
    this.displayModal = false;
  }

  submit(){
    this.myForm.get('isSubmiting')?.setValue(null);
    const body: Service = {
      id: 0,
      name: this.myForm.value.serviceName,
      price: this.myForm.value.servicePrice,
      userId: this.dataService.USER_ID,
      masterId: this.myForm.value.masterID.id,
      category: this.myForm.value.serviceCategory,
      status: ''
    }
    this.dataService.addNewService(body).subscribe(result => {
      console.log(result);
      this.msg.showSuccess('Успешно добавлено');
      this.myForm.get('isSubmiting')?.setValue(true);
      this.hide();
    }, error => console.log(error))
    console.log(this.myForm)
  }

  getMasterInfo(event: any){
    console.log(event)
  }

  openNewMasterModal(){
    this.dialogService.showModalAddNewMaster.emit(true);
  }

  search(event: any){
    const query = event.query;
    this.suggestions = this.serviceList.filter((item) =>
      item.toLowerCase().startsWith(query.toLowerCase())
    );
  }

  searchDublicates(event: any){
    const query = event.query;
    this.suggestionNames = this.serviceNames.filter((item) =>
      item.toLowerCase().startsWith(query.toLowerCase())
    );
  }

}
