import Sidebar from "../../components/Sidebar/MainLayout";
import Header from "../../utils/ui/Header";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col ">
      <div className="min-w-full h-[70px]">
        <Header></Header>
      </div>
      <div className="flex flex-row h-[calc(100vh-70px)] overflow-y-auto">
        <div className="w-[70px] border-r flex flex-row">
          <Sidebar/>
        </div>
        <div className="w-[calc(100vw-70px)] p-2 bg-[#f1f5f9] overflow-y-auto ">
          {children}
        </div>
      </div>
    </div>

  )


}
