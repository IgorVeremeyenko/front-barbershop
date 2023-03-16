import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private dataService: DataService){}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('access_token');
    return this.authService.checkAuth(token).pipe(      
      map((res) => {
      if(res === '4'){
        console.log(res);
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('login');
        return false
      }
      else {
        this.dataService.USER_ID = parseInt(res);
        return true;
      }
    }));
  }
}
