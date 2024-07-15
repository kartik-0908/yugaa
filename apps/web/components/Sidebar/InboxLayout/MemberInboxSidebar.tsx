import React, { } from "react";
import { usePathname } from "next/navigation";
import { menuItems } from "./items";
import Element from "./Card";

const MemberinboxSidebar = () => {
  return (
    <>
      <div className="no-scrollbar flex flex-col p-2 overflow-y-auto flex-grow">
        <nav className="mt-5">
          <div>
            <ul className="flex flex-col gap-1.5">
              {menuItems.map((item, index) => (
                <li key={index} className="flex justify-start">
                  <Element link={item.link} content={item.content}>
                    {item.svg} {item.content}
                  </Element>
                </li>
              ))}
            </ul>
            <p className="text-[#636E7B] font-bold text-xs mt-4 mb-2">
              Operator Restrictions
            </p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MemberinboxSidebar;
