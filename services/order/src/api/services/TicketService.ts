import { Ticket, ITicket } from 'global-database';

export class TicketService{
    private ticketRepository = Ticket;

    async getEventById(id:string){
        const findTicket = await this.ticketRepository.findOne({ where: {id: id} });
        return findTicket;
    }

    async saveEventData(ticket: ITicket){
        await this.ticketRepository.save(ticket);
    }
}