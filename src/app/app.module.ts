import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { ToastsComponent } from './components/toasts/toasts.component';
import { NetworkErrorComponent } from './components/network-error/network-error.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CostumerListComponent } from './components/costumer-list/costumer-list.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { EditServiceComponent } from './dialogs/edit-service/edit-service.component';
import { AddCostumerComponent } from './dialogs/add-costumer/add-costumer.component';
import { TestCalendarComponent } from './test-calendar/test-calendar.component';
import { AddServiceComponent } from './dialogs/add-service/add-service.component';
import { MasterListComponent } from './components/master-list/master-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AddAppointmentComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ViewAppointmentComponent,
    ToastsComponent,
    NetworkErrorComponent,
    NotFoundComponent,
    CostumerListComponent,
    ServiceListComponent,
    EditServiceComponent,
    AddCostumerComponent,
    TestCalendarComponent,
    AddServiceComponent,
    MasterListComponent
  ],
  imports: [
    BrowserModule,
    FullCalendarModule,
    ModulesModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorModule, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
