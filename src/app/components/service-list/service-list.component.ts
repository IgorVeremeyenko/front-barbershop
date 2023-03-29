import { AfterViewInit, Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ServiceClass } from 'src/app/classes/classes.module';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements AfterViewInit {

  files: TreeNode[] = [];

  isShown = false;

  isLoaded = false;

  isLoading = false;

  cols = [
    { field: 'name', header: 'Категория/Название' },
    { field: 'price', header: 'Стоимость' },
    { field: 'master', header: 'Мастер' }
  ];

  constructor(private dataService: DataService) { }


  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.files = [];
    this.loadData();  
  }
  loadData(){
    this.isLoaded = false;
    this.files = [];
    this.dataService.getServices().subscribe(serviceArray => {
      serviceArray.map(object => {
        if(object.userId === this.dataService.USER_ID){
          console.log(this.dataService.USER_ID)
          this.dataService.getMasterById(object.masterId).subscribe(master => {
            const node: TreeNode = {
              data: {
                name: object.category
              },
              children: [{
                data: {
                  id: object.id,
                  masterId: object.masterId,
                  name: object.name,
                  price: object.price,
                  master: master.name
                }
              }]
            };
    
            if(this.files.length > 0){
              this.files.map(items => {
                if(items.data.name === node.data.name){
                  node.children?.map(node_children => {
                    items.children?.push(node_children);
                  })
                }
                else{
                  this.files.push(node);
                }
              })
            }
            else {
              this.files.push(node);
            }
            
          })
        }
        
        
      });      
      
    }
    );
    setTimeout(() => {
      let uniqueArr = this.files.filter((obj, index, self) =>
        index === self.findIndex((t) => (
          t.data.name === obj.data.name
        ))
      );
      this.files = uniqueArr;
      this.isLoaded = true;
    }, 500);
  }

  public openModal(value: boolean, service_info: any, data: any): void {
    if(data.level === 0){
      return;
    }
    this.isLoading = true;
    const serv_obj: ServiceClass = new ServiceClass(
      service_info.id,
      service_info.name,
      service_info.price,
      this.dataService.USER_ID,
      service_info.masterId,
      data.parent.data.name,
      ''
    )
    // this.dataService.updateServData(serv_obj);
    this.dataService.transferServiceObject.emit(serv_obj);
    this.dataService.showModalEditService.emit(value);
    this.isLoading = false;
    this.isShown = true;
  }

}

