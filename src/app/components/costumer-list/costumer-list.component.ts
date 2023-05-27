import { Component } from '@angular/core';
import { Appointment } from 'src/app/interfaces/appointment';
import { Costumer } from 'src/app/interfaces/costumer';
import { DataService } from 'src/app/services/data.service';
import { COMPLETED, IN_PROGRESS, REJECTED } from 'src/assets/constants';
import { PrimeNGConfig, OverlayOptions } from 'primeng/api';

@Component({
  selector: 'app-costumer-list',
  templateUrl: './costumer-list.component.html',
  styleUrls: ['./costumer-list.component.css']
})
export class CostumerListComponent {

  visits: Costumer[] = [];

  displayTable = false;

  loading = true;

  sizesOfTable: any[] = [];

  selectedSizeOfTable: any = '';

  count = 10;

  appointments: Appointment[] = [];

  constructor(private dataService: DataService, private primengConfig: PrimeNGConfig) { }

  ngOnInit() {
    this.sizesOfTable = [
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
    let clientsArray: Costumer[] = [];
    this.dataService.getClients().subscribe(clients => {
      clients.map(client => {
        if(client.userId = this.dataService.USER_ID){
          clientsArray.push(client);
        }
        this.visits = clientsArray;
        this.displayTable = true;
        this.loading = false;
      })
    }, () => {this.loading = false}, () => this.loading = false)
  }

  concatDatas(data: any){
    this.visits.map(item => {
      item.appointments.concat(data);
    })
  }

  loadLazy(event: any){
    this.count += 10;
    // const startIndex = event.first;
    // const endIndex = startIndex + event.rows;
    this.loadData();
    if(!this.loading) event.forceUpdate();
  }

}
