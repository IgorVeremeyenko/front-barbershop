import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateSelectArg } from '@fullcalendar/core';
import { AppointmentClass, CostumerClass, ServiceClass } from 'src/app/classes/classes.module';
import { Costumer } from 'src/app/interfaces/costumer';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataService } from 'src/app/services/data.service';
import { MyMessageService } from 'src/app/services/my-message.service';
import { IN_PROGRESS } from 'src/assets/constants';

interface Cat {
  id: number,
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

  @Input() isAddedNewCostumer: boolean = false;

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

  selectedCostumer!: Costumer;

  categorySelected: any;

  priceSelected: any;

  params!: DateSelectArg;

  @Input() displayModal: boolean = false;
  @Input() calendarParams: any;

  constructor(private dataService: DataService, private messages: MyMessageService, private calendarService: CalendarService) {

    this.myForm = new FormGroup({
      "userName": new FormControl("", Validators.required),
      "selectedLang": new FormControl("Русский"),
      "selectedService": new FormControl("", Validators.required),
      "selectedPrice": new FormControl({value: '', disabled: true})
    });
    
    dataService.getServices().subscribe(serv_res => {
      serv_res.map(item => {
        const children = {
          cname: item.name,
          cprice: item.price
        }
        const cat: Cat = {
          id: item.id,
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

    this.dataService.isAddedNewCostumer.subscribe(value => {
      if(value){
        this.loadClientsList();
      }
    })

    dataService.transferParams.subscribe(value => {
      this.calendarApi = value;
    })

    this.loadClientsList();

    this.myForm.valueChanges.subscribe(values => {
      this.selectedCostumer = values.userName;
    })

  }

  ngOnInit(): void {

    this.calendarService.transferCalendarApi.subscribe(value => {
      this.calendarApi = value;
      console.log('api', this.calendarApi)
    })

    this.dataService.transferParams.subscribe(params => {
      if (typeof (params) === 'string') {
        this.date = params;
        this.allDay = true;
      }
      else {
        this.params = params;
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
    });

  }

  // ngAfterViewInit() {
  //   let calendarApi = this.fullCalendar.getApi();
  //   console.log(calendarApi)
  // }

  loadClientsList(){
    this.dataService.getClients().subscribe(clients => {
      clients.map(cl => {        
        this.clients.push(cl);
      });
    })
  }

  click(event: any){
    console.log(event)
  }

  closeModal() {
    this.displayModal = false;
  }

  getCategory(event: any){
    this.categorySelected = event.value;
  }

  getPrice(event: any){
    this.priceSelected = event.cprice;
    this.myForm.get('selectedPrice')?.enable();
    this.myForm.get('selectedPrice')?.setValue(this.priceSelected);
    this.myForm.get('selectedPrice')?.disable();
  }

  addAppointment() {        
    this.appointment_obj = new AppointmentClass(
      0,
      this.dateForDB,
      this.selectedCostumer.id,
      this.categorySelected.id,
      IN_PROGRESS,
      this.dataService.USER_ID
    );
    const calendar_event = {
      id: this.selectedCostumer.id.toString(),
      title: 'service_name',
      start: this.date,
      end: this.date,
      allDay: this.allDay
    }
    this.addEventToCalendarApi(calendar_event, this.params);
    this.displayModal = false;
    // this.dataService.addNewAppointment(this.appointment_obj).subscribe(
    //   result => {
    //     try {
    //       const service_name = this.dataService.getSericeById(this.appointment_obj.serviceId).subscribe(service => service.name);
    //       const currentDate = new Date(this.appointment_obj.date);
    //       const minutes = this.addMinutes(currentDate, 30);
    //       const calendar_event = {
    //         id: result.id,
    //         title: service_name,
    //         start: this.date,
    //         end: minutes,
    //         allDay: this.allDay
    //       }
    //       this.addEventToCalendarApi(calendar_event, this.params);
    //       this.messages.showSuccess('Успешно добавлено');
    //       this.isSubmiting = false;
    //       this.closeModal();
          
    //     } catch (error) {
    //       console.log('catch add appointment', error);
    //     }
    //   }, error => {
    //     this.messages.showError(error);
    //   }
    // )
  }

  addEventToCalendarApi(event: any, params: DateSelectArg){
    this.calendarService.addEventToCalendar.emit({event, params});
  }

  showSuccess(){
    this.messages.showSuccess('Успешно добавлено');
  }

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  openNewCostumerModal(){
    this.dataService.showModalAddNewCostumer.emit(true);
  }

  submit() {
    // this.isSubmiting = true;
    this.addAppointment();
  }

}
