"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Element({ content, link, children }: any) {
    const pathname = usePathname();
    return (
        <Link
            href={link}
            className={`group text-black relative flex items-center justify-center  gap-2 py-1 rounded-md font-medium ${pathname.includes(content) &&
                "bg-graydark dark:bg-meta-4"
                }`}
        >
            {children}
        </Link>
    )
}