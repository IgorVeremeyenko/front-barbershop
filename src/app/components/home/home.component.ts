import { ChangeDetectorRef, Component } from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  data$ = this.dataService.data$;

  calendarOptions!: CalendarOptions;
  calendarVisible = false;

  service_class: any;
  costumer_class: any;
  appointment_class: any;

  dataLoaded = false;
  calendarApi: any;
  events: EventInput[] = [];

  currentEvents: EventApi[] = [];

  dateAppointment!: string;
  selectInfo2!: DateSelectArg;
  clickInfoCurrent!: EventClickArg;

  blockedDocument: boolean = false;

  isLoading = false;

  constructor(
    private calendarService: CalendarService,
    private primengConfig: PrimeNGConfig,
    private dataService: DataService,
    private changeDetector: ChangeDetectorRef,
    private messages: MyMessageService,
    private router: Router
  ) {
    this.calendarOptions = {
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
      // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
      events: this.events,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this)
      /* you can update a remote database when these fire:
      eventChange:
      eventRemove:
      eventAdd:
      */
    }
  }


  ngOnInit() {

    this.isLoading = true;

    this.data$.subscribe(value => {
      if(value){
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

  showSuccess(){
    this.messages.showSuccess('Успешно добавлено');
  }

  goToToasts(){
    this.router.navigateByUrl('toasts');
  }

  unlockDocument() {
    setTimeout(() => {
        this.blockedDocument = false;
    }, 3000);
}

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const currentMonth = selectInfo.start.toLocaleDateString();
    const curDay = selectInfo.start.toTimeString();
    if(selectInfo.allDay){
      this.dateAppointment = 'Весь день'
      this.transferParamsToModal(this.dateAppointment);
    }else {
      this.dateAppointment = `${currentMonth} ${curDay}`;
      
      this.transferParamsToModal(selectInfo);
    }
    this.selectInfo2 = selectInfo;
    this.calendarApi = selectInfo.view.calendar;
    this.calendarService.calendarApi = this.calendarApi;
    this.calendarApi.unselect(); // clear date selection
    this.openModal(true);
  }

  
  transferParamsToModal(param: any) {
    this.dataService.transferParams.emit(param)
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.clickInfoCurrent = clickInfo;
    // this.temporaryForm = this.getAppointmentObject(clickInfo.event.id);
    //todo open modal
    console.log(clickInfo)
  }

  public openModal(value: boolean): void {
    this.dataService.showModalAddAppointment.emit(value);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

}
