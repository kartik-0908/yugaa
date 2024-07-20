import InboxSidebar from "../../../components/Sidebar/InboxLayout/InboxSideBar";
export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full flex flex-row bg-white">
            <div className="w-1/7 h-full border-r-2 border-stroke">
                <InboxSidebar />
            </div>
            <div className=" h-full w-6/7 flex-grow">
                {children}
            </div>
        </div>
    )
}
