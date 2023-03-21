import { Component } from '@angular/core';
import { Appointment } from 'src/app/interfaces/appointment';
import { Costumer } from 'src/app/interfaces/costumer';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-costumer-list',
  templateUrl: './costumer-list.component.html',
  styleUrls: ['./costumer-list.component.css']
})
export class CostumerListComponent {

  visits: any[] = [];

  current: any;

  constructor(private dataService: DataService){}

  ngOnInit() {
   
    this.dataService.getClients().subscribe(app_res => {
      app_res.map(cost => {
        this.dataService.getAppointments().subscribe(appointment => {
          appointment.map(app_res => {
            this.dataService.getSericeById(app_res.serviceId).subscribe(service => {
              this.dataService.getMasterById(service.masterId).subscribe(master => {
                const outputDate = this.convertDate(app_res.date);
                this.current = {
                  id: cost.id,
                  client: cost.name,
                  master: master.name,
                  lang: cost.language,
                  service: `${service.category}/${service.name}`,
                  status: service.status,
                  date: outputDate
                };
                this.visits.push(this.current);
              })
            })
          })
        })
      });
      console.log(this.visits)
    })
  }

  convertDate(date: Date | string) {
    const inputDate = new Date(date);
    const options = { day: '2-digit', month: 'long', hour: 'numeric', minute: 'numeric' } as const;
    const outputDate = inputDate.toLocaleString('ru-RU', options);
    return outputDate;
  }

}
