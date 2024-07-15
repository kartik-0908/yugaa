import Filter from "./DateFilter";

export default function LayoutAnalytics({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Filter />
            {children}
        </>
    )
    // }

}
