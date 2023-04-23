import { Component } from '@angular/core';
import { Appointment } from 'src/app/interfaces/appointment';
import { Service } from 'src/app/interfaces/service';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { IN_PROGRESS } from 'src/assets/constants';

interface Mast {
  id: number,
  name: string,
  category: string,
  service: [
    { name: string, category: string }
  ],
  days: [
    { dayOfWeek: string }
  ],
  phone: ''
} 

@Component({
  selector: 'app-master-edit',
  templateUrl: './master-edit.component.html',
  styleUrls: ['./master-edit.component.css']
})
export class MasterEditComponent {

  visible = false;

  appointments: Appointment[] = [];

  services: Service[] = [];

  total = 0;

  editingSchedule = false;

  editingPhone = false;

  editField: any;

  isEditing = true;

  selectedDays: any[] = [];

  master: Mast = {
    id: 0,
    name: '',
    category: '',
    days: [{
      dayOfWeek: ''
    }],
    service: [
      { name: '', category: '' }
    ],
    phone: ''
  };

  constructor(private dialogService: DialogService, private dataService: DataService){
    this.dialogService.transferEditMasterDetails.subscribe(params => {
      this.master = params;
    })
    this.dialogService.showModalEditMaster.subscribe(value => {
      this.visible = value;
      this.totalCurrentAppointments();
    });
    this.dataService.getAppointments().subscribe(app => this.appointments = app);
    this.dataService.getServices().subscribe(app => this.services = app);
  }

  
  hide(){
    this.total = 0;
  }
  totalCurrentAppointments(){
    const serv = this.services.filter(item => item.masterId === this.master.id);
    serv.map(item => {
      this.total += this.appointments.filter(t => t.serviceId === item.id && t.status === IN_PROGRESS).reduce(acc => acc + 1, 0);
    })
  }
  // onEdit(content: any){
  //   switch(content){
  //     case 'phone': {
  //       this.editingPhone = true;
  //       // this.dataService.changeMasterById(this.master.id, this.master)
  //     }
  //   }
    
    
  // }
  // onSave(){

  // }
  // onCancel(){
  //   this.editingPhone = false;
  // }
  // onComplete(){
  //   if(this.editField.length < 19){
  //     this.isEditing = true;
  //   }
  //   else {
  //     this.isEditing = false;
  //   }
  // }

  // onInput(ev: any){
  //   // console.log(ev)
  // }
  
}
