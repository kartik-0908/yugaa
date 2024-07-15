import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Element({ content, link, children }: any) {
    const pathname = usePathname();

    return (
        <Tooltip
            placement="right"
            content={content}
            delay={0}
            closeDelay={0}
        >
            <Link
                href={link}
                className={`group relative flex items-center justify-center p-2 gap-2.5 py-2  rounded-md font-medium hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes(content) &&
                    "bg-graydark dark:bg-meta-4"
                    }`}
            >
                {children}
            </Link>
        </Tooltip>
    )
}