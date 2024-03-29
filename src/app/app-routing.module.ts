import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/account/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/account/register/register.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { NetworkErrorComponent } from './components/network-error/network-error.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CostumerListComponent } from './components/costumer-list/costumer-list.component';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { MasterListComponent } from './components/master-list/master-list.component';
import { ResetPasswordComponent } from './components/account/reset-password/reset-password.component';
import { PasswordComponent } from './components/account/password/password.component';
import { MasterComponent } from './components/master/master.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegisterComponent },
  { path: 'toasts', component: ToastsComponent, canActivate: [AuthGuard] },
  { path: 'network-error', component: NetworkErrorComponent },
  { path: 'costumers', component: CostumerListComponent, canActivate: [AuthGuard] },
  { path: 'services', component: ServiceListComponent, canActivate: [AuthGuard] },
  { path: 'colleagues', component: MasterListComponent, canActivate: [AuthGuard] },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'password', component: PasswordComponent },
  { path: 'master/:name', component: MasterComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
