import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiceClass } from 'src/app/classes/classes.module';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.css']
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

  constructor(private dataService: DataService, private dialogService: DialogService){

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
      "masterID": new FormControl("", Validators.required)
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
    //
  }

  submit(){
    // const service_obj: ServiceClass = new ServiceClass(
    //   0,
    //   this.myForm.value.serviceName,
    //   this.myForm.value.servicePrice,
    //   0,
    //   this.myForm.value.masterID
    // )
    console.log(this.myForm)
  }

  getMasterInfo(event: any){
    console.log(event)
  }

  openNewMasterModal(){

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
