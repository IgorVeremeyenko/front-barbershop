import { Component } from '@angular/core';
import { MasterList } from 'src/app/interfaces/master-list';
import { Schedule } from 'src/app/interfaces/schedule';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MyMessageService } from 'src/app/services/my-message.service';

interface Mast {
  id: number,
  name: string,
  category: string,
  service: [
    { name: string, category: string }
  ],
  days: [
    { dayOfWeek: string }
  ],
  phone: ''
}

@Component({
  selector: 'app-days-field',
  templateUrl: './days-field.component.html',
  styleUrls: ['./days-field.component.css'],
  providers: [MyMessageService]
})
export class DaysFieldComponent {

  selectedDays: any[] = [];

  schedule!: Schedule;

  isEditing = false;

  editingSchedule = false;

  clicked = false;

  isLoading = false;

  master: MasterList = {
    id: 0,
    name: '',
    category: [],
    phone: '',
    days: [],
    serviceName: []
  }

  days: any[] = [];

  convertedDays: any[] = [];

  currentSchedules = 0;

  constructor(private dialogService: DialogService, private dataService: DataService, private msg: MyMessageService){
    this.dataService.getDays().subscribe(value => {
      this.days = value;
    })
    this.dialogService.transferEditMasterDetails.subscribe(value => {
      this.master = value;
      this.updateData();
      this.sortMasterDays();
    })

    this.dialogService.isModalEditMasterClosed.subscribe(()=> {
      this.convertedDays = [];
    })
    
  }
  
  onEdit(){
    this.editingSchedule = true;
    this.isEditing = true;
    this.selectedDays = [];
  }

  sortMasterDays(){
    const sortedDays = this.master.days.sort((a, b) => {
      const correct = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayA = correct.indexOf(a.dayOfWeek);
      const dayB = correct.indexOf(b.dayOfWeek);
      return dayA - dayB;
    });
    this.master.days = sortedDays;
    
    let array: any[] = [];
    this.master.days.forEach(element => {
      const t = this.days.filter(item => item.payload === element.dayOfWeek)[0];
      array.push(t);
    });
    this.convertedDays = array;    
    this.isLoading = false;
  }

  onSave(){
    this.isEditing = true;
    this.clicked = false;
    this.dataService.deleteSchedule(this.master.id).subscribe(() => {
      this.selectedDays.map(item => {
        this.schedule = {
          id: 0,
          masterId: this.master.id,
          dayOfWeek: item.payload
        }
        this.dataService.postSchedule(this.schedule).subscribe(()=> {
          this.isLoading = true;
          this.updateData();
          this.editingSchedule = false;
          this.isEditing = false;
          
        }, er => {this.msg.showError(er); console.log(er.error); this.editingSchedule = false; this.isEditing = false}, ()=> {this.editingSchedule = false; this.isEditing = false; this.sortMasterDays()})
      })    
    }, err => {
      //if nothing to delete
      this.selectedDays.map(item => {
        this.schedule = {
          id: 0,
          masterId: this.master.id,
          dayOfWeek: item.payload
        }
        this.dataService.postSchedule(this.schedule).subscribe(()=> {
          this.isLoading = true;
          this.updateData();
          this.editingSchedule = false;
          this.isEditing = false;
        }, er => {this.msg.showError(er); console.log(er.error); this.editingSchedule = false; this.isEditing = false}, ()=> {this.editingSchedule = false; this.isEditing = false; this.sortMasterDays()})
      })   
    })   
    
  }

  updateData(){
    this.dataService.getMasterList().subscribe(result => {
      const selected: any = result.find(m => m.id === this.master.id);//any, because automatically adds type undefined
      this.master = selected;
      this.sortMasterDays();
      this.dialogService.isUpdatedEditMaster.emit(true);
    })
  }

  onCancel(){
    this.editingSchedule = false;
  }

  onClick(event: any){
    this.checkInput(event.value.length)
  }

  checkInput(value: any){
    if (value > 0) {
      this.clicked = true;
    }
    else {
      this.clicked = false;
    }
  }
}
