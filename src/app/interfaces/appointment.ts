export interface Appointment {
    id: number,
    date: Date
    costumerId: number,
    serviceId: number,
    status: string,
    userId: number,
    masterId: number,
    timezoneOffset: number,
    serviceName: string | undefined,
    servicePrice: number | undefined
}
