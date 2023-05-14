import { ChangeDetectorRef, Component } from '@angular/core';
import ruLocale from '@fullcalendar/core/locales/ru';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import { Appointment } from 'src/app/interfaces/appointment';
import { DataService } from 'src/app/services/data.service';
import { DialogService } from 'src/app/services/dialog.service';
import { COMPLETED, CURRENT, IN_PROGRESS, MISSED, OLD, REJECTED, SUCCESS, WARNING } from 'src/assets/constants';

@Component({
  selector: 'app-show-calendar-masters',
  templateUrl: './show-calendar-masters.component.html',
  styleUrls: ['./show-calendar-masters.component.css']
})
export class ShowCalendarMastersComponent {

  calendarOptions!: CalendarOptions;

  events: EventInput[] = [];

  visible: boolean = false;

  dataLoaded = false;

  constructor(private dataService: DataService, private changeDetector: ChangeDetectorRef, private dialogService: DialogService){

    this.updateData();

    this.dialogService.transferDataForMastersCalendar.subscribe(events => {
      this.dataLoaded = false;
      events.map(item => {
        const minutes = this.addMinutes(item.date, 30);
        let colors = {
          background: '',
          color: ''
        };
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
      this.visible = true;
      this.dataLoaded = true;
    }, ()=> this.dataLoaded = true, ()=> this.dataLoaded = true)

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
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      nowIndicator: true,
      now: new Date(),
      
    }
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
    this.changeDetector.detectChanges();
  }

  addMinutes(date: Date, minutes: number) {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
  }

  hide(){
    this.visible = false;
    this.events = [];
  }
}
