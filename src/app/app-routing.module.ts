import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/account/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/account/register/register.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { NetworkErrorComponent } from './components/network-error/network-error.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegisterComponent },
  { path: 'toasts', component: ToastsComponent },
  { path: 'network-error', component: NetworkErrorComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
