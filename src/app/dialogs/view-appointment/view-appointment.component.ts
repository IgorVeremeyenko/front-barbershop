import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Appointment } from 'src/app/interfaces/appointment';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class ViewAppointmentComponent {

  isSubmiting = false;

  costumer_data$ = this.dataService.costumer_data_subject;

  serviceOption: any;

  temporaryForm!: any;

  APPOINTMENT_ID!: number;

  displayModalAppointment = false;

  constructor(private dataService: DataService, private confirmationService: ConfirmationService, private calendarService: CalendarService){
    this.temporaryForm = calendarService.temporaryForm;
    this.costumer_data$.subscribe(data => {
      console.log(data)
      this.displayModalAppointment = true;
    });
    
  }

  confirm(event: any) {
    this.APPOINTMENT_ID = this.calendarService.temporaryForm.id;
    this.confirmationService.confirm({
      target: event.target,
      header: 'Подтверждение удаления',
      message: 'Вы действительно хотите удалить запись?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isSubmiting = true;
        this.dataService.removeAppointment(this.APPOINTMENT_ID).subscribe(res => {
          // this.msgs = [{severity:'info', summary:'info', detail:'Запись удалена'}];
          this.isSubmiting = false;
          this.calendarService.clickInfoCurrent.event.remove();
          // this.closeAppointmentModal();
          // this.showInfo('Запись удалена')
        }, error => {
          console.log(error)
          // this.showError(error);
          this.isSubmiting = false;
        })
      },
      reject: () => {
        // this.msgs = [{ severity: 'info', summary: 'info', detail: 'Вы отменили удаление' }];
      }
    });
  }  


}
