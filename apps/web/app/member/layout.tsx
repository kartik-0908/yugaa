import { MemSidebar } from "../../components/Sidebar/MemberLayout";
import MemHeader from "../../utils/ui/MemHeader";

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col ">
      <div className="min-w-full h-[70px]">
        <MemHeader></MemHeader>
      </div>
      <div className="flex flex-row h-[calc(100vh-70px)] overflow-y-auto">
        <div className="w-[70px] border-r flex flex-row">
          <MemSidebar/>
        </div>
        <div className="w-[calc(100vw-70px)] p-2 bg-[#f1f5f9] overflow-y-auto ">
          {children}
        </div>
      </div>
    </div>
  )
}
