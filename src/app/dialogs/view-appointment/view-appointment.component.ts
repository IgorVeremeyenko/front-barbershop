import { Component } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CalendarService } from 'src/app/services/calendar.service';
import { DataService } from 'src/app/services/data.service';
import autoTable from 'jspdf-autotable';
import 'jspdf-autotable';
import { MyMessageService } from 'src/app/services/my-message.service';
import { saveAs } from 'file-saver';
import { Appointment } from 'src/app/interfaces/appointment';
import { font } from 'src/assets/fonts/font';
import { Costumer } from 'src/app/interfaces/costumer';
import { Service } from 'src/app/interfaces/service';

@Component({
  selector: 'app-view-appointment',
  templateUrl: './view-appointment.component.html',
  styleUrls: ['./view-appointment.component.css'],
  providers: [ConfirmationService, MyMessageService]
})
export class ViewAppointmentComponent {

  isSubmiting = false;

  costumer_data$ = this.dataService.appointment_data_subject;

  serviceOption: any;

  items: MenuItem[] = [];//doesn't work context menu

  user: any[] = [];

  appointment!: Appointment;

  APPOINTMENT_ID!: number;

  exportColumns: any[] = [];

  cols: any[];

  displayModalAppointment = false;

  constumer!: Costumer;

  service!: Service;

  constructor(private msg: MyMessageService, private dataService: DataService, private confirmationService: ConfirmationService, private calendarService: CalendarService) {

    this.costumer_data$.subscribe(data => {
      if(data.costumerId === 0){
        return;
      }
      this.dataService.getCostumerById(data.costumerId).subscribe(costumer_res => {
        this.constumer = costumer_res;
        this.dataService.getSericeById(data.serviceId).subscribe(service_res => {
          this.service = service_res;
          const outputDate = this.convertDate(data.date);
          const obj = {
            id: data.id,
            date: outputDate,
            name: this.constumer.name,
            service: `${this.service.category}/${this.service.name}`,
            lang: this.constumer.language,
            price: this.service.price,
            phone: this.constumer.phone
          }
          this.user.push(obj);
          this.appointment = data;
          this.displayModalAppointment = true;
        })
      })
    });

    this.cols = [
      { field: 'date', header: 'Дата' },
      { field: 'name', header: 'Имя' },
      { field: 'service', header: 'Услуга' },
      { field: 'lang', header: 'Язык' },
      { field: 'price', header: 'Стоимость' },
      { field: 'phone', header: 'Телефон' }
    ];

    this.exportColumns = this.cols.map(col => ({
      title: col.header,
      dataKey: col.field
    }));

    this.items = [
      {label: 'Изменить время', icon: 'pi pi-file-edit', command: () => {
        //todo
      }},
  ];

  }

  confirm(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      header: 'Подтверждение удаления',
      message: 'Вы действительно хотите удалить запись?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isSubmiting = true;
        this.dataService.removeAppointment(this.appointment.id).subscribe(res => {
          this.msg.showSuccess('Запись удалена');
          this.isSubmiting = false;
          this.calendarService.clickInfoCurrent.event.remove();
          // this.closeAppointmentModal();
          // this.showInfo('Запись удалена')
        }, error => {
          console.log(error)
          // this.showError(error);
          this.msg.showError(error);
          this.isSubmiting = false;
        })
      },
      reject: () => {
        // this.msgs = [{ severity: 'info', summary: 'info', detail: 'Вы отменили удаление' }];
      }
    });
  }

  convertDate(date: Date | string) {
    const inputDate = new Date(date);
    const options = { day: '2-digit', month: 'long', hour: 'numeric', minute: 'numeric' } as const;
    const outputDate = inputDate.toLocaleString('ru-RU', options);
    return outputDate;
  }

  callAddFont(doc: any, font: any) {
    doc.addFileToVFS('Roboto-Regular-normal.ttf', font);
    doc.addFont('Roboto-Regular-normal.ttf', 'Roboto-Regular', 'normal');
    doc.setFont('Roboto-Regular');
  };


  exportPdf() {
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('l');
        this.callAddFont(doc, font);
        const outputDate = this.convertDate(this.appointment.date);
        const page = {
          startY: 30,
          head: [['ID', 'Имя', 'Услуга', 'Дата', 'Телефон', 'Цена (€)']],
          body: [
            [this.appointment.id,
             this.constumer.name,
            `${this.service.category}/${this.service.name}`,
              outputDate,
            this.constumer.phone,
            this.service.price
            ],
          ],
          bodyStyles: {
            font: 'Roboto-Regular',
          },
          headStyles: {
            font: 'Roboto-Regular'
          }
        };
        autoTable(doc, page);
        doc.save(`appointment-${outputDate}.pdf`);
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.user);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  hide() {
    this.dataService.updateAppointmentData(this.dataService.defaults);
    this.user = [];
    this.displayModalAppointment = false;
  }

}
