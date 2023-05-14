import { Schedule } from "./schedule";

export interface MasterList {
    id: number,
    name: string,
    category: string[],
    phone: string,
    days: Schedule[]
}
