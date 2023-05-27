import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions, EventInput, EventClickArg, EventApi, DateSelectArg } from '@fullcalendar/core';
import { Appointment } from 'src/app/interfaces/appointment';
import { DataService } from 'src/app/services/data.service';
import { IN_PROGRESS, OLD, CURRENT, REJECTED, WARNING, COMPLETED, SUCCESS, MISSED } from 'src/assets/constants';
import ruLocale from '@fullcalendar/core/locales/ru';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { ActivatedRoute, Router } from '@angular/router';
import { MyMessageService } from 'src/app/services/my-message.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css'],
  providers: [MyMessageService]
})
export class MasterComponent {

  calendarOptions!: CalendarOptions;

  events: EventInput[] = [];

  dataLoaded = false;

  isLoading = true;

  locale = 'ru';

  currentEvents: EventApi[] = [];
  
  openedEvents: any[] = [];

  name: string = '';

  constructor(private messages: MyMessageService, private dataService: DataService, private changeDetector: ChangeDetectorRef, private router: Router, private routeParams: ActivatedRoute){
   
  }

  ngOnInit() {

    this.routeParams.params.subscribe(value => {
      this.name = value['name'];
    })

    this.updateData();

    this.dataService.master$.subscribe(events => {
      if(events.length === 0) {
        this.router.navigateByUrl('colleagues');
        return;
      }
      this.dataLoaded = false;
      events.map(item => {
        const minutes = this.addMinutes(item.date, 30);
        let colors = {
          background: '',
          color: ''
        };
        if(item.status === 'Выполняется') {
          this.openedEvents.push({
            start: item.date,
            end: minutes,
            id: item.id.toString(),
            title: item.serviceName,
            backgroundColor: colors.background,
            color: colors.color
          })
        }
        const selectedDate = new Date(item.date);
        const today = new Date();
        switch (item.status) {
          case IN_PROGRESS: {
            if (selectedDate < today) {
              colors.background = OLD;
            }
            else {
              colors.background = CURRENT;
            }
          }
            break;
          case REJECTED: {
            colors.background = WARNING;
          }
            break;
          case COMPLETED: {
            colors.background = SUCCESS;
          }
            break;
          case MISSED: {
            colors.background = WARNING;
          }
            break;
        }
        this.events.push({
            start: item.date,
            end: minutes,
            id: item.id.toString(),
            title: item.serviceName,
            backgroundColor: colors.background,
            color: colors.color
        })
      })
      this.updateData();
      this.dataLoaded = true;
      this.isLoading = false;
    }, ()=> {this.dataLoaded = true; this.isLoading = false}, ()=> {this.dataLoaded = true; this.isLoading = false})
  }

  updateData(){
    
    this.calendarOptions = {
      locale: ruLocale,
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      slotMinTime: '09:00:00',
      slotMaxTime: '20:00:00',
      initialView: 'dayGridMonth',
      initialEvents: this.events,
      weekends: true,
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      nowIndicator: true,
      now: new Date(),
      
    }
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.messages.showInfo('Для назначения встречи, перейдите в главное меню')
  }
  
  handleEventClick(clickInfo: EventClickArg) {
    const ID = parseInt(clickInfo.event.id);
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset();
    this.dataService.getAppointmentById(ID).subscribe(result => {
      const appointment: Appointment = {
        id: result.id,
        date: result.date,
        costumerId: result.costumerId,
        serviceId: result.serviceId,
        status: result.status,
        userId: this.dataService.USER_ID,
        masterId: result.masterId,
        timezoneOffset: timezoneOffset,
        serviceName: result.serviceName,
        servicePrice: result.servicePrice
      }
      this.dataService.updateAppointmentData(appointment);

    })
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  addMinutes(date: Date, minutes: number) {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  }

  currentMaster(event: any) {
    const ID = parseInt(event.value.id);
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset();
    this.dataService.getAppointmentById(ID).subscribe(result => {
      const appointment: Appointment = {
        id: result.id,
        date: result.date,
        costumerId: result.costumerId,
        serviceId: result.serviceId,
        status: result.status,
        userId: this.dataService.USER_ID,
        masterId: result.masterId,
        timezoneOffset: timezoneOffset,
        serviceName: result.serviceName,
        servicePrice: result.servicePrice
      }
      this.dataService.updateAppointmentData(appointment);

    })
  }

}
