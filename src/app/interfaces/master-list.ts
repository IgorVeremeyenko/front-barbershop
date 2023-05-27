import { Schedule } from "./schedule";

export interface MasterList {
    id: number,
    name: string,
    serviceName: string[],
    category: string[],
    phone: string,
    days: Schedule[]
}
