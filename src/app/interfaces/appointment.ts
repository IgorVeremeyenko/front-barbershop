import { Costumer } from "./costumer";
import { Service } from "./service";

export interface Appointment {
    id: number,
    date: Date | string,
    costumerId: number,
    serviceId: number,
    status: string,
    userId: number,
    masterId: number,
    timezoneOffset: number
}
