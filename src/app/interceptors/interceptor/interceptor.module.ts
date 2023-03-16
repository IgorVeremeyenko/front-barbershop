import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class InterceptorModule implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'Access-Control-Allow-Origin': 'http://localhost:4200'
      }
    });
    return next.handle(request);
  }
 }
