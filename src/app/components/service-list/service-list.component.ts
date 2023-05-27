import { AfterViewInit, Component } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ServiceClass } from 'src/app/classes/classes.module';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent {

  files: TreeNode[] = [];

  isShown = false;

  isLoaded = false;

  isLoading = false;

  cols = [
    { field: 'name', header: 'Категория/Название' },
    { field: 'price', header: 'Стоимость' },
    { field: 'masterName', header: 'Мастер' }
  ];

  constructor(private dataService: DataService, private dialogService: DialogService) {
    this.dialogService.isDataChangedForEditServiceComponent.subscribe(value => {
      if(value) this.loadData();
    })   
   }


  ngOnInit() {
    this.files = [];
    this.loadData();  
  }
  loadData(){
    this.isLoaded = false;
    this.files = [];
    this.dataService.getServicesTreeNode().subscribe(result => {
      this.files = result;
    this.isLoaded = true;
    })
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
    this.dialogService.transferServiceObject.emit(serv_obj);
    this.dialogService.showModalEditService.emit(value);
    this.isLoading = false;
    this.isShown = true;
  }

}

