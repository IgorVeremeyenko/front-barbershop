import { AfterViewInit, Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ConfirmationService]
})
export class AppComponent implements OnChanges  {
  isLogged$ = this.authService.authInfo;
  showToolbar = true;
  items: MenuItem[] = [];
  searchMenuItems: MenuItem[] = [];
  searchQuery!: string;
  blockMenu = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private dataService: DataService,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.ripple = true;
    this.resetMenu();
    this.searchMenuItems = [...this.items];
    this.isLogged$.subscribe(value => {
      this.showToolbar = value;
    });
    
  }
  
  ngOnInit(){
    this.authService.blockMenu.subscribe(value => {
      this.blockMenu = value;
      this.resetMenu();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.isLogged$.currentValue)
  }

  goToMain() {
    this.router.navigateByUrl('');
  }

  confirm() {
    this.confirmationService.confirm({
      acceptLabel: 'Да',
      rejectLabel: 'Нет',
      message: 'Вы действительно хотите выйти?',
      icon: 'fas fa-exclamation-triangle',
      accept: () => { this.logOut() }
    });
  }

  logOut() {
    this.authService.logout();
  }

  filterMenuItems(value: any) {
    // применяем поиск к элементам меню
    this.searchMenuItems = this.items.filter((item) =>
      item.label?.toLowerCase().includes(value.target.value.toLowerCase())
    );
    
    if(this.searchMenuItems.length < 1 || value.target.value === ""){
      this.resetMenu();
    }
    else {
      this.items = this.searchMenuItems
    }
  }

  resetMenu(){
    this.searchMenuItems = [];
    this.items = [
      {
        label: 'Меню',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Bookmark',
                icon: 'pi pi-fw pi-bookmark'
              },
              {
                label: 'Video',
                icon: 'pi pi-fw pi-video'
              },

            ]
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash'
          },
          {
            separator: true
          },
          {
            label: 'Export',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      },
      {
        label: 'Мастера',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Добавить',
            icon: 'pi pi-fw pi-user-plus'
          },
          {
            label: 'Список',
            icon: 'pi pi-fw pi-list',
            command: () => {
              this.router.navigateByUrl('colleagues')
            }
          }

        ]
      },
      {
        label: 'Клиенты',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Добавить клиента',
            icon: 'pi pi-fw pi-user-plus',
            command: () => {
              this.searchQuery = '';
              this.resetMenu();
              this.dataService.showModalAddNewCostumer.emit(true);
            }
          },
          {
            icon: 'pi pi-fw pi-users',
            label: 'Список',
            command: () => {
              this.searchQuery = '';
              this.resetMenu();
              this.router.navigateByUrl('costumers');
            }
          }
        ]
      },
      {
        label: 'Услуги',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Добавить услугу',
            icon: 'pi pi-plus',
            command: () => {
              this.searchQuery = '';
              this.resetMenu();
              this.dataService.showModalAddService.emit(true);
            }
          },
          {
            label: 'Все услуги',
            icon: 'pi pi-shopping-bag',
            command: () => {
              this.searchQuery = '';
              this.resetMenu();
              this.router.navigateByUrl('services');
            }
          }
        ]
      },
      {
        label: 'Выход',
        icon: 'pi pi-sign-out',
        command: () => {
          this.searchQuery = '';
          this.resetMenu();
          this.confirm();
        },
        disabled: this.blockMenu
      }
    ];
  }

}
