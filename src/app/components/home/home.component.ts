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
import { COMPLETED, CURRENT, IN_PROGRESS, MISSED, OLD, REJECTED, SUCCESS, WARNING } from 'src/assets/constants';
import { AuthService } from 'src/app/services/auth.service';
import { Statistics } from 'src/app/interfaces/statistics';
import { DialogService } from 'src/app/services/dialog.service';

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

  calendarOptions!: CalendarOptions;

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

  calendarEvent: any;

  isLoading = false;
  isShown = false;

  appointment_data$ = this.dataService.appointment_data_subject;

  statistic_obj!: Statistics;

  constructor(
    private calendarService: CalendarService,
    private primengConfig: PrimeNGConfig,
    private dataService: DataService,
    private changeDetector: ChangeDetectorRef,
    private messages: MyMessageService,
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService
  ) {

    this.primengConfig.ripple = true;

    
    
  }


  ngOnInit() {

    this.authService.blockMenu.emit(false);

    this.updateData();

    this.calendarService.addEventToCalendarClickInfo.subscribe(value => {
      const ID = parseInt(value.info.event.id)
      const costumer_ID = value.costumerId;
      const isComplete = value.status == COMPLETED;
      const ev: EventInput = {
        id: value.info.event.id,
        backgroundColor: value.col
      }
      let temp: Appointment = {
        id: 0,
        date: '',
        costumerId: 0,
        serviceId: 0,
        status: '',
        userId: 0
      }
      this.statistic_obj = {
        id: 0,
        costumerId: costumer_ID,
        userId: this.dataService.USER_ID,
        complete: isComplete ? 1 : 0
      }
      this.dataService.getAppointmentById(ID).subscribe(app => {
        temp = app;
        temp.status = value.status;
        this.dataService.changeAppointmentById(ID,temp).subscribe(() => {
          this.dataService.postStatistic(this.statistic_obj).subscribe(res => {
            console.log('home 114', res);
            this.messages.showSuccess('Статус изменен')
            this.handleEventChange(ev);
          })
        }, error => console.log(error))
      },error => console.log(error));
    })
        
    this.calendarService.addEventToCalendar.subscribe(() => {
      if(this.events.length > 0) this.events = [];
      this.updateData();
    })
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

  updateData(){

    this.calendarOptions = {
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
      slotMinTime: '09:00:00',
      slotMaxTime: '20:00:00',
      initialView: 'dayGridMonth',
      initialEvents: this.events,
      weekends: true,
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventChange: this.handleEventChange.bind(this)
    }

    this.costumer_data$.subscribe(value => {
      if(value.id != 0) {
        this.isShown = true;
      }
    })
    
    this.dataLoaded = false;
    this.isLoading = true;
    this.calendarVisible = false;
    this.calendarService.loadCalendarData().subscribe(calendar => {
      calendar.map(calendar_results => {
        if(calendar_results.userId === this.dataService.USER_ID){
          this.dataService.getSericeById(calendar_results.serviceId).subscribe(service_results => {
            const currentDate = new Date(calendar_results.date);
            const minutes = this.addMinutes(currentDate, 30);
            let colors = {
              background: '',
              color: ''
            };
            const selectedDate = new Date(calendar_results.date);
            const today = new Date();
            switch(calendar_results.status){
              case IN_PROGRESS: {
                if (selectedDate < today) {
                   colors.background = OLD;
                 }
                 else {
                   colors.background = CURRENT;
                 }
              }
              break;
              case REJECTED: {
                colors.background = WARNING;
              }
              break;
              case COMPLETED: {
                colors.background = SUCCESS;
              }
              break;
              case MISSED: {
                colors.background = WARNING;
              }
              break;
            }
            
           
            this.events.push({
              start: calendar_results.date,
              end: minutes,
              id: calendar_results.id.toString(),
              title: service_results.name,
              backgroundColor: colors.background,
              color: colors.color
            })
          });
        }
        
      });
      this.userName = this.dataService.USER_NAME;
      // this.dataService.updateData(true);
      setTimeout(() => {
        this.dataLoaded = true;
        this.calendarVisible = true;
        this.isLoading = false;
        this.unlockDocument();
      }, 1000);

    }, (error) => console.log(error));
  }

  editUser() {
    this.messages.showInfo('This option will be avialable soon');
  }

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const today = new Date();
    if(selectInfo.allDay){
      this.messages.showInfo('Выберите конкретное время');
      return;
    }
    else if(selectInfo.start < today){
      this.calendarApi = selectInfo.view.calendar;
      this.messages.showInfo('Это старая дата');
      this.calendarApi.unselect(); // clear date selection
      return;
    }
    this.selectInfo2 = selectInfo;
    this.calendarApi = selectInfo.view.calendar;
    this.calendarApi.unselect(); // clear date selection
    this.calendarService.transferCalendarApi.emit(this.calendarApi);
    this.transferParamsToModal(selectInfo);
    this.openModal(true);
    
  }


  transferParamsToModal(param: any) {
    this.dialogService.transferParams.emit(param)
  }

  handleEventChange(eventInfo: EventInput){
    console.log(eventInfo)
  }

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
    this.dialogService.showModalAddAppointment.emit(value);
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
