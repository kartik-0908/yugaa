import ChatList from "./Sidebar";

export default function home({ children }: any) {
    return (
        <div className="w-full bg-white border-r-[#D3D3D3] border-r-[1px] h-full">
            <div className="flex">
                <div className="max-w-[380px] w-full">
                    <div className="h-20 text-2xl pl-3 font-bold text-black text-ellipsis">
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
