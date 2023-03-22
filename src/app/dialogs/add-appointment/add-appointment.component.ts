import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { AppointmentClass, CostumerClass, ServiceClass } from 'src/app/classes/classes.module';
import { Costumer } from 'src/app/interfaces/costumer';
import { MyNode } from 'src/app/interfaces/node';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataService } from 'src/app/services/data.service';
import { MyMessageService } from 'src/app/services/my-message.service';

interface Cat {
  category: string,
  services: [{
    cname: string,
    cprice: number
  }]
}

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css'],
  providers: [MyMessageService]
})
export class AddAppointmentComponent implements OnInit {

  appointment_obj!: AppointmentClass;
  costumer_obj!: CostumerClass;
  service_obj!: ServiceClass;
  myForm!: FormGroup;
  isSubmiting = false;
  date!: Date | string;
  dateForDB!: Date;
  calendarApi: any;
  allDay: boolean = false;

  services: any[] = [];

  clients: Costumer[] = [];

  selectedNodes3: any[] = [];

  @Input() displayModal: boolean = false;

  constructor(private dataService: DataService, private messages: MyMessageService, private calendarService: CalendarService) {

    this.myForm = new FormGroup({
      "userName": new FormControl("", Validators.required),
      "userPhone": new FormControl("", [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]),
      "selectedLang": new FormControl("Русский"),
      "selectedService": new FormControl("", Validators.required)
    });
    
    dataService.getServices().subscribe(serv_res => {
      serv_res.map(item => {
        const children = {
          cname: item.name,
          cprice: item.price
        }
        const cat: Cat = {
          category: item.category,
          services: [children]
        }
        let flag = false;
        this.services.map(items => {
          if(items.category === cat.category){
            items.services.push(children);
            flag = true;
          }
        })
        if(!flag){
          this.services.push(cat);
        }
      })
      
    })

    this.dataService.getClients().subscribe(clients => {
      clients.map(cl => {
        
        this.clients.push(cl);
      });
      console.log(this.clients)
    })

    

  }

  ngOnInit(): void {

    this.calendarApi = this.calendarService.calendarApi;

    this.dataService.transferParams.subscribe(params => {
      if (typeof (params) === 'string') {
        this.date = params;
        this.allDay = true;
      }
      else {
        this.dateForDB = params.start;
        const dateObj = new Date(params.start);
        const formatter = new Intl.DateTimeFormat('ru', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: 'numeric',
          minute: 'numeric'
        });

        const result = formatter.format(dateObj);
        this.date = result;
        this.allDay = false;
      }
    });

    this.dataService.showModalAddAppointment.subscribe(value => {
     
      this.displayModal = value;
      this.calendarApi = this.calendarService.calendarApi;
    });

  }

  click(event: any){
    console.log(event)
  }

  closeModal() {
    this.displayModal = false;
  }

  addAppointment() {
    const phoneNumber = this.myForm.value.userPhone;
    const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
    this.service_obj = new ServiceClass(
      0,
      this.myForm.value.selectedService.label,
      this.myForm.value.selectedService.price,
      this.dataService.USER_ID,
      2,
      this.myForm.value.selectedService.label,
      'Выполняется'
    )
    this.costumer_obj = new CostumerClass(
      0,
      this.myForm.value.userName,
      "",
      cleanNumber,
      this.myForm.value.selectedLang.label,
      this.dataService.USER_ID
    );
    this.appointment_obj = new AppointmentClass(
      0,
      this.dateForDB,
      this.costumer_obj,
      this.service_obj,
      this.costumer_obj.id,
      this.service_obj.id,
      this.dataService.USER_ID
    );
    this.dataService.addNewAppointment(this.appointment_obj).subscribe(
      result => {
        const currentDate = new Date(this.appointment_obj.date);
        const minutes = this.addMinutes(currentDate, 30);
        this.calendarApi.addEvent({
          id: result.id,
          title: this.service_obj.name,
          start: this.date,
          end: minutes,
          allDay: this.allDay
        });
        this.messages.showSuccess('Успешно добавлено');
        this.isSubmiting = false;
        this.closeModal();
      }, error => {
        this.messages.showError(error);
      }
    )
  }

  showSuccess(){
    this.messages.showSuccess('Успешно добавлено');
  }

  optionlog(event: MyNode) {
    
  }

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  submit() {
    this.isSubmiting = true;
    this.addAppointment();
  }

}
