import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from '../interfaces/appointment';
import { Costumer } from '../interfaces/costumer';
import { Service } from '../interfaces/service';
import { Admin } from '../interfaces/admin';
import { User } from '../interfaces/user';
import { MyNode } from '../interfaces/node';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})


export class AppointmentClass implements Appointment {
  id: number;
  date: Date;
  costumerId: number;
  serviceId: number;
  userId: number;
  status: string;
  masterId: number;
  timezoneOffset: number;
  serviceName: string;
  servicePrice: number;

  constructor(
    @Inject(Number) id: number, 
    @Inject(String) date: Date, 
    @Inject(String) costumerId: number, 
    @Inject(String) serviceId: number,
    @Inject(String) status: string,
    @Inject(String) serviceName: string,
    @Inject(Number) userId: number,
    @Inject(Number) servicePrice: number,
    @Inject(Number) masterId: number,
    @Inject(Number) timezoneOffset: number
    ){
      this.id = id;
      this.date = date;
      this.serviceId = serviceId;
      this.costumerId = costumerId;
      this.status = status;
      this.userId = userId;
      this.masterId = masterId;
      this.timezoneOffset = timezoneOffset;
      this.serviceName = serviceName;
      this.servicePrice = servicePrice;
  }

}

export class AdminClass implements Admin {
  id: number;
  name: string;
  password: string;
  email: string;
  
  constructor(userName: string, Password: string, email: string, id: number){
    this.id = id;
    this.name = userName;
    this.password = Password;
    this.email= email;
  }
}

export class CostumerClass implements Costumer {
  id: number;
  name: any;
  email: string;
  phone: string | any;
  language: any;
  userId: number;
  rating: number;
  appointments: Appointment[];
  
  constructor(
    id: number,
    name: any,
    email: string,
    phone: string,
    language: string,
    userId: number,
    rating: number,
    appointments: Appointment[]
  ){
    this.id = id;
    this.name = name;
    this.email = email;
    this.language = language;
    this.userId = userId;
    this.phone = phone;
    this.userId = userId;
    this.appointments = appointments;
    this.rating = rating;
  }
}

export class UserClass implements User {
  id: number;
  name: string;
  password: string;
  userId: number;
  
  constructor(
    id: number,
    name: string,
    password: string,
    userId: number
  ){
    this.id = id;
    this.name = name;
    this.password = password;
    this.userId = userId;
  }
}

export class ServiceClass implements Service {
  id: number;
  name: any;
  price: number;
  userId: number;
  masterId: number;
  category: string;
  status: string;
  
  constructor(
    id: number,
    name: any,
    price: number,
    userId: number,
    masterId: number,
    category: string,
    status: string
  ){
    this.id = id;
    this.name = name;
    this.price = price;
    this.userId = userId;
    this.masterId = masterId;
    this.category = category;
    this.status = status;
  }
}

export class NodeClass implements MyNode {
  data: string;
  label: string;
  price: number;
  constructor(
    data: string,
    label: string,
    price: number
  ){
    this.data = data;
    this.label = label;
    this.price = price;
  }
  
}

