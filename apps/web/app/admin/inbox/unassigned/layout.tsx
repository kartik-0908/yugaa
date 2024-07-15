import ChatList from "./Sidebar";

export default function home({ children }: any) {
    return (
        <div className="w-full bg-white h-full">
            <div className="flex">
                <div className="max-w-[380px] w-full">
                    <div className="h-20 text-2xl pl-3 font-bold text-black text-ellipsis border border-stroke flex flex-col justify-center items-center">
                        <h2>Unassigned</h2>
                    </div>
                    <ChatList />
                </div>
                <div className="flex-1 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
