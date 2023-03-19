import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-network-error',
  templateUrl: './network-error.component.html',
  styleUrls: ['./network-error.component.css']
})
export class NetworkErrorComponent {
  constructor(private router: Router){}
  goToMain(){
    this.router.navigateByUrl('');
  }
}
