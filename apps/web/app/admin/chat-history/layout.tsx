import ChatList from "./Sidebar";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full w-full flex flex-row">
            <div className="h-full w-1/7 ">
                <ChatList />
            </div>
            <div className="h-full w-6/7 flex-grow border border-stroke bg-white">
                {children}
            </div>
        </div>
    )
}
