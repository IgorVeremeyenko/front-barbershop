import { Injectable, EventEmitter } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import { Appointment } from '../interfaces/appointment';
import { HttpClient } from '@angular/common/http';
import { ALL_APPOINTMENTS, APPOINTMENT } from 'src/assets/constants';
import { DataService } from './data.service';
import { AppointmentClass } from '../classes/classes.module';
import { Service } from '../interfaces/service';

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
  serviceList: Service[] = [];

  public calendarOptions!: CalendarOptions;
  costumer_class: any;
  service_class: any;
  appointment_class: any;

  USER_ID = 0;

  public transferCalendarApi: EventEmitter<any> = new EventEmitter<any>();
  public addEventToCalendar: EventEmitter<any> = new EventEmitter<any>();
  public addEventToCalendarClickInfo: EventEmitter<any> = new EventEmitter<any>();
  public deleteEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private dataService: DataService) {
     
  }
 
  loadCalendarData(){
    this.USER_ID = this.dataService.USER_ID;
    return this.http.get<Appointment[]>(`${ALL_APPOINTMENTS}${this.USER_ID}`);
  }

  setCalendarApi(value: any){
    this.calendarApi = value;
  }

  getAppointmentObject(id: string) : Appointment{

    const ID = parseInt(id);
   
    this.dataService.getAppointmentById(ID).subscribe(appointment_results => {
      const date = new Date();
      const timezoneOffset = date.getTimezoneOffset();
      let serviceName: string = "";
      this.serviceList.map(serv => {
        if(appointment_results.serviceId === serv.id) serviceName = serv.name;
      })
      let servicePrice = 0;
      this.serviceList.map(serv => {
        if(appointment_results.serviceId === serv.id) servicePrice = serv.price;
      })
      this.appointment_class = new AppointmentClass(
        appointment_results.id,
        appointment_results.date,
        appointment_results.costumerId,
        appointment_results.serviceId,
        appointment_results.status,
        serviceName,
        this.dataService.USER_ID,
        servicePrice,
        appointment_results.masterId,
        timezoneOffset

      )

    })

    return this.appointment_class;

  }

}
