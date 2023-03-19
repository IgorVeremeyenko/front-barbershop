import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
  // faCoffee = faCoffee;
  constructor(private router: Router){}

  goToMain(){
    this.router.navigateByUrl('');
  }
}
