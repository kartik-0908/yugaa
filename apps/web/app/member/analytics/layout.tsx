import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Filter from "./DateFilter";

export default function LayoutAnalytics({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Breadcrumb pageName="Analytics" />
            <Filter />
            {children}
        </>
    )
    // }

}
