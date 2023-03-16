import { Component, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventAddArg, EventInput, EventChangeArg } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Message, PrimeNGConfig } from 'primeng/api';
import { DataService } from './services/data.service';
import { Costumer } from './interfaces/costumer';
import { Appointment } from './interfaces/appointment';
import { Service } from './interfaces/service';
import { NodeService } from './services/node.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyNode } from './interfaces/node';
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class AppComponent {
  displayModal: boolean | undefined;
  displayModalAppointment: boolean | undefined;
  isLoading = true;
  isSubmiting = false;
  public temporaryForm: Appointment = {
    id: 0,
    date: '',
    costumer: undefined,
    service: undefined,
    costumerId: 0,
    serviceId: 0,
    userId: 0
  };
  selectedService!: string;
  dateAppointment!: string;
  calendarVisible = false;
  
  APPOINTMENT_ID!: number;
  phoneNum!: string;
  clickInfoCurrent!: EventClickArg;
  currentEvents: EventApi[] = [];
  msgs: Message[] = [];
  calendarApi: any;
  selectInfo2!: DateSelectArg;
  selectedNode: any[] = [];
  selectedNode2: MyNode = {
    data: '',
    label: '',
    price: 0
  };
  nodes1!: any[];
  nodes2!: any[];
  myForm !: FormGroup;
  constructor(private confirmationService: ConfirmationService,public nodeService: NodeService, private changeDetector: ChangeDetectorRef, private primengConfig: PrimeNGConfig, private dataService: DataService, private messageService: MessageService) {
    this.myForm = new FormGroup({
              
      "userName": new FormControl("Ivan", Validators.required),
      "userPhone": new FormControl("", [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]),
      "selectedLang": new FormControl("Русский"),
      "selectedService": new FormControl("", Validators.required)
  });
  
  }


// confirm(event: any) {
//   this.confirmationService.confirm({
//       target: event.target,
//       header: 'Подтверждение удаления',
//       message: 'Вы действительно хотите удалить запись?',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//         this.isSubmiting = true;
//         this.dataService.removeAppointment(this.APPOINTMENT_ID).subscribe(res => {
//           // this.msgs = [{severity:'info', summary:'info', detail:'Запись удалена'}];
//           this.isSubmiting = false;
//           this.clickInfoCurrent.event.remove();
//           this.closeAppointmentModal();
//           this.showInfo('Запись удалена')
//         }, error => {
//           console.log(error)
//           this.showError(error);
//           this.isSubmiting = false;
//         })
//       },
//       reject: () => {
//         this.msgs = [{severity:'info', summary:'info', detail:'Вы отменили удаление'}];
//       }
//   });
// }  

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);
  
    return date;
  }

  ngOnInit() {
   
    
  }
// // show toasts start
//   showError(detail: any) {
//     this.messageService.add({severity:'error', summary: 'Error', detail: detail});
//   }
//   showInfo(detail: any) {
//     this.messageService.add({severity:'info', summary: 'Info', detail: detail});
// }
// showSuccess(detail: any) {
//   this.messageService.add({severity:'success', summary: 'Success', detail: detail});
// }
// // show toasts end
//   optionlog(event: Node){
//     this.selectedNode2 = event;   
//   }

//   nodeSelect(node: any){
//     console.log(node)
//   }


  
  // addAppointment(){
    
  //   const client: Costumer = {
  //     id: 0,
  //     name: this.myForm.value.userName,
  //     phone: this.myForm.value.userPhone,
  //     email: "email",
  //     language: this.myForm.value.selectedLang.label,
  //     userId: 0
  //   }
   
  //   const app: Appointment = {
  //     date: this.selectInfo2.startStr,
  //     costumer: client,
  //     service: {
  //       id: 0,
  //       name: this.myForm.value.selectedService.label,
  //       price: this.myForm.value.selectedService.price,
  //       userId: 0
  //     },
  //     id: 0,
  //     costumerId: 0,
  //     serviceId: 0,
  //     userId: 0
  //   }
  //   const title = this.selectedNode2.label;
  //   console.log(app)
  //   this.dataService.addNewAppointment(app)
  //   .subscribe(result=> 
  //     {
  //       this.calendarApi.addEvent({
  //         id: result.id,
  //         title: title,
  //         start: this.selectInfo2.startStr,
  //         end: this.selectInfo2.endStr,
  //         allDay: this.selectInfo2.allDay
  //       });
  //       this.isSubmiting = false;
  //       this.closeModal(); 
  //       this.showSuccess(title)
  //     },error => 
  //     {
  //       this.showError(error);
  //       this.isSubmiting = false;
  //       console.log(error); this.closeModal();
  //     },() => this.closeModal())
  // }

  getAppointmentById(id: string) : Appointment{
    const ID = parseInt(id);
    const cost: Costumer = {
      id: 0,
      name: '',
      phone: '',
      email: '',
      language: '',
      userId: 0
    }
    const serv: Service = {
      id: 0,
      name: '',
      price: 0,
      userId: 0
    }
    const details: Appointment = {
      id: 0,
      date: '',
      costumer: cost,
      service: serv,
      costumerId: 0,
      serviceId: 0,
      userId: 0
    } 
    this.dataService.getAppointmentById(ID).subscribe(result => {
      this.dataService.getCostumerById(result.costumerId).subscribe(id => {
        cost.id = id.id,
        cost.email = '',
        cost.language = id.language,
        cost.name = id.name,
        cost.phone = id.phone
      });
      this.dataService.getSericeById(result.serviceId).subscribe(s => {
        serv.id = s.id,
        serv.name = s.name,
        serv.price = s.price
      });
      details.costumer = cost,
      details.date = result.date
      details.service = serv
    })
    return details;
  }

  

  // handleDateSelect(selectInfo: DateSelectArg) {
  //   const currentMonth = selectInfo.start.toLocaleDateString();
  //   const curDay = selectInfo.start.toTimeString();
  //   console.log(selectInfo)
  //   if(selectInfo.allDay){
  //     this.dateAppointment = 'Весь день'
  //   }else {
  //     this.dateAppointment = `${currentMonth} ${curDay}`;
  //   }
  //   this.showModalDialog();
  //   this.selectInfo2 = selectInfo;
  //   this.calendarApi = selectInfo.view.calendar;
  //   this.calendarApi.unselect(); // clear date selection
  // }

  // handleEventClick(clickInfo: EventClickArg) {
  //   this.clickInfoCurrent = clickInfo;
  //   this.temporaryForm = this.getAppointmentById(clickInfo.event.id);
  //   this.APPOINTMENT_ID = parseInt(clickInfo.event.id);
  //   console.log(clickInfo)
  //   this.showAppointmentModal();
  // }

  // handleEventAdd(event: EventAddArg) {
  //   // add your custom logic here
  // }

  // handleEvents(events: EventApi[]) {
  //   this.currentEvents = events;
  //   this.changeDetector.detectChanges();
  // }
}
