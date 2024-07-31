"use client"
import { Link, Tooltip } from "@nextui-org/react";

export default function Element({ content, link, children }: any) {
    return (
        <Tooltip
            placement="right"
            content={content}
            delay={0}
            closeDelay={0}
        >
            <Link
                href={link}
                color="foreground"
                underline="none"
            >
                {children}
            </Link>
        </Tooltip>
    )
}