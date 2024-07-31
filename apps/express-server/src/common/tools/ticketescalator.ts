import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { publishTicketEscalate } from "../pubsubPublisher";
const escalatorSchema = z.object({
    shopDomain: z.string(),
});
export const TicketEscalatorTool = tool(
    async (input: { shopDomain: string }, config): Promise<any> => {
        return `Ticket escalated and will be responded to given email Id`
    },
    {
        name: "TicketEscalatorTool",
        description: "Use this tool to escalate the ticket to Human Operator",
        schema: escalatorSchema,
    }
);
