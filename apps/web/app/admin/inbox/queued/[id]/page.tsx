import axios from "axios"
import { auth } from "@clerk/nextjs/server";
import RightPanelToggle, { EventCard } from "../../Collapsible";
import { fetchTicketEventsbyId } from "../../../../../actions/inbox";
import { formatDate } from "../../../../../common/function";
import UserCard from "../../unassigned/[id]/UserCard";
import AiCard from "../../unassigned/[id]/AiCard";

async function fetchEvents(id: string) {
    const events = await fetchTicketEventsbyId(id);
    // events.forEach((event: any) => {
    // console.log(event)
    // if (event.type === 'ESCALATED') {
    //     setSubject(event.ESCALATED.subject)
    //     setEmail(event.ESCALATED.userEmail)
    // }
    // if (event.Ticket.displayId) {
    //     setDisplayId(event.Ticket.displayId)
    // }
    // });
    return events
}

export default async function ticket({ params }: any) {
    const { sessionClaims } = auth()
    return (
        <RightPanelToggle id={params.id} />
    )
}
