import ChatList from "./Sidebar";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="grid grid-cols-8">
                <div className="h-[600px] col-span-2">
                    <ChatList />
                </div>
                <div className="h-[600px] col-span-6 rounded-sm border border-stroke bg-white py-6 dark:border-strokedark dark:bg-boxdark ">
                    {children}
                </div>
            </div>


        </>
    )
}
