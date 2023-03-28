import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-network-error',
  templateUrl: './network-error.component.html',
  styleUrls: ['./network-error.component.css']
})
export class NetworkErrorComponent {
  constructor(private router: Router, private authService: AuthService){
    this.authService.blockMenu.emit(true);
  }
  goToMain(){
    this.router.navigateByUrl('');
  }
}
