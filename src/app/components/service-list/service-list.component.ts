import { Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent {

  files: TreeNode[] = [];

  isLoaded = false;

  cols = [
    { field: 'name', header: 'Название' },
    { field: 'price', header: 'Стоимость' },
    { field: 'master', header: 'Мастер' },
  ];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.files = [];
    this.loadData();  
  }
  loadData(){
    this.isLoaded = false;
    this.files = [];
    this.dataService.getServices().subscribe(serviceArray => {
      serviceArray.map(object => {
        this.dataService.getMasterById(object.masterId).subscribe(master => {
          const node: TreeNode = {
            data: {
              name: object.category
            },
            children: [{
              data: {
                name: object.name,
                price: object.price,
                master: master.name
              }
            }]
          };
  
          if(this.files.length > 0){
            let count = 0;
            this.files.map(items => {
              if(items.data.name === node.data.name){
                node.children?.map(node_children => {
                  items.children?.push(node_children);
                  count++;
                })
              }
              if(count === 0){
                this.files.push(node);
              }
            })
          }
          else {
            this.files.push(node);
          }
          
        })
        
      })
    }
    );
    setTimeout(() => {
      this.isLoaded = true;
    }, 500);
  }
}

