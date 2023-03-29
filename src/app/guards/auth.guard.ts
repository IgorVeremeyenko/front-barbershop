import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private authService: AuthService, private router: Router, private dataService: DataService){}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('access_token'); 
    return this.authService.checkAuth(token).pipe(      
      map((res: any) => {
      if(res === '4'){
        localStorage.removeItem('access_token');
        this.router.navigateByUrl('login');
        this.authService.blockMenu.emit(true);
        return false
      }
      else {
        this.dataService.USER_ID = parseInt(res.id);
        this.dataService.USER_NAME = res.name;
        return true;
      }
    }));
  }
}
