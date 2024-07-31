"use server"

import db from "../lib/db";

export async function getChats({ shopDomain, offset, count, filter }: { shopDomain: string, offset: number, count: number, filter: string }) {
    console.log(filter)
    if (filter === 'all') {
        try {
            const retcount = await db.ticket.count({
                where: {
                    shopDomain: shopDomain,
                    events: {
                        some: {
                            type: {
                                in: ['AI_TO_USER', 'USER_TO_AI']
                            }
                        }
                    }
                },
            });
            const tickets = await db.ticket.findMany({
                skip: offset,
                take: count,
                where: {
                    shopDomain: shopDomain
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    events: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 1,
                        select: {
                            type: true,
                            id: true,
                            createdAt: true,
                            'AI_TO_USER': true,
                            'USER_TO_AI': true
                        },
                    }
                },
            });
            return {
                retcount, tickets
            }
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    else if (filter === 'answered') {
        try {
            const retcount = await db.ticket.count({
                where: {
                    shopDomain: shopDomain,
                    events: {
                        every: {
                            AI_TO_USER: {
                                is: {
                                    unanswered: false
                                }
                            }
                        },
                    },
                },
            });
            const tickets = await db.ticket.findMany({
                skip: offset,
                take: count,
                where: {
                    shopDomain: shopDomain,
                    events: {
                        every: {
                            AI_TO_USER: {
                                is: {
                                    unanswered: false
                                }
                            }
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    events: {
                        orderBy: {
                            createdAt: 'desc',
                        },
                        take: 1,
                        select: {
                            type: true,
                            id: true,
                            createdAt: true,
                            'AI_TO_USER': true,
                            'USER_TO_AI': true
                        },
                    }
                },
            });
            console.log(retcount)
            return {
                retcount, tickets
            }

        } catch (error) {
            console.log(error)
            return null;
        }
    }

}