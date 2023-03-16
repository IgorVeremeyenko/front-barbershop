import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CalendarOptions, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import { PrimeNGConfig } from 'primeng/api';
import { INITIAL_EVENTS } from 'src/app/event-utils';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  calendarOptions!: CalendarOptions;
  calendarVisible = false;

  service_class: any;
  costumer_class: any;
  appointment_class: any;

  dataLoaded = false;
  calendarApi: EventInput[] = [];

  currentEvents: EventApi[] = [];

  constructor(
    private calendarService: CalendarService,
    private primengConfig: PrimeNGConfig,
    private dataService: DataService
  ) {
    
  }

  ngOnInit() {

    this.calendarOptions = this.calendarService.calendarOptions;
    
    this.primengConfig.ripple = true;

    this.calendarApi = this.calendarService.calendarApi;

    this.calendarService.loadCalendarData().subscribe(calendar => {
      calendar.map(calendar_results => {
        this.dataService.getSericeById(calendar_results.serviceId).subscribe(service_results => {
          const currentDate = new Date(calendar_results.date);
          const minutes = this.addMinutes(currentDate, 30);
          const event: EventInput = {

            start: calendar_results.date,
            end: minutes,
            id: calendar_results.id.toString(),
            title: service_results.name

          }
          INITIAL_EVENTS.push(event);
          // INITIAL_EVENTS = [...INITIAL_EVENTS, event]
        });
      });      
      setTimeout(() => {
        console.log(INITIAL_EVENTS)
        this.calendarOptions.events = INITIAL_EVENTS;
        this.currentEvents = this.calendarService.currentEvents;
        this.dataLoaded = true;   
        this.calendarVisible = true;     
      }, 2000);

    }, (error) => console.log(error))
  }

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

}
