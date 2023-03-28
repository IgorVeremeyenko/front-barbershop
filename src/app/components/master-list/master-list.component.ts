import { Component } from '@angular/core';
import { Appointment } from 'src/app/interfaces/appointment';
import { Master } from 'src/app/interfaces/master';
import { Schedule } from 'src/app/interfaces/schedule';
import { Service } from 'src/app/interfaces/service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.css']
})

export class MasterListComponent {

  masters: Master[] = [];

  appointments: Appointment[] = [];

  options!: any[];

  services: Service[] = [];

  schedules: Schedule[] = [];

  isLoading = true;

  days: any[] = [
    {day: 'Monday'},
    {day: 'Tuesday'},
    {day: 'Wednesday'},
    {day: 'Thursday'},
    {day: 'Friday'},
    {day: 'Saturday'},
    {day: 'Sunday'}
  ];
  

  selectedDays: string[] = [];

  constructor(private dataService: DataService){
    
    this.dataService.getMasters().subscribe(masters => this.masters = masters);
    this.dataService.getServices().subscribe(services => this.services = services);
    this.dataService.getSchedules().subscribe(schedules => this.schedules = schedules);
    this.dataService.getAppointments().subscribe(app => this.appointments = app);
     setTimeout(() => {
      //  console.log(this.masters);
       for (const iterator of this.masters) {
        
        const foundService = this.services.find(obj => obj.masterId === iterator.id);
        const obj = {
          id: iterator.id,
          name: iterator.name,
          category: foundService?.category,
          service: this.services.filter(obj => obj.masterId === iterator.id),
          days: this.schedules.filter(schedule => {          
            if(schedule.masterId === iterator.id)
              return schedule;
            return
          })
        }
        if(this.options === undefined){
          this.options = [...[obj]]
        }
        else {
          this.options.push(obj);
        }
       }
       this.isLoading = false;
            
     }, 1000);
    
  }

selectProduct(product: any){
  console.log(product)
}

onRowEditInit(product: any){
  
}
onRowEditSave(product: any){
  console.log(this.selectedDays)
  this.selectedDays = [];
}
onRowEditCancel(product: any, id: any){
  console.log(product, id)
  this.selectedDays = [];
}

}
