import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MyMessageService {

  constructor(private messageService: MessageService) { }

  showError(detail: any) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
  }
  showInfo(detail: any) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: detail });
  }
  showSuccess(detail: any) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: detail });
  }
  
}
