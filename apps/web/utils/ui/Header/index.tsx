import Link from "next/link";
import Image from "next/image";
import DropdownNotification from "./DropdownNotification";
import Invite from "./Invite";
import UserComponent from "./UserDropdown";

const Header = () => {
  return (
    <header className="h-full flex w-full bg-white dark:bg-boxdark ">
      <div className="flex flex-grow items-center justify-between border-[#D3D3D3] border-b-[1px] px-4">
        <div className="flex justify-center flex-grow">
          <div className="relative">
            <Link href="/">
              <Image
                width={160}
                height={32}
                src={"/images/logo/logoblue.png"}
                alt="Logo"
              />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <Invite />
            <DropdownNotification />
          </ul>
         <UserComponent/>
        </div>
      </div>

    </header>
  );
};

export default Header;
