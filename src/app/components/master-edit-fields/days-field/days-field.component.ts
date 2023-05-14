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

  isEditing = false;

  editingSchedule = false;

  clicked = false;

  master: MasterList = {
    id: 0,
    name: '',
    category: [],
    phone: '',
    days: []
  }

  days: any[] = [];

  convertedDays: any[] = [];

  currentSchedules = 0;

  constructor(private dialogService: DialogService, private dataService: DataService, private msg: MyMessageService){
    this.dialogService.transferEditMasterDetails.subscribe(value => {
      this.dataService.getDays().subscribe(value => {
        this.days = value;
      })
      this.master = value;
      
      const sortedDays = this.master.days.sort((a, b) => {
          const correct = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const dayA = correct.indexOf(a.dayOfWeek);
          const dayB = correct.indexOf(b.dayOfWeek);
          return dayA - dayB;
        });
        this.master.days = sortedDays;
    })
    
  }
  
  onEdit(){
    this.editingSchedule = true;
    this.isEditing = true;
  }

  onSave(){
    this.isEditing = true;
    this.clicked = false;
    // this.schedule.masterId = this.master.id;
    if(this.currentSchedules > 0){
      this.dataService.deleteSchedule(this.master.id).subscribe(() => {

        this.selectedDays.map(item => {
          // this.schedule.dayOfWeek = item.payload;
          // this.dataService.postSchedule(this.schedule);
        })    
        this.editingSchedule = false;
        this.isEditing = false;
        this.msg.showSuccess('Успешные изменения')
      }, err => console.log(err))
    }
    else {
      this.selectedDays.map(item => {
        // this.schedule.dayOfWeek = item.payload;
        // this.dataService.postSchedule(this.schedule).subscribe(res => console.log(res));
        this.editingSchedule = false;
        this.isEditing = false;
      })  
      this.msg.showSuccess('Успешные изменения')
    }
    
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
