import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppComponent } from './app.component';
import { ModulesModule } from './modules/modules.module';
import { AddAppointmentComponent } from './dialogs/add-appointment/add-appointment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { InterceptorModule } from './interceptors/interceptor/interceptor.module';
import { RegisterComponent } from './components/account/register/register.component';
import { LoginComponent } from './components/account/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ViewAppointmentComponent } from './dialogs/view-appointment/view-appointment.component';

@NgModule({
  declarations: [
    AppComponent,
    AddAppointmentComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ViewAppointmentComponent
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    ModulesModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorModule, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
