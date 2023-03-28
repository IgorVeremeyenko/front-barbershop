import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs/internal/Observable';
import { Appointment } from '../interfaces/appointment';
import { Service } from '../interfaces/service';
import { Costumer } from '../interfaces/costumer';
import { APPOINTMENT, COSTUMERS, COUNTRIES_JSON, MASTERS, SERVICE, BUTTON_ITEMS, SCHEDULES, DAYS_JSON, STATISTICS } from 'src/assets/constants';
import { MyNode } from '../interfaces/node';
import { DateSelectArg, EventInput } from '@fullcalendar/core';
import { BehaviorSubject } from 'rxjs';
import { INITIAL_EVENTS } from '../event-utils';
import { Master } from '../interfaces/master';
import { Schedule } from '../interfaces/schedule';
import { Statistics } from '../interfaces/statistics';

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
    costumerId: 0,
    serviceId: 0,
    status: '',
    userId: 0
  }

  appointment_data_subject = new BehaviorSubject<Appointment>(this.defaults);
  costumers$ = this.appointment_data_subject.asObservable();

  public showModalAddAppointment: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalEditService: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalAddService: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalAddNewCostumer: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isAddedNewCostumer: EventEmitter<boolean> = new EventEmitter<boolean>();

  public transferServiceObject: EventEmitter<Service> = new EventEmitter<Service>();
  public transferCostumerObject: EventEmitter<Appointment> = new EventEmitter<Appointment>();
  public transferParams: EventEmitter<DateSelectArg> = new EventEmitter<DateSelectArg>();

  constructor(private http: HttpClient) { }

  updateData(newData: boolean) {
    this.dataSubject.next(newData);
  }

  updateServData(newData: Service) {
    this.service_data_subject.next(newData);
  }

  updateAppointmentData(newData: Appointment) {
    this.appointment_data_subject.next(newData);
  }

  getServices() {
    return this.http.get<Service[]>(SERVICE);
  }

  getMasterById(id: number) {
    return this.http.get<Master>(`${MASTERS}${id}`);
  }

  getClients() {
    return this.http.get<Costumer[]>(COSTUMERS);
  }

  getMasters(){
    return this.http.get<Master[]>(MASTERS);
  }

  getSchedules(){
    return this.http.get<Schedule[]>(SCHEDULES);
  }

  getAppointments() {
    return this.http.get<Appointment[]>(APPOINTMENT);
  }

  changeServiceById(id: number, body: Service) {
    return this.http.put(`${SERVICE}${id}`, body);
  }
  changeAppointmentById(id: number, body: any){
    return this.http.put(`${APPOINTMENT}/${id}`,body);
  }
  addNewAppointment(body: Appointment): Observable<any> {
    return this.http.post(APPOINTMENT, body);
  }
  addNewService(body: Service){
    return this.http.post(SERVICE, body);
  }
  addNewCostumer(body: Costumer){
    return this.http.post(COSTUMERS,body);
  }
  loadCalendarData() {
    return this.http.get<Appointment[]>(APPOINTMENT);
  }
  getSericeById(id: number) {
    return this.http.get<Service>(`${SERVICE}${id}`);
  }
  getCostumerById(id: number) {
    return this.http.get<Costumer>(`${COSTUMERS}${id}`);
  }
  getAppointmentById(id: number) {
    return this.http.get<Appointment>(`${APPOINTMENT}/${id}`);
  }

  removeAppointment(id: number) {
    return this.http.delete(`${APPOINTMENT}/${id}`);
  }

  getCountries(): Observable<any> {
    return this.http.get(COUNTRIES_JSON);
  }

  getDays(): Observable<any[]>{
    return this.http.get<[]>(DAYS_JSON);
  }

  getButtonItems(): Observable<any[]>{
    return this.http.get<[]>(BUTTON_ITEMS);
  }

  getStatistics(){
    return this.http.get<Statistics[]>(STATISTICS);
  }

  postStatistic(body: Statistics){
    return this.http.post(STATISTICS, body);
  }
}
