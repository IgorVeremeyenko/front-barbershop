import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import { Appointment } from '../interfaces/appointment';
import { Service } from '../interfaces/service';
import { Costumer } from '../interfaces/costumer';
import { APPOINTMENT, COSTUMERS, SERVICE, SERVICES } from 'src/assets/constants';
import { MyNode } from '../interfaces/node';
import { DateSelectArg, EventInput } from '@fullcalendar/core';
import { BehaviorSubject } from 'rxjs';
import { INITIAL_EVENTS } from '../event-utils';

@Injectable({
  providedIn: 'root'
})
export class DataService {  

  dataSubject = new BehaviorSubject(false);
  data$ = this.dataSubject.asObservable();

  public showModalAddAppointment: EventEmitter<boolean> = new EventEmitter<boolean>();
  public transferParams: EventEmitter<DateSelectArg> = new EventEmitter<DateSelectArg>();

  USER_ID = 0
  
  constructor(private http:HttpClient) { }

  updateData(newData: boolean) {
    this.dataSubject.next(newData);
  }

  getServices(){
    return this.http.get<MyNode[]>(SERVICES);
  }

  getClients(): any{
    return this.http.get(COSTUMERS);
  }
  addNewAppointment(body: Appointment): Observable<any>{
    return this.http.post(APPOINTMENT, body);
  }
  loadCalendarData(){
    return this.http.get<Appointment[]>(APPOINTMENT);
  }
  getSericeById(id: number){
    return this.http.get<Service>(`${SERVICE}${id}`);
  }
  getCostumerById(id: number){
    return this.http.get<Costumer>(`${COSTUMERS}${id}`);
  }
  getAppointmentById(id: number){
    return this.http.get<Appointment>(`${APPOINTMENT}/${id}`);
  }

  removeAppointment(id: number){
    return this.http.delete(`${APPOINTMENT}/${id}`);
  }
}
