import ChatList from "../unassigned/Sidebar";

export default function home({ children }: any) {
    return (
        <div className="w-full h-full flex flex-row ">
            <div className="w-2/7 h-full border-r-1 border-stroke">
                <div className="h-[8%] text-lg flex flex-col justify-center items-center border-b-1 border-stroke ">
                    Queued
                </div>
                <div className="h-[92%] ">
                    <ChatList status="Queued" />
                </div>
            </div>
            <div className="flex-1 w-5/7 h-full">
                {children}
            </div>
        </div>
    );
}
