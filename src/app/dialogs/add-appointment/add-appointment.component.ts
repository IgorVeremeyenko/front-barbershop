import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateSelectArg } from '@fullcalendar/core';
import { AppointmentClass, CostumerClass, ServiceClass } from 'src/app/classes/classes.module';
import { Costumer } from 'src/app/interfaces/costumer';
import { Master } from 'src/app/interfaces/master';
import { Schedule } from 'src/app/interfaces/schedule';
import { Service } from 'src/app/interfaces/service';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
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

  masters: Master[] = [];

  servicesList: Service[] = [];

  schedules: Schedule[] = [];

  available: any;

  today = new Date();

  freeMaster = true;

  @Input() displayModal: boolean = false;
  @Input() calendarParams: any;

  constructor(private dataService: DataService, private messages: MyMessageService, private calendarService: CalendarService, private dialogService: DialogService) {

    this.myForm = new FormGroup({
      "userName": new FormControl("", Validators.required),
      "selectedLang": new FormControl("Русский"),
      "selectedService": new FormControl("", Validators.required),
      "selectedPrice": new FormControl({value: '', disabled: true}),
      "isAvailable": new FormControl(null, Validators.required)
    });

    this.dataService.getMasters().subscribe(masters => this.masters = masters);
    this.dataService.getServices().subscribe(services => this.servicesList = services);
    this.dataService.getSchedules().subscribe(schedules => this.schedules = schedules);
    
    dataService.getServices().subscribe(serv_res => {
      
      serv_res.map(item => {
        if(item.userId === dataService.USER_ID){
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
        }
        
      })
      
    })

    this.dialogService.isAddedNewCostumer.subscribe(value => {
      if(value){
        this.loadClientsList();
      }
    })

    dialogService.transferParams.subscribe(value => {
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
    })

    this.dialogService.transferParams.subscribe(params => {
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

    this.dialogService.showModalAddAppointment.subscribe(value => {
     
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
        if(cl.userId === this.dataService.USER_ID){
          this.clients.push(cl);
        }      
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
    const currentDayOfWeek = this.today.getDay();
    const dayOfWeek = this.getDayOfWeek(currentDayOfWeek);
    const result = this.servicesList.filter(item => item.category === event.value.category);
    result.map(res => {
      const m = this.masters.filter(mast => mast.id === res.masterId);
      m.map(mast => {
        const mst = this.schedules.filter(item => item.dayOfWeek === dayOfWeek && item.masterId === mast.id);
        if(mst.length > 0){
          this.available = mast.id;
        }
      })
    })
    console.log(this.available)
    if(this.available) {
      this.freeMaster = true;
      this.categorySelected = event.value;
    }
    else {
      this.freeMaster = false;
      this.categorySelected = null;
      this.available = null;
      this.myForm.get('isAvailable')?.reset();
    }
    this.available = null;
    this.priceSelected = null;
    this.myForm.get('selectedPrice')?.reset();
  }

  getDayOfWeek(dayIndex: number) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
  }

  getPrice(event: any){
    // console.log(event)
    if(!this.freeMaster){
      this.priceSelected = null;
      this.myForm.get('selectedPrice')?.enable();
      this.myForm.get('selectedPrice')?.setValue('Сегодня мастер недоступен');
      this.myForm.get('selectedPrice')?.disable();
    }
    else {
      this.priceSelected = event.value?.cprice;
      this.myForm.get('selectedPrice')?.enable();
      this.myForm.get('selectedPrice')?.setValue(this.priceSelected);
      this.myForm.get('selectedPrice')?.disable();
      this.myForm.get('isAvailable')?.setValue(true);
    }
  }

  addAppointment() {        
    this.appointment_obj = new AppointmentClass(
      0,
      this.dateForDB,
      this.selectedCostumer.id,
      this.categorySelected.id,
      IN_PROGRESS,
      this.dataService.USER_ID,
    );
    
    this.dataService.addNewAppointment(this.appointment_obj).subscribe(
      () => {
        try {
          this.addEventToCalendarApi(this.params);
          this.messages.showSuccess('Успешно добавлено');
          this.isSubmiting = false;
          this.dataService.updateData(true);
          this.closeModal();
        } catch (error) {
          console.log('catch add appointment', error);
        }
      }, error => {
        this.messages.showError(error);
      }
    )
  }

  addEventToCalendarApi(params: DateSelectArg){
    this.calendarService.addEventToCalendar.emit(params);
  }

  showSuccess(){
    this.messages.showSuccess('Успешно добавлено');
  }

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  openNewCostumerModal(){
    this.dialogService.showModalAddNewCostumer.emit(true);
  }

  submit() {
    // this.isSubmiting = true;
    this.addAppointment();
  }

  onHide(){
    this.available = null;
  }

}
