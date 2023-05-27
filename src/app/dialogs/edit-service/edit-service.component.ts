import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from 'src/app/interfaces/service';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-edit-service',
  templateUrl: './edit-service.component.html',
  styleUrls: ['./edit-service.component.css'],
  providers: [MyMessageService]
})
export class EditServiceComponent {

  displayModal: boolean = false;
  
  service_object!: Service;

  myForm!: FormGroup;

  serviceOptions: string[] = [];

  isSubmiting = false;

  isLoaded = false;

  suggestions: Service[] = [];

  isChahgedCategory = false;

  constructor(private dataService: DataService, private msg: MyMessageService, private dialogService: DialogService){

    this.dialogService.transferServiceObject.subscribe(obj => {
      this.service_object = obj;
      this.dataService.getServices().subscribe(ser => {
        const arr = new Array;
        ser.map(item => {
          arr.push(item.category);            
        });
        let uniqueArr = arr.filter((elem, index) => {
          return arr.indexOf(elem) === index;
        });
        this.serviceOptions = uniqueArr;
    })
      this.myForm = new FormGroup({
        "serviceName": new FormControl(this.service_object.name, Validators.required),
        "servicePrice": new FormControl(this.service_object.price, Validators.required),
        "serviceCategory": new FormControl(this.service_object.category, Validators.required)
      });
      
    })

  }

  ngOnInit(){   
    this.dialogService.showModalEditService.subscribe(modal => {      
      this.displayModal = modal;
      this.isLoaded = true;   
      let defaultName = this.service_object.category;
      this.myForm.valueChanges.subscribe(value => {
        if(value.serviceCategory != defaultName){
          this.isChahgedCategory = true;
          defaultName = this.myForm.get('serviceCategory')?.value;
          this.myForm.get('serviceName')?.setValue("");
        }
      })
    });   
    
  }
 
  submit(){
    this.isSubmiting = true;
    this.service_object.name = this.myForm.value.serviceName.name;
    this.service_object.price = this.myForm.value.servicePrice;
    this.service_object.category = this.myForm.value.serviceCategory;
    this.changeService();
  }

  changeService(){
    this.dataService.changeServiceById(this.service_object.id, this.service_object).subscribe(res => {
      this.dialogService.isDataChangedForEditServiceComponent.emit(true);
      this.msg.showSuccess('Успешные изменения!');
      this.displayModal = false;
      this.isSubmiting = false;
    }, ()=> {this.displayModal = false; this.isSubmiting = false}, () => {this.displayModal = false; this.isSubmiting = false})
  }

  hide(){
    this.serviceOptions = [];
    this.dialogService.showModalEditService.emit(false);
    this.myForm.reset();
  }

  search(){
    this.dataService.getServicesFilteredByCategory(this.myForm.value.serviceCategory).subscribe(res => {
      this.suggestions = res;
    })
  }

}
