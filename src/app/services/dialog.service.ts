import { EventEmitter, Injectable } from '@angular/core';
import { Service } from '../interfaces/service';
import { Appointment } from '../interfaces/appointment';
import { DateSelectArg } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public showModalEditMaster: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalAddAppointment: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalEditService: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalAddService: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalAddNewCostumer: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalAddNewMaster: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalCalendarMasters: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showModalEnterOtp: EventEmitter<boolean> = new EventEmitter<boolean>();

  public transferIdForAdmin: EventEmitter<number> = new EventEmitter<number>();
  public transferParamsToPhoneField: EventEmitter<any> = new EventEmitter<any>();
  public isAddedNewCostumer: EventEmitter<boolean> = new EventEmitter<boolean>();
  public transferServiceObject: EventEmitter<Service> = new EventEmitter<Service>();
  public transferCostumerObject: EventEmitter<Appointment> = new EventEmitter<Appointment>();
  public transferParams: EventEmitter<DateSelectArg> = new EventEmitter<DateSelectArg>();
  public transferEditMasterDetails: EventEmitter<any> = new EventEmitter<any>();
  public reloadPageServiceList: EventEmitter<boolean> = new EventEmitter<boolean>();
  public transferDataForMastersCalendar: EventEmitter<Appointment[]> = new EventEmitter<Appointment[]>();

  constructor() { }
}
