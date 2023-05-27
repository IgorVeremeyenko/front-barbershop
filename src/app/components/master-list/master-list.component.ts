import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Appointment } from 'src/app/interfaces/appointment';
import { Master } from 'src/app/interfaces/master';
import { MasterList } from 'src/app/interfaces/master-list';
import { Schedule } from 'src/app/interfaces/schedule';
import { Service } from 'src/app/interfaces/service';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.css']
})

export class MasterListComponent {

  masters: Master[] = [];

  items: MenuItem[] = [];

  appointments: Appointment[] = [];

  options!: MasterList[];

  services: Service[] = [];

  schedules: Schedule[] = [];

  isLoading = true;

  selectedDays: string[] = [];

  loadEditTable = false;

  constructor(private dataService: DataService, private dialogService: DialogService) {

    this.getMasterList();

    this.dialogService.isUpdatedEditMaster.subscribe(value => {
      if (value) {
        this.getMasterList();
      }
    })

    this.items = [
      { label: 'View', icon: 'pi pi-fw pi-search' },
      { label: 'Delete', icon: 'pi pi-fw pi-times',}
  ];

  }

  getMasterList() {
    this.dataService.getMasterList().subscribe(result => {
      this.options = result;
    })
  }

  openDetails(master: any) {
    const selected = this.options.find(m => m.id === master.id);
    this.dialogService.transferEditMasterDetails.emit(selected);
    this.dialogService.showModalEditMaster.emit(true);
  }


}
