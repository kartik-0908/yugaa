import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InboxSidebar from "@/components/Sidebar/InboxLayout/InboxSideBar";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
    
    return (
        <div className="">
            <Breadcrumb pageName="Inbox"></Breadcrumb>
            <div className="grid grid-cols-8 bg-transparent ">
                <div className="col-span-1 border-r-[#D3D3D3] border-r-[1px]">
                    <InboxSidebar />
                </div>
                <div className="col-span-7 h-full">
                    {children}
                </div>
            </div>
        </div>
    )
}
