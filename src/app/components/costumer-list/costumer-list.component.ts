import { Component } from '@angular/core';
import { Appointment } from 'src/app/interfaces/appointment';
import { Costumer } from 'src/app/interfaces/costumer';
import { DataService } from 'src/app/services/data.service';
import { COMPLETED, IN_PROGRESS, REJECTED } from 'src/assets/constants';

@Component({
  selector: 'app-costumer-list',
  templateUrl: './costumer-list.component.html',
  styleUrls: ['./costumer-list.component.css']
})
export class CostumerListComponent {

  visits: any[] = [];

  current: any;

  displayTable = false;

  loading = true;

  sizes: any[] = [];

  selectedSize: any = '';

  constructor(private dataService: DataService){}

  ngOnInit() {
    this.sizes = [
      { name: 'Малая', class: 'p-datatable-sm' },
      { name: 'Стандарт', class: '' },
      { name: 'Большая',  class: 'p-datatable-lg' }
  ];

   this.loadData();
    
  }

  convertDate(date: Date | string) {
    const inputDate = new Date(date);
    const options = { day: '2-digit', month: 'long', hour: 'numeric', minute: 'numeric' } as const;
    const outputDate = inputDate.toLocaleString('ru-RU', options);
    return outputDate;
  }
  
  getSeverity(status: string) {
    switch (status) {
        case COMPLETED:
            return 'success';
        case IN_PROGRESS:
            return 'warning';
        case REJECTED:
            return 'danger';
    }
    return '';
}

loadData(){
  this.displayTable = false;
  this.loading = true;
  this.dataService.getClients().subscribe(app_res => {
    app_res.map(app => {
      this.dataService.getAppointments().subscribe(appointment => {
        appointment.map(app_result => {
          if(app_result.costumerId === app.id){
            this.dataService.getSericeById(app_result.serviceId).subscribe(service => {
              const dateObj = new Date(app_result.date);
              const formatter = new Intl.DateTimeFormat('ru', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                hour: 'numeric',
                minute: 'numeric'
              });

              const result = formatter.format(dateObj);
              const obj_appointment = {
                id: app.id,
                name: app.name,
                phone: app.phone,
                rating: 5,
                appointments: [
                    {
                        id: app_result.id,
                        name: `${service.category}/${service.name}`,
                        date: result,
                        amount: service.price,
                        quantity: 1,
                        status: app_result.status
                    }
                ] 
              }
              this.visits.push(obj_appointment)
            })              
          }
        })
      })
      
    });
    setTimeout(() => {
      let uniqueArr = this.visits.filter((obj, index, self) =>
        index === self.findIndex((t) => (
          t.id === obj.id && t.name === obj.name
        ))
      );
      this.visits = uniqueArr;
      this.displayTable = true;        
      this.loading = false;
    }, 500);
  },error => console.log('error oninit ', error))
}

}
