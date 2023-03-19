import { Component } from '@angular/core';
import { Costumer } from 'src/app/interfaces/costumer';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-costumer-list',
  templateUrl: './costumer-list.component.html',
  styleUrls: ['./costumer-list.component.css']
})
export class CostumerListComponent {

  customers: Costumer[] = [];

  constructor(private dataService: DataService){}

  ngOnInit() {
    // this.dataService.getClients().toPromise()
    // .then(res => <Costumer[]>res.data)
    // .then(data => {
    //   this.customers = data;
    //   console.log(this.customers)
    // })
    this.dataService.getClients().subscribe((res: any) => {
      this.customers = res;
    })
  }

}
