// export interface Costumer {
//     id: number,
//     name: string | any,
//     email: string,
//     phone: string | any,
//     language: string | any,
//     userId: number
// }

import { Appointment } from "./appointment";

export interface Costumer {
    id: number,
    name: string,
    phone: string,
    rating: number,
    email: string,
    language: string,
    userId: number,
    appointments: Appointment[]
}
