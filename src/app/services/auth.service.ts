import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Admin } from '../interfaces/admin';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ADMIN_BY_ID, LOGIN, REGISTRATION, RESET, RESET_ADMIN, TOKEN_VALIDATION, VALIDATE_OTP } from 'src/assets/constants';
import { Router } from '@angular/router';
import { ResetPassword } from '../interfaces/reset-password';
import { ResponseOTP } from '../interfaces/responseOTP';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authInfo = new BehaviorSubject(true);
  dataUserAuth$ = this.authInfo.asObservable();

  public blockMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  checkAuth(token: any){
    return this.http.get<string>(`${TOKEN_VALIDATION}${token}`).pipe(
      catchError((error: HttpErrorResponse) => { 
        if(error.error === 'Token is expired'){
          this.blockMenu.emit(true);
          this.router.navigateByUrl('login');
          return throwError(error);
        }    
        if(error.name === 'HttpErrorResponse'){
          this.blockMenu.emit(true);
          this.router.navigateByUrl('network-error');
          return error.status.toString();
        }
        if(error.status === 400){
          if(error.error === 'Token is expired'){
            this.blockMenu.emit(true);
            this.router.navigateByUrl('login');
          }
          return error.status.toString();
        }
        else {
        }

        return throwError(error);
      })
    )
  }

  login(body: Admin) {

    return this.http.post<any>(LOGIN, body)
      .pipe(
        // сохраняем токен доступа в localStorage
        map(response => {
          localStorage.setItem('access_token', response);
          return response;
        })
      );
  }
  
  registerUser(body: Admin){
    return this.http.post(REGISTRATION, body);
  }

  sendCodeForAdmin(body: ResetPassword){
    return this.http.post(RESET_ADMIN,body);
  }

  editAdminById(id: number, body: Admin){
    return this.http.put(`${ADMIN_BY_ID}${id}`, body);
  }

  validateOtp(otp: number, email: string): Observable<ResponseOTP>{
    return this.http.post<ResponseOTP>(`${VALIDATE_OTP}${otp}?email=${email}`, otp);
  }

  logout() {
    // удаляем токен из localStorage
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('login');
  }

  get currentUser() {
    // получаем пользователя из токена в localStorage
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  }

  setAuthStatus(value: boolean){
    this.authInfo.next(value);
  }
}
