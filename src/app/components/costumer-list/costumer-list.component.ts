import { Component } from '@angular/core';
import { Appointment } from 'src/app/interfaces/appointment';
import { Costumer } from 'src/app/interfaces/costumer';
import { Statistics } from 'src/app/interfaces/statistics';
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

  statistic: Statistics[] = [];

  total = 0;

  appointments: Appointment[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.sizes = [
      { name: 'Уменьшенная', class: 'p-datatable-sm' },
      { name: 'Стандарт', class: '' },
      { name: 'Увеличенная', class: 'p-datatable-lg' }
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

  loadData() {
    
    this.visits = [];
    this.displayTable = false;
    this.loading = true;
    this.dataService.getClients().subscribe(app_res => {
      app_res.map(app => {
        if(app.userId === this.dataService.USER_ID){
          this.dataService.getAppointments().subscribe(appointment => {
            
            if (!appointment.length) {
  
              this.dataService.getStatistics().subscribe(stat => {
                this.statistic = stat;
                const rating = this.calculateRating(app.id);
                const obj_appointment = {
                  id: app.id,
                  name: app.name,
                  phone: app.phone,
                  rating: rating,
                  total: this.total,
                  appointments: []
                };
                this.visits.push(obj_appointment);
              })
            }
            else {
              this.appointments = appointment;
              appointment.map(app_result => {
                if (app_result.costumerId === app.id) {
                  this.totalAppointments(app.id, this.appointments);
                  this.dataService.getSericeById(app_result.serviceId).subscribe(service => {
                    const dateObj = new Date(app_result.date);
                    const formatter = new Intl.DateTimeFormat('ru', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      hour: 'numeric',
                      minute: 'numeric'
                    });
                    this.dataService.getStatistics().subscribe(stat => {
                      this.statistic = stat;
                      const rating = this.calculateRating(app.id);
                      const result = formatter.format(dateObj);
                      const obj_appointment = {
                        id: app.id,
                        name: app.name,
                        phone: app.phone,
                        rating: rating,
                        total: this.total,
                        appointments: [
                          {
                            id: app_result.id,
                            name: `${service.category}/${service.name}`,
                            date: result,
                            amount: service.price,
                            status: app_result.status
                          }
                        ]
                      }
                      if(this.visits.length > 0){
                        this.visits.map(items => {
                          if(items.id === obj_appointment.id){
                            obj_appointment.appointments?.map(obj_children => {
                              items.appointments.push(obj_children);
                            })
                          }
                          else {
                            this.visits.push(obj_appointment);
                          }
                        })
                      }
                      
                    })
  
                  })
                }
                else {
                  this.dataService.getStatistics().subscribe(stat => {
                    this.statistic = stat;
                    this.totalAppointments(app.id, this.appointments);
                    const rating = this.calculateRating(app.id);
                    const obj_appointment = {
                      id: app.id,
                      name: app.name,
                      phone: app.phone,
                      rating: rating,
                      total: this.total,
                      appointments: []
                    };
                    this.visits.push(obj_appointment);
                  })
  
                }
              })
            }
  
          })
        }
        

      });
      setTimeout(() => {
        let uniqueArr = this.visits.filter((obj, index, self) =>
          index === self.findIndex((t) => (
            t.id === obj.id
          ))
        );
        this.visits = uniqueArr;
        this.displayTable = true;
        this.loading = false;
      }, 1000);
    }, error => console.log('error oninit ', error))
  }

  calculateRating(costumerId: number) {
    let successfulVisits = 0;
    let totalVisits = 0;
    successfulVisits = this.statistic.filter(item => item.complete > 0 && item.costumerId === costumerId).reduce(acc => acc + 1, 0);
    totalVisits = this.statistic.filter(item => item.costumerId === costumerId).reduce(acc => acc + 1, 0);
    let rating = 0;
    const successRate = (successfulVisits / totalVisits) * 100;
    console.log(successfulVisits)
    if (successRate >= 90) {
      rating = 5;
    } else if (successRate >= 80) {
      rating = 4;
    } else if (successRate >= 70) {
      rating = 3;
    } else if (successRate >= 60) {
      rating = 2;
    } else {
      rating = 1;
    }
    return rating;
  }

  totalAppointments(costumerId: number, array: Appointment[]){
    const size = array.length;
    this.total = array.filter(item => item.costumerId === costumerId && size > 0).reduce(acc => acc + 1, 0);
  }

}
