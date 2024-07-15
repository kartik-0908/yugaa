import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import MemberinboxSidebar from "@/components/Sidebar/InboxLayout/MemberInboxSidebar";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
    return (
        <div className="">
            <Breadcrumb pageName="Inbox"></Breadcrumb>
            <div className="grid grid-cols-8 bg-transparent ">
                <div className="col-span-1 border-r-[#D3D3D3] border-r-[1px]">
                    <MemberinboxSidebar />
                </div>
                <div className="col-span-7 h-full">
                {children}
                </div>
            </div>
        </div>
    )
}
