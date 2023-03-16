import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateSelectArg } from '@fullcalendar/core';
import { map } from 'rxjs';
import { AppointmentClass, CostumerClass, ServiceClass } from 'src/app/classes/classes.module';
import { MyNode } from 'src/app/interfaces/node';
import { Service } from 'src/app/interfaces/service';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataService } from 'src/app/services/data.service';
import { MyMessageService } from 'src/app/services/my-message.service';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent implements OnInit {

  appointment_obj!: AppointmentClass;
  costumer_obj!: CostumerClass;
  service_obj!: ServiceClass;
  myForm!: FormGroup;
  isSubmiting = false;
  date!: Date | string;
  dateForDB!: Date;
  selectedNode: any[] = [];
  calendarApi: any;
  allDay: boolean = false;
  selectedNode2: MyNode = {
    data: '',
    label: '',
    price: 0
  };
  nodes1!: any[];
  nodes2!: any[];

  @Input() displayModal: boolean = false;
  @Input() arrivedParams: any;

  constructor(private dataService: DataService, private nodeService: NodeService, private messages: MyMessageService, private calendarService: CalendarService) {
    this.myForm = new FormGroup({

      "userName": new FormControl("Ivan", Validators.required),
      "userPhone": new FormControl("", [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]),
      "selectedLang": new FormControl("Русский"),
      "selectedService": new FormControl("", Validators.required)
    });

  }

  ngOnInit(): void {

    this.dataService.transferParams.subscribe(params => {
      if (typeof (params) === 'string') {
        this.date = params;
        this.allDay = true;
      }
      else {
        this.dateForDB = params.start;
        const dateObj = new Date(params.start);
        const formatter = new Intl.DateTimeFormat('ru', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: 'numeric',
          minute: 'numeric'
        });

        const result = formatter.format(dateObj);
        this.date = result;
        this.allDay = false;
      }
    });

    //todo needs import from db
    this.nodeService.getFiles().then(files => this.nodes1 = files);
    this.nodeService.getHairCuts().then(files => this.nodes2 = files);

    this.dataService.showModalAddAppointment.subscribe(value => {
      this.displayModal = value;
      this.calendarApi = this.calendarService.calendarApi;
    });

  }

  closeModal() {
    this.displayModal = false;
  }

  addAppointment() {
    const phoneNumber = this.myForm.value.userPhone;
    const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
    this.service_obj = new ServiceClass(
      0,
      this.myForm.value.selectedService.label,
      this.myForm.value.selectedService.price,
      this.dataService.USER_ID
    )
    this.costumer_obj = new CostumerClass(
      0,
      this.myForm.value.userName,
      "",
      cleanNumber,
      this.myForm.value.selectedLang.label,
      this.dataService.USER_ID
    );
    this.appointment_obj = new AppointmentClass(
      0,
      this.dateForDB,
      this.costumer_obj,
      this.service_obj,
      this.costumer_obj.id,
      this.service_obj.id,
      this.dataService.USER_ID
    );
    this.dataService.addNewAppointment(this.appointment_obj).subscribe(
      result => {
        const currentDate = new Date(this.appointment_obj.date);
        const minutes = this.addMinutes(currentDate, 30);
        this.calendarApi.addEvent({
          id: result.id,
          title: this.service_obj.name,
          start: this.date,
          end: minutes,
          allDay: this.allDay
        });
        this.messages.showSuccess('Успешно добавлено');
        this.isSubmiting = false;
        this.closeModal();
      }, error => {
        this.messages.showError(error);
      }
    )
  }

  optionlog(event: MyNode) {
    this.selectedNode2 = event;
  }

  addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);

    return date;
  }

  submit() {
    this.isSubmiting = true;
    this.addAppointment();
  }

}
