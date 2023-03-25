import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId } from '../event-utils';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarService } from '../services/calendar.service';
import { DataService } from '../services/data.service';
import { MyMessageService } from '../services/my-message.service';

@Component({
  selector: 'app-test-calendar',
  templateUrl: './test-calendar.component.html',
  styleUrls: ['./test-calendar.component.css']
})
export class TestCalendarComponent {
  calendarVisible = false;
  data$ = this.dataService.data$;
  events: EventInput[] = [];
  calendarOptions: CalendarOptions = {
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
    initialView: 'dayGridMonth',
    events: this.events,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  dateAppointment: any;

  constructor(private changeDetector: ChangeDetectorRef, private calendarService: CalendarService,
    private dataService: DataService,private messages: MyMessageService) {
  }

  ngOnInit() {

    this.calendarService.addEventToCalendar.subscribe(event => {
      // calendarApi.addEvent(event);
    })

    this.data$.subscribe(value => {
      setTimeout(() => {
        
        this.calendarVisible = value;
      }, 500);
      console.log(this.events)
    })
    this.calendarService.loadCalendarData().subscribe(calendar => {
      calendar.map(calendar_results => {
        this.dataService.getSericeById(calendar_results.serviceId).subscribe(service_results => {
          const currentDate = new Date(calendar_results.date);

          this.events.push({
            start: calendar_results.date,
            end: currentDate,
            id: calendar_results.id.toString(),
            title: service_results.name
          })
        });
      });
      this.dataService.updateData(true);

    }, (error) => console.log(error));
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;
    const currentMonth = selectInfo.start.toLocaleDateString();
    const curDay = selectInfo.start.toTimeString();
    calendarApi.unselect(); // clear date selection
    if (selectInfo.allDay) {
      this.dateAppointment = 'Весь день'
      this.messages.showInfo('Выберите время бронирования')
    } else {
      this.dateAppointment = `${currentMonth} ${curDay}`;
      this.calendarService.transferCalendarApi.emit(selectInfo.view.calendar);
      this.transferParamsToModal(selectInfo);
      this.openModal(true);  
      const api = selectInfo.view.calendar;
      
      if (title) {
        api.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        });
      }
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  transferParamsToModal(param: any) {
    this.dataService.transferParams.emit(param)
  }

  public openModal(value: boolean): void {
    this.dataService.showModalAddAppointment.emit(value);
  }
}
