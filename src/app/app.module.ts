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
import { AddServiceComponent } from './dialogs/add-service/add-service.component';
import { MasterListComponent } from './components/master-list/master-list.component';
import { MasterEditComponent } from './dialogs/master-edit/master-edit.component';
import { PhoneFieldComponent } from './components/master-edit-fields/phone-field/phone-field.component';
import { DaysFieldComponent } from './components/master-edit-fields/days-field/days-field.component';
import { AddMasterComponent } from './dialogs/add-master/add-master.component';
import { ResetPasswordComponent } from './components/account/reset-password/reset-password.component';
import { PasswordComponent } from './components/account/password/password.component';
import { EnterOtpComponent } from './dialogs/enter-otp/enter-otp.component';
import { MasterComponent } from './components/master/master.component';

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
    AddServiceComponent,
    MasterListComponent,
    MasterEditComponent,
    PhoneFieldComponent,
    DaysFieldComponent,
    AddMasterComponent,
    ResetPasswordComponent,
    PasswordComponent,
    EnterOtpComponent,
    MasterComponent
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
