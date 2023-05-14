import { Component } from '@angular/core';
import { Appointment } from 'src/app/interfaces/appointment';
import { MasterList } from 'src/app/interfaces/master-list';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-master-edit',
  templateUrl: './master-edit.component.html',
  styleUrls: ['./master-edit.component.css']
})
export class MasterEditComponent {

  visible = false;

  total = 0;

  selectedDays: any[] = [];

  isLoading = false;

  master: MasterList = {
    id: 0,
    name: '',
    category: [],
    phone: '',
    days: []
  };

  constructor(private dialogService: DialogService, private dataService: DataService){
    this.dialogService.transferEditMasterDetails.subscribe(params => {
      this.master = params;
    })
    this.dialogService.showModalEditMaster.subscribe(value => {
      this.visible = value;
      this.dataService.getMasterCountOfSchedules(this.master.id).subscribe(result => {
        this.total = result;
      })
    });
  }

  showCalendar(){
    this.isLoading = true;
    let appointments: Appointment[] = [];
    this.dataService.getAppointmentsForMaster(this.master.id).subscribe(result => {
      appointments = result;
      this.dialogService.transferDataForMastersCalendar.emit(appointments);
      this.isLoading = false;
    }, () => this.isLoading = false, () => this.isLoading = false)
  }

  
  hide(){
    this.total = 0;
  }
 
  
}
