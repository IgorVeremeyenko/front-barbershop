import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ConfirmationService]
})
export class AppComponent implements OnChanges {
  isLogged$ = this.authService.authInfo;
  showToolbar = true;
  items: MenuItem[];
  constructor(private router: Router, private authService: AuthService, private confirmationService: ConfirmationService){
    this.items = [
      {
          label:'Меню',
          icon:'pi pi-fw pi-file',
          items:[
              {
                  label:'New',
                  icon:'pi pi-fw pi-plus',
                  items:[
                  {
                      label:'Bookmark',
                      icon:'pi pi-fw pi-bookmark'
                  },
                  {
                      label:'Video',
                      icon:'pi pi-fw pi-video'
                  },

                  ]
              },
              {
                  label:'Delete',
                  icon:'pi pi-fw pi-trash'
              },
              {
                  separator:true
              },
              {
                  label:'Export',
                  icon:'pi pi-fw pi-external-link'
              }
          ]
      },
      {
          label:'Edit',
          icon:'pi pi-fw pi-pencil',
          items:[
              {
                  label:'Left',
                  icon:'pi pi-fw pi-align-left'
              },
              {
                  label:'Right',
                  icon:'pi pi-fw pi-align-right'
              },
              {
                  label:'Center',
                  icon:'pi pi-fw pi-align-center'
              },
              {
                  label:'Justify',
                  icon:'pi pi-fw pi-align-justify'
              },

          ]
      },
      {
          label:'Клиенты',
          icon:'pi pi-fw pi-user',
          items:[
              {
                  label:'Добавить клиента',
                  icon:'pi pi-fw pi-user-plus',

              },
              {
                icon:'pi pi-fw pi-users',
                label:'Список',
                command: () => {
                  this.router.navigateByUrl('costumers');
                }
              }
          ]     
      },
      {
          label:'Услуги',
          icon:'pi pi-fw pi-calendar',
          items:[
              {
                  label:'Добавить услугу',
                  icon:'pi pi-plus'
              },
              {
                  label:'Все услуги',
                  icon:'pi pi-shopping-bag',
                  command: () => {
                    router.navigateByUrl('services');
                  }
              }
          ]
      },
      {
          label:'Выход',
          icon:'pi pi-sign-out',
          command: () => {
            this.confirm();
          }
      }
  ];
  this.isLogged$.subscribe(value => {
    this.showToolbar = value;
  })
}

ngOnChanges(changes: SimpleChanges){
  console.log(changes.isLogged$.currentValue)
}

goToMain(){
  this.router.navigateByUrl('');
}

confirm() {
  this.confirmationService.confirm({
    acceptLabel: 'Да',
    rejectLabel: 'Нет',
    message: 'Вы действительно хотите выйти?',
    icon: 'fas fa-exclamation-triangle',
    accept: () => {this.logOut()}
  });
}

logOut() {
  this.authService.logout();
}

}
