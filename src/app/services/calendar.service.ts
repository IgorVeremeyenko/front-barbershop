import { Injectable, ChangeDetectorRef, AfterContentChecked, Optional } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventAddArg, EventApi, EventClickArg } from '@fullcalendar/core';
import { Appointment } from '../interfaces/appointment';
import { HttpClient } from '@angular/common/http';
import { APPOINTMENT } from 'src/assets/constants';
import { DataService } from './data.service';
import { AppointmentClass, CostumerClass, ServiceClass } from '../classes/classes.module';

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
          this.dataService.USER_ID,
          service_results.masterId,
          service_results.category,
          ''
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
