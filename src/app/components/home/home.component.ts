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
import { CostumerClass, ServiceClass } from 'src/app/classes/classes.module';
import { Costumer } from 'src/app/interfaces/costumer';
import { Appointment } from 'src/app/interfaces/appointment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MyMessageService]
})
export class HomeComponent {

  data$ = this.dataService.data$;

  userName!: string;

  calendarOptions!: CalendarOptions;
  calendarVisible = false;

  service_class: any;
  costumer_class: any;
  appointment_class: any;

  dataLoaded = false;
  calendarApi: any;
  events: EventInput[] = [];

  items: any;

  currentEvents: EventApi[] = [];

  dateAppointment!: string;
  selectInfo2!: DateSelectArg;
  clickInfoCurrent!: EventClickArg;

  blockedDocument: boolean = false;

  isLoading = false;
  isShown = false;

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

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const currentMonth = selectInfo.start.toLocaleDateString();
    const curDay = selectInfo.start.toTimeString();
    if (selectInfo.allDay) {
      this.dateAppointment = 'Весь день'
      this.transferParamsToModal(this.dateAppointment);
    } else {
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
    this.calendarService.temporaryForm = clickInfo;
    const ID = parseInt(clickInfo.event.id);
    let costumer: CostumerClass = new CostumerClass(
      0,'','','','',0
    );
    let service = new ServiceClass(0,'',0,0,0,'');
    this.dataService.getAppointmentById(ID).subscribe(result => {
      this.dataService.getCostumerById(result.costumerId).subscribe(costumer_res => {
        this.dataService.getSericeById(result.serviceId).subscribe(service_res => {
          console.log(service_res);
          costumer = new CostumerClass(
            result.costumerId,
            costumer_res.name,
            costumer_res.email,
            costumer_res.phone,
            costumer_res.language,
            this.dataService.USER_ID
          )
          service = new ServiceClass(
            result.serviceId,
            service_res.name,
            service_res.price,
            this.dataService.USER_ID,
            service_res.masterId,
            service_res.category
          )
          const appointment: Appointment = {
            id: 0,
            date: '',
            costumer: costumer,
            service: service,
            costumerId: costumer_res.id,
            serviceId: service_res.id,
            userId: this.dataService.USER_ID
          }
          this.dataService.updateCostumerData(costumer);
          console.log(costumer)
          this.isShown = true;
        })
      })
    })
    // this.temporaryForm = this.getAppointmentObject(clickInfo.event.id);
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
