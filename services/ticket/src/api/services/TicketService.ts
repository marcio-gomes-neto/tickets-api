import { Ticket, ITicket } from 'global-database';

export class TicketService{
    private ticketRepository = Ticket;
    private softData = ['id', 'name', 'description', 'genre', 'type', 'quantity', 'price', 'eventDate'];
    async getEventByName(name:string){
        const findTicket = await this.ticketRepository.find({where: {name: name}});
        return findTicket;
    }

    async softGetAllPossibleTickets(){
        const tickets = await this.ticketRepository.find({select: this.softData, where: 'CURRENT_TIMESTAMP < event_date AND active=true' });
        return tickets;
    }

    async softGetAllTickets(){
        const tickets = await this.ticketRepository.find({select: this.softData, where: 'active=true' });
        return tickets;
    }

    async getAllTickets(){
        const tickets = await this.ticketRepository.find();
        return tickets;
    }

    async createNewTicket(ticket:ITicket) {
        const eventCreated = await this.ticketRepository.save(ticket);
        return eventCreated;
    }

    async deactivateEvent(ticket: ITicket){
        ticket.active = false;
        await this.ticketRepository.save(ticket);
    }

    async activateEvent(ticket: ITicket){
        ticket.active = true;
        await this.ticketRepository.save(ticket);
    }

    async getEventById(id:string){
        const findTicket = await this.ticketRepository.findOne({select: this.softData, where: {id: id}});
        return findTicket;
    }

    async saveEventData(ticket: ITicket){
        await this.ticketRepository.save(ticket);
    }
}