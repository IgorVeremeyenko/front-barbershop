import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {BlockUIModule} from 'primeng/blockui';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { ListboxModule } from 'primeng/listbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { FocusTrapModule } from 'primeng/focustrap';
import { CheckboxModule } from 'primeng/checkbox';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import {FormsModule} from '@angular/forms'; 
import {InputTextModule} from 'primeng/inputtext';
import {CascadeSelectModule} from 'primeng/cascadeselect';
import {TreeSelectModule} from 'primeng/treeselect';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {RippleModule} from 'primeng/ripple';
import {InputMaskModule} from 'primeng/inputmask';
import {ProgressBarModule} from 'primeng/progressbar';
import {PanelMenuModule} from 'primeng/panelmenu';
import {TableModule} from 'primeng/table';
import {AvatarModule} from 'primeng/avatar';
import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    BrowserAnimationsModule,
    BlockUIModule,
    DropdownModule,
    MenubarModule,
    ButtonModule,
    ListboxModule,
    RadioButtonModule,
    PanelModule,
    AccordionModule,
    CalendarModule,
    TabViewModule,
    FocusTrapModule,
    CheckboxModule,
    TreeTableModule,
    TreeModule,
    FormsModule,
    InputTextModule,
    CascadeSelectModule,
    TreeSelectModule,
    SelectButtonModule,
    ToastModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    RippleModule,
    InputMaskModule,
    ProgressBarModule,
    PanelMenuModule,
    TableModule,
    AvatarModule,
    InputNumberModule
  ],
  exports: [
    ButtonModule,
    BrowserAnimationsModule,
    BlockUIModule,
    DialogModule,
    DropdownModule,
    MenubarModule,
    ButtonModule,
    ListboxModule,
    RadioButtonModule,
    PanelModule,
    AccordionModule,
    CalendarModule,
    TabViewModule,
    FocusTrapModule,
    CheckboxModule,
    TreeTableModule,
    TreeModule,
    FormsModule,
    InputTextModule,
    CascadeSelectModule,
    TreeSelectModule,
    SelectButtonModule,
    ToastModule,
    ConfirmDialogModule,
    MessagesModule,
    MessageModule,
    RippleModule,
    InputMaskModule,
    ProgressBarModule,
    PanelMenuModule,
    TableModule,
    AvatarModule,
    InputNumberModule
  ],
  providers: [ConfirmationService,MessageService]
})
export class ModulesModule { }
