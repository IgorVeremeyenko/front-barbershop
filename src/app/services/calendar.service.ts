import { Injectable, ChangeDetectorRef, AfterContentChecked, Optional } from '@angular/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, DateSelectArg, EventAddArg, EventApi, EventClickArg } from '@fullcalendar/core';
import { INITIAL_EVENTS } from 'src/app/event-utils';
import { Appointment } from '../interfaces/appointment';
import { HttpClient } from '@angular/common/http';
import { APPOINTMENT } from 'src/assets/constants';
import { DataService } from './data.service';
import { AppointmentClass, CostumerClass, ServiceClass } from '../classes/classes.module';

@Injectable({
  providedIn: 'root'
})
export class CalendarService implements AfterContentChecked  {

  dateAppointment!: string;
  selectInfo2!: DateSelectArg;
  calendarApi: any;
  clickInfoCurrent!: EventClickArg;
  temporaryForm: any;
  currentEvents: EventApi[] = [];

  public calendarOptions!: CalendarOptions;
  costumer_class: any;
  service_class: any;
  appointment_class: any;

  constructor(private http: HttpClient, private dataService: DataService, @Optional() private changeDetector: ChangeDetectorRef) {
    
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
      events: INITIAL_EVENTS,
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      eventAdd: this.handleEventAdd.bind(this)
      /* you can update a remote database when these fire:
      eventChange:
      eventRemove:
      */
    }

   
  }
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
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
    this.calendarApi.unselect(); // clear date selection
    console.log(this.calendarApi)
    this.openModal(true);
  }

  
  transferParamsToModal(param: any) {
    this.dataService.transferParams.emit(param)
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.clickInfoCurrent = clickInfo;
    this.temporaryForm = this.getAppointmentObject(clickInfo.event.id);
    //todo open modal
    console.log(clickInfo)
  }

  public openModal(value: boolean): void {
    this.dataService.showModalAddAppointment.emit(value);
  }

  handleEventAdd(event: EventAddArg) {
    // todo
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    // this.changeDetector.detectChanges();
  }

  loadCalendarData(){
    return this.http.get<Appointment[]>(APPOINTMENT);
  }

  getAppointmentObject(id: string) : Appointment{

    const ID = parseInt(id);
   
    this.dataService.getAppointmentById(ID).subscribe(appointment_results => {

      this.dataService.getCostumerById(appointment_results.costumerId).subscribe(costumer_results => {

        this.costumer_class = new CostumerClass(

          costumer_results.id,
          costumer_results.name,
          "",
          costumer_results.phone,
          costumer_results.language,
          this.dataService.USER_ID
        )
      });

      this.dataService.getSericeById(appointment_results.serviceId).subscribe(service_results => {

        this.service_class = new ServiceClass(
          service_results.id,
          service_results.name,
          service_results.price,
          this.dataService.USER_ID
        )
      });

      this.appointment_class = new AppointmentClass(

        appointment_results.id,
        appointment_results.date,
        this.costumer_class,
        this.service_class,
        appointment_results.costumerId,
        appointment_results.serviceId,
        this.dataService.USER_ID
      )

    })

    return this.appointment_class;

  }

}
