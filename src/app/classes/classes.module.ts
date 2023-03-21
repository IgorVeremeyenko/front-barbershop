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
  date: string | Date;
  costumer: Costumer;
  service: Service;
  costumerId: number;
  serviceId: number;
  userId: number;

  constructor(
    @Inject(Number) id: number, 
    @Inject(String) date: string | Date, 
    @Inject(String) costumer: Costumer, 
    @Inject(String) service: Service, 
    @Inject(String) costumerId: number, 
    @Inject(String) serviceId: number,
    @Inject(String) userId: number
    ){
      this.id = id;
      this.date = date;
      this.costumer = costumer;
      this.service = service;
      this.serviceId = serviceId;
      this.costumerId = costumerId;
      this.userId = userId
  }

}

export class AdminClass implements Admin {
  userName: string;
  Password: string;
  
  constructor(userName: string, Password: string){
    this.userName = userName;
    this.Password = Password;
  }
}

export class CostumerClass implements Costumer {
  id: number;
  name: any;
  email: string;
  phone: string | any;
  language: any;
  userId: number;
  
  constructor(
    id: number,
    name: any,
    email: string,
    phone: string,
    language: string,
    userId: number
  ){
    this.id = id;
    this.name = name;
    this.email = email;
    this.language = language;
    this.userId = userId;
    this.phone = phone
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

