import { Component } from '@angular/core';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.css'],
  providers: [MyMessageService]
})
export class ToastsComponent {

  constructor(private messages: MyMessageService){}

  showSuccess(){
    this.messages.showSuccess('Успешно добавлено');
  }

  onConfirm() {
    
}

onReject() {
   
}

}
