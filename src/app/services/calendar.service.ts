import { Injectable, EventEmitter } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import { Appointment } from '../interfaces/appointment';
import { HttpClient } from '@angular/common/http';
import { APPOINTMENT } from 'src/assets/constants';
import { DataService } from './data.service';
import { AppointmentClass } from '../classes/classes.module';

@Injectable({
  providedIn: 'root'
})
export class CalendarService  {

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

  public transferCalendarApi: EventEmitter<any> = new EventEmitter<any>();
  public addEventToCalendar: EventEmitter<any> = new EventEmitter<any>();
  public addEventToCalendarClickInfo: EventEmitter<any> = new EventEmitter<any>();
  public changeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private dataService: DataService) {
     
  }
 
  loadCalendarData(){
    return this.http.get<Appointment[]>(APPOINTMENT);
  }

  setCalendarApi(value: any){
    this.calendarApi = value;
  }

  getAppointmentObject(id: string) : Appointment{

    const ID = parseInt(id);
   
    this.dataService.getAppointmentById(ID).subscribe(appointment_results => {
      const date = new Date();
      const timezoneOffset = date.getTimezoneOffset();
      this.appointment_class = new AppointmentClass(
        appointment_results.id,
        appointment_results.date,
        appointment_results.costumerId,
        appointment_results.serviceId,
        appointment_results.status,
        this.dataService.USER_ID,
        appointment_results.masterId,
        timezoneOffset
      )

    })

    return this.appointment_class;

  }

}
