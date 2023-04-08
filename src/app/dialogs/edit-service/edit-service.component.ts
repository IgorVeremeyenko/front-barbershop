import { AfterViewInit, Component, Input } from '@angular/core';
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
export class EditServiceComponent implements AfterViewInit {

  @Input() displayModal: boolean = false;
  
  @Input() service_object!: Service;

  myForm!: FormGroup;

  filterValue = '';

  serviceOptions: any[] = [];

  isSubmiting = false;

  isLoaded = false;

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
        // this.serviceObj = values;
              
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
    });   
    
    
    
    
  }
  ngAfterViewInit(): void {
    // this.service_object$.subscribe(obj => {
    //   this.serviceObj = obj;
    // });
  }

  submit(){
    console.log(this.myForm.value.serviceName)
    this.isSubmiting = true;
    this.service_object.name = this.myForm.value.serviceName;
    this.service_object.price = this.myForm.value.servicePrice;
    this.service_object.category = this.myForm.value.serviceCategory;
    this.changeService();
  }

  changeService(){
    console.log(this.service_object)
    this.dataService.changeServiceById(this.service_object.id, this.service_object).subscribe(res => {
      this.msg.showSuccess('Успешные изменения!');
      this.displayModal = false;
      this.isSubmiting = false;
    })
  }

  hide(){
    this.serviceOptions = [];
    this.dialogService.showModalEditService.emit(false);
    this.myForm.reset();
  }

  click(event: any){
  }

}
