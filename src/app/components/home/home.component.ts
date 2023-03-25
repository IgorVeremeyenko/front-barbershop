import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import { PrimeNGConfig } from 'primeng/api';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataService } from 'src/app/services/data.service';
import { MyMessageService } from 'src/app/services/my-message.service';
import { Router } from '@angular/router';
import ruLocale from '@fullcalendar/core/locales/ru';
import { Appointment } from 'src/app/interfaces/appointment';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MyMessageService]
})
export class HomeComponent {

  @ViewChild('calendar') fullCalendar!: FullCalendarComponent;

  data$ = this.dataService.data$;
  costumer_data$ = this.dataService.appointment_data_subject;

  userName!: string;
  events: EventInput[] = [];

  calendarOptions: CalendarOptions = {
    locale: ruLocale,
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.events,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  }

  calendarVisible = false;

  service_class: any;
  costumer_class: any;
  appointment_class: any;

  dataLoaded = false;
  calendarApi: any;

  items: any;

  currentEvents: EventApi[] = [];

  dateAppointment!: string;
  selectInfo2!: DateSelectArg;
  clickInfoCurrent!: EventClickArg;

  blockedDocument: boolean = false;

  isLoading = false;
  isShown = false;

  appointment_data$ = this.dataService.appointment_data_subject;

  constructor(
    private calendarService: CalendarService,
    private primengConfig: PrimeNGConfig,
    private dataService: DataService,
    private changeDetector: ChangeDetectorRef,
    private messages: MyMessageService,
    private router: Router
  ) {

    
  }


  ngOnInit() {

    // let calendarApi = this.fullCalendar.getApi();
    // console.log(calendarApi)

    this.calendarService.addEventToCalendar.subscribe(add_event => {
      const api = add_event.params.view.calendar;
      api.addEvent(add_event.event);
    })

    this.costumer_data$.subscribe(value => {
      if(value.id != 0) {
        this.isShown = true;
      }
    })

    this.isLoading = true;

    this.data$.subscribe(value => {
      this.userName = this.dataService.USER_NAME;
      if (value) {
        setTimeout(() => {
          this.dataLoaded = true;
          this.calendarVisible = true;
          this.isLoading = false;
          this.unlockDocument();
        }, 1500);
      }
    })

    this.primengConfig.ripple = true;

    this.calendarService.loadCalendarData().subscribe(calendar => {
      calendar.map(calendar_results => {
        this.dataService.getSericeById(calendar_results.serviceId).subscribe(service_results => {
          const currentDate = new Date(calendar_results.date);
          const minutes = this.addMinutes(currentDate, 30);

          this.events.push({
            start: calendar_results.date,
            end: minutes,
            id: calendar_results.id.toString(),
            title: service_results.name
          })
        });
      });
      this.dataService.updateData(true);

    }, (error) => console.log(error));
  }

  showSuccess() {
    this.messages.showSuccess('Успешно добавлено');
  }

  goToToasts() {
    this.router.navigateByUrl('toasts');
  }

  unlockDocument() {
    setTimeout(() => {
      this.blockedDocument = false;
    }, 3000);
  }

  

  editUser() {
    this.messages.showInfo('This option will be avialable soon');
  }

  

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  autoDateSelect(selectInfo: DateSelectArg, event: DateSelectArg){
    const api = selectInfo.view.calendar;
    // api.unselect();
    api.addEvent(event);
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = 'event';
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection
    this.calendarService.transferCalendarApi.emit(calendarApi);
    this.transferParamsToModal(selectInfo);
    this.openModal(true); 
    // if (title) {
    //   calendarApi.addEvent({
    //     id: "0",
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }


  transferParamsToModal(param: any) {
    this.dataService.transferParams.emit(param)
  }

  // myEventClick(selectInfo: DateSelectArg){
    // const currentMonth = selectInfo.start.toLocaleDateString();
    // const curDay = selectInfo.start.toTimeString();
    // if (selectInfo.allDay) {
    //   this.dateAppointment = 'Весь день';
    //   this.messages.showInfo('Выберите время бронирования');
    //   return;
    // } 
    // this.dateAppointment = `${currentMonth} ${curDay}`;
    // this.selectInfo2 = selectInfo;
    // const api = selectInfo.view.calendar;
    // const calendar_event = {
    //   id: "0",
    //   title: 'service_name',
    //   start: this.dateAppointment,
    //   end: this.dateAppointment,
    //   allDay: false
    // }
    // // api.unselect();
    // setTimeout(() => {
    //   api.addEvent({
    //     id: "0",
    //     title: 'service_name',
    //     start: this.dateAppointment,
    //     end: this.dateAppointment,
    //     allDay: false
    //   });      
    // }, 1000);
    // this.calendarService.transferCalendarApi.emit(api);
    // this.transferParamsToModal(selectInfo);
    // this.openModal(true);   
  // }

  handleEventClick(clickInfo: EventClickArg) {
    this.clickInfoCurrent = clickInfo;
    this.calendarService.temporaryForm = clickInfo;
    const ID = parseInt(clickInfo.event.id);
    this.dataService.getAppointmentById(ID).subscribe(result => {
      const appointment: Appointment = {
        id: result.id,
        date: result.date,
        costumerId: result.costumerId,
        serviceId: result.serviceId,
        status: result.status,
        userId: this.dataService.USER_ID,
      }
      this.dataService.updateAppointmentData(appointment);
      
    })
  }

  public openModal(value: boolean): void {
    this.dataService.showModalAddAppointment.emit(value);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  // calendar options methods

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

}
