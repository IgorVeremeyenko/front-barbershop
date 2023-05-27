import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Appointment } from 'src/app/interfaces/appointment';
import { MasterList } from 'src/app/interfaces/master-list';
import { Service } from 'src/app/interfaces/service';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';

interface CurrentService {
  service: string,
  isCurrent: string
}

@Component({
  selector: 'app-master-edit',
  templateUrl: './master-edit.component.html',
  styleUrls: ['./master-edit.component.css']
})
export class MasterEditComponent {

  visible = false;

  total = 0;

  selectedDays: string[] = [];

  isLoading = false;

  appointments: Appointment[] = [];

  isEnableCalendar: boolean = false;

  serviceListCategories: Service[] = [];

  serviceListNames: Service[] = [];

  master: MasterList = {
    id: 0,
    name: '',
    category: [],
    phone: '',
    days: [],
    serviceName: []
  };

  constructor(private dialogService: DialogService, private dataService: DataService, private router: Router){
    this.dialogService.transferEditMasterDetails.subscribe(params => {
      this.master = params;
      this.dataService.getAppointmentsForMaster(this.master.id).subscribe(result => {
        this.appointments = result;
        if(result.length > 0) this.isEnableCalendar = true;
        else this.isEnableCalendar = false;
      })
    })
    this.dialogService.showModalEditMaster.subscribe(value => {
      this.visible = value;
      this.dataService.getMasterCountOfSchedules(this.master.id).subscribe(result => {
        this.total = result;
      })
    });

    this.dataService.getServicesListByCategory().subscribe(result => {
      this.serviceListCategories = result;
    })

    this.dataService.getServicesListByName().subscribe(result => {
      this.serviceListNames = result;      
    })
    
  }

  showCalendar(){
    this.isLoading = true;
    if(this.isEnableCalendar){
      this.dialogService.transferDataForMastersCalendar.emit(this.appointments);
        this.isLoading = false;
        this.dataService.updateMasterComponent(this.appointments);
        this.router.navigateByUrl(`master/${this.master.name}`);
        this.isLoading = false;
    }
    this.isLoading = false;    
  }

  
  hide(){
    this.total = 0;
    this.dialogService.isModalEditMasterClosed.emit(true);
  }
 
  
}
