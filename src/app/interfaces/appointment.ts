import { Costumer } from "./costumer";
import { Service } from "./service";

export interface Appointment {
    id: number,
    date: Date | string,
    costumer: Costumer | undefined,
    service: Service | undefined,
    costumerId: number,
    serviceId: number,
    userId: number
}
