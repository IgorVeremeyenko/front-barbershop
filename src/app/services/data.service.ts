import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import { Appointment } from '../interfaces/appointment';
import { Service } from '../interfaces/service';
import { Costumer } from '../interfaces/costumer';
import { APPOINTMENT, COSTUMERS, MASTERS, SERVICE } from 'src/assets/constants';
import { MyNode } from '../interfaces/node';
import { DateSelectArg, EventInput } from '@fullcalendar/core';
import { BehaviorSubject } from 'rxjs';
import { INITIAL_EVENTS } from '../event-utils';
import { Master } from '../interfaces/master';

@Injectable({
  providedIn: 'root'
})
export class DataService {  

  USER_ID = 0
  USER_NAME = ''
  SERVICE_ID = 0;
  MASTER_ID = 0;

  dataSubject = new BehaviorSubject(false);
  data$ = this.dataSubject.asObservable();

  service_data_subject = new BehaviorSubject<any>({});
  services$ = this.service_data_subject.asObservable();

  defaults: Appointment = {
    id: 0,
    date: "",
    costumer: {id:0,name:'',email:'',phone: '', userId: this.USER_ID,language:''},
    service: {id:0,name:'',userId:this.USER_ID,masterId:0,price:0,category:'', status: ''},
    costumerId: 0,
    serviceId: 0,
    userId: 0
  }

  appointment_data_subject = new BehaviorSubject<Appointment>(this.defaults);
  costumers$ = this.appointment_data_subject.asObservable();

  public showModalAddAppointment: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalEditService: EventEmitter<boolean> = new EventEmitter<boolean>();
  public transferServiceObject: EventEmitter<Service> = new EventEmitter<Service>();
  public transferCostumerObject: EventEmitter<Appointment> = new EventEmitter<Appointment>();
  public transferParams: EventEmitter<DateSelectArg> = new EventEmitter<DateSelectArg>();

  
  
  constructor(private http:HttpClient) { }

  updateData(newData: boolean) {
    this.dataSubject.next(newData);
  }

  updateServData(newData: Service){
    this.service_data_subject.next(newData);
  }

  updateAppointmentData(newData: Appointment){
    this.appointment_data_subject.next(newData);
  }

  getServices(){
    return this.http.get<Service[]>(SERVICE);
  }

  getMasterById(id: number){
    return this.http.get<Master>(`${MASTERS}${id}`);
  }

  getClients(){
    return this.http.get<Costumer[]>(COSTUMERS);
  }

  getAppointments(){
    return this.http.get<Appointment[]>(APPOINTMENT);
  }
 
  changeServiceById(id: number, body: Service){
    return this.http.put(`${SERVICE}${id}`,body);
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
