import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../interfaces/admin';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { LOGIN, REGISTRATION, TOKEN_VALIDATION } from 'src/assets/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authInfo = new BehaviorSubject(true);
  dataUserAuth$ = this.authInfo.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  checkAuth(token: any){
    return this.http.get<string>(`${TOKEN_VALIDATION}${token}`).pipe(
      catchError((error: HttpErrorResponse) => { 
        if(error.error === 'Token is expired'){
          this.router.navigateByUrl('login');
          return throwError(error);
        }    
        if(error.name === 'HttpErrorResponse'){
          this.router.navigateByUrl('network-error');
          return error.status.toString();
        }
        if(error.status === 400){
          if(error.error === 'Token is expired'){
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
          localStorage.setItem('access_token', response.tokenString);
          return response;
        })
      );
  }
  
  registerUser(body: Admin){
    return this.http.post(REGISTRATION, body);
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
